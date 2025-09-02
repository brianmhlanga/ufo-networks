-- DropForeignKey
ALTER TABLE `voucher` DROP FOREIGN KEY `Voucher_batchId_fkey`;

-- AlterTable
ALTER TABLE `voucher` MODIFY `batchId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Voucher` ADD CONSTRAINT `Voucher_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `VoucherBatch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
