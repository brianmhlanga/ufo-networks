const TOWN_COORDS: Record<string, [number, number]> = {
  Harare: [-17.8252, 31.0335],
  Bulawayo: [-20.1486, 28.5801],
  Mutare: [-18.9726, 32.6709],
  Gweru: [-19.4563, 29.8148],
  Kwekwe: [-18.9281, 29.8148],
  Kadoma: [-18.3333, 29.9167],
  Chinhoyi: [-17.3667, 30.2],
  Marondera: [-18.1833, 31.55],
  Chegutu: [-18.1333, 30.1333],
  Bindura: [-17.3, 31.3333],
  Chitungwiza: [-18.0128, 31.0756],
  Epworth: [-17.8833, 31.15],
  Ruwa: [-17.9167, 31.2333],
  Norton: [-17.8833, 30.7],
  Masvingo: [-20.0667, 30.8333],
  Zvishavane: [-20.3333, 30.0333],
  Shurugwi: [-19.6667, 30],
  Gokwe: [-18.2167, 28.9333],
  Beitbridge: [-22.2167, 30],
  Chiredzi: [-21.05, 31.6667],
  Chipinge: [-20.2, 32.6167],
  Kariba: [-16.5167, 28.8],
  Karoi: [-16.8167, 29.6167],
  Shamva: [-17.3167, 31.55],
  Mazowe: [-17.5167, 30.9667],
  Goromonzi: [-17.8, 31.3667],
  Wedza: [-18.6333, 31.5667],
  Murehwa: [-17.65, 31.7833],
  'Victoria Falls': [-17.9243, 25.8572],
  Hwange: [-18.3667, 26.5],
  Lupane: [-18.9333, 27.8],
  Tsholotsho: [-19.7667, 27.7],
}

type LocationLike = {
  latitude?: number | null
  longitude?: number | null
  town?: string | null
  name?: string | null
  meta?: unknown
}

export function resolveLocationCoords(location: LocationLike): { lat: number; lng: number } {
  if (location.latitude != null && location.longitude != null) {
    return { lat: location.latitude, lng: location.longitude }
  }

  const meta = location.meta as { coordinates?: { lat?: number; lng?: number } } | null
  if (meta?.coordinates?.lat != null && meta?.coordinates?.lng != null) {
    return { lat: meta.coordinates.lat, lng: meta.coordinates.lng }
  }

  const townKey = Object.keys(TOWN_COORDS).find((key) =>
    location.town?.toLowerCase().includes(key.toLowerCase())
    || location.name?.toLowerCase().includes(key.toLowerCase())
  )

  if (townKey) {
    const [lat, lng] = TOWN_COORDS[townKey]
    return { lat, lng }
  }

  return { lat: -17.8252, lng: 31.0335 }
}

export function getStaticMapUrl(lat: number, lng: number, width = 600, height = 220): string {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=14&size=${width}x${height}&maptype=mapnik&markers=${lat},${lng},red-pushpin`
}

export function getMapsLink(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`
}
