-- AlterTable
ALTER TABLE `order` ADD COLUMN `agentId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Order_agentId_idx` ON `Order`(`agentId`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
