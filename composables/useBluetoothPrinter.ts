/**
 * Composable for connecting to a Bluetooth thermal (ESC/POS) printer and sending raw data.
 * Uses VueUse useBluetooth; after connection, resolves the write characteristic and sends bytes.
 */
import { useBluetooth } from '@vueuse/core'

// Common BLE service UUIDs for thermal/POS printers (try in order)
const THERMAL_PRINTER_SERVICES = [
  'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
  '49535343-fe7d-4ae5-8fa9-9fafd205e455',
]

// Standard GATT service UUIDs some devices require in optionalServices
const GATT_OPTIONAL_SERVICES = [
  '00001800-0000-1000-8000-00805f9b34fb',
  '00001801-0000-1000-8000-00805f9b34fb',
  '0000180a-0000-1000-8000-00805f9b34fb',
  '000018f0-0000-1000-8000-00805f9b34fb',
  ...THERMAL_PRINTER_SERVICES,
]

export function useBluetoothPrinter() {
  const { isSupported, device, requestDevice, isConnected, server, error } = useBluetooth({
    acceptAllDevices: true,
    optionalServices: GATT_OPTIONAL_SERVICES,
  })

  const writeCharacteristic = shallowRef<BluetoothRemoteGATTCharacteristic | null>(null)
  const isPrinting = ref(false)
  const connectionError = ref<string | null>(null)

  // When GATT server is available, resolve the write characteristic
  watch(
    [server, isConnected],
    async () => {
      writeCharacteristic.value = null
      const s = server.value
      if (!s || !isConnected.value) return
      try {
        for (const serviceUuid of THERMAL_PRINTER_SERVICES) {
          try {
            const service = await s.getPrimaryService(serviceUuid)
            const characteristics = await service.getCharacteristics()
            let withResponse: BluetoothRemoteGATTCharacteristic | null = null
            let withoutResponse: BluetoothRemoteGATTCharacteristic | null = null
            for (const c of characteristics) {
              if (c.properties.write) withResponse = c
              else if (c.properties.writeWithoutResponse) withoutResponse = c
            }
            const chosen = withResponse ?? withoutResponse
            if (chosen) {
              writeCharacteristic.value = chosen
              return
            }
          } catch {
            continue
          }
        }
      } catch (e) {
        connectionError.value = e instanceof Error ? e.message : String(e)
      }
    },
    { immediate: true }
  )

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  async function printRaw(data: Uint8Array): Promise<void> {
    const char = writeCharacteristic.value
    if (!char) {
      throw new Error('Printer not ready. Connect to a Bluetooth printer first.')
    }
    isPrinting.value = true
    connectionError.value = null
    try {
      // Small chunks + delay between chunks to avoid "GATT operation failed"
      // (BLE MTU and printer buffer limits; some devices need time between writes)
      const chunkSize = 100
      const useResponse = char.properties.write
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.subarray(i, Math.min(i + chunkSize, data.length))
        if (useResponse) {
          await char.writeValue(chunk)
        } else {
          await char.writeValueWithoutResponse(chunk)
        }
        await delay(40)
      }
    } finally {
      isPrinting.value = false
    }
  }

  function disconnect() {
    device.value?.gatt?.disconnect()
    writeCharacteristic.value = null
  }

  return {
    isSupported,
    device,
    server,
    isConnected,
    error,
    requestDevice,
    printRaw,
    isPrinting,
    writeCharacteristic,
    connectionError,
    disconnect,
  }
}
