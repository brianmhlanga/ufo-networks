-- AlterTable
ALTER TABLE `user` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX `User_status_idx` ON `User`(`status`);

-- AddForeignKey
ALTER TABLE `AgentPurchase` ADD CONSTRAINT `AgentPurchase_userId_fkey` FOREIGN KEY (`agentId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgentSale` ADD CONSTRAINT `AgentSale_userId_fkey` FOREIGN KEY (`agentId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
