-- AlterTable
ALTER TABLE `users` ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `violationCount` INT NOT NULL DEFAULT 0,
    ADD COLUMN `lastViolationAt` DATETIME(3) NULL;

