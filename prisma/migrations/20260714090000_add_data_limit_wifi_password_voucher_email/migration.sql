-- AlterTable: data cap advertised on vouchers (null = no cap advertised)
ALTER TABLE `VoucherBatch` ADD COLUMN `dataLimitGb` INTEGER NULL;
ALTER TABLE `Voucher` ADD COLUMN `dataLimitGb` INTEGER NULL;

-- AlterTable: WPA passphrase printed on vouchers so buyers can join the SSID
ALTER TABLE `Location` ADD COLUMN `wifiPassword` VARCHAR(191) NULL;

-- AlterTable: guards against emailing voucher PINs twice when the Paynow IPN and the
-- client-side status poll confirm the same payment
ALTER TABLE `Order` ADD COLUMN `voucherEmailSentAt` DATETIME(3) NULL;
