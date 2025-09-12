/*
  Warnings:

  - Added the required column `hours` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfUsers` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `hours` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `numberOfUsers` INTEGER NOT NULL DEFAULT 1;

-- Update existing records with default values
UPDATE `orderitem` SET `hours` = 1, `numberOfUsers` = 1 WHERE `hours` IS NULL OR `numberOfUsers` IS NULL;

-- Remove default constraints after data is populated
ALTER TABLE `orderitem` ALTER COLUMN `hours` DROP DEFAULT;
ALTER TABLE `orderitem` ALTER COLUMN `numberOfUsers` DROP DEFAULT;
