import type { PrismaClient } from '@prisma/client'
import { type AuditContext, serializeForAudit, writeAuditLog } from '~/server/utils/auditLog'

type PrismaTx = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

export async function deleteVoucherWithDependencies(
  tx: PrismaTx,
  voucherId: string,
  audit?: AuditContext,
) {
  const snapshot = audit
    ? await tx.voucher.findUnique({
        where: { id: voucherId },
        include: {
          agentSale: true,
          location: true,
          batch: true,
        },
      })
    : null

  await tx.agentSale.deleteMany({ where: { voucherId } })
  await tx.voucher.delete({ where: { id: voucherId } })

  if (audit && snapshot) {
    await writeAuditLog(tx, {
      ...audit,
      action: 'VOUCHER_DELETED',
      entity: 'Voucher',
      entityId: voucherId,
      details: {
        snapshot: serializeForAudit(snapshot),
        deletedAt: new Date().toISOString(),
      },
    })
  }
}

export async function deleteLocationWithDependencies(
  tx: PrismaTx,
  locationId: string,
  audit?: AuditContext,
) {
  const snapshot = audit
    ? await tx.location.findUnique({
        where: { id: locationId },
        include: {
          vouchers: { include: { agentSale: true } },
          batches: true,
          agentPurchases: true,
          agentDiscounts: true,
          adLinks: true,
          agentProfiles: {
            select: { id: true, displayName: true, userId: true },
          },
        },
      })
    : null

  const batches = await tx.voucherBatch.findMany({
    where: { locationId },
    select: { id: true },
  })
  const batchIds = batches.map((batch) => batch.id)

  const vouchers = await tx.voucher.findMany({
    where: { locationId },
    select: { id: true },
  })
  const voucherIds = vouchers.map((voucher) => voucher.id)

  if (voucherIds.length > 0) {
    await tx.agentSale.deleteMany({ where: { voucherId: { in: voucherIds } } })
    await tx.voucher.deleteMany({ where: { id: { in: voucherIds } } })
  }

  const purchaseFilter = batchIds.length > 0
    ? { OR: [{ locationId }, { batchId: { in: batchIds } }] }
    : { locationId }

  const purchases = await tx.agentPurchase.findMany({
    where: purchaseFilter,
    select: { id: true },
  })
  const purchaseIds = purchases.map((purchase) => purchase.id)

  if (purchaseIds.length > 0) {
    await tx.agentSale.deleteMany({ where: { agentPurchaseId: { in: purchaseIds } } })
    await tx.agentPurchase.deleteMany({ where: { id: { in: purchaseIds } } })
  }

  const discountFilter = batchIds.length > 0
    ? { OR: [{ locationId }, { batchId: { in: batchIds } }] }
    : { locationId }

  await tx.agentVoucherDiscount.deleteMany({ where: discountFilter })

  await tx.orderItem.updateMany({
    where: { locationId },
    data: { locationId: null },
  })

  if (batchIds.length > 0) {
    await tx.orderItem.updateMany({
      where: { batchId: { in: batchIds } },
      data: { batchId: null },
    })
  }

  await tx.agentProfile.updateMany({
    where: { locationId },
    data: { locationId: null },
  })

  if (batchIds.length > 0) {
    await tx.voucherBatch.deleteMany({ where: { id: { in: batchIds } } })
  }

  await tx.location.delete({ where: { id: locationId } })

  if (audit && snapshot) {
    await writeAuditLog(tx, {
      ...audit,
      action: 'LOCATION_DELETED',
      entity: 'Location',
      entityId: locationId,
      details: {
        snapshot: serializeForAudit(snapshot),
        deletedAt: new Date().toISOString(),
      },
    })
  }
}

export async function deleteBatchWithDependencies(
  tx: PrismaTx,
  batchId: string,
  audit?: AuditContext,
) {
  const snapshot = audit
    ? await tx.voucherBatch.findUnique({
        where: { id: batchId },
        include: {
          location: true,
          vouchers: { include: { agentSale: true } },
          agentPurchases: true,
          agentDiscounts: true,
        },
      })
    : null

  const voucherIds = (
    await tx.voucher.findMany({
      where: { batchId },
      select: { id: true },
    })
  ).map((voucher) => voucher.id)

  if (voucherIds.length > 0) {
    await tx.agentSale.deleteMany({ where: { voucherId: { in: voucherIds } } })
    await tx.voucher.deleteMany({ where: { id: { in: voucherIds } } })
  }

  await tx.agentSale.deleteMany({
    where: {
      agentPurchase: { batchId },
    },
  })
  await tx.agentPurchase.deleteMany({ where: { batchId } })
  await tx.agentVoucherDiscount.deleteMany({ where: { batchId } })
  await tx.orderItem.updateMany({ where: { batchId }, data: { batchId: null } })
  await tx.voucherBatch.delete({ where: { id: batchId } })

  if (audit && snapshot) {
    await writeAuditLog(tx, {
      ...audit,
      action: 'VOUCHER_BATCH_DELETED',
      entity: 'VoucherBatch',
      entityId: batchId,
      details: {
        snapshot: serializeForAudit(snapshot),
        deletedAt: new Date().toISOString(),
      },
    })
  }
}
