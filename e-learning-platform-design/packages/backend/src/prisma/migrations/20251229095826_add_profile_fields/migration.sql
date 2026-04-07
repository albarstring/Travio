-- AlterTable
ALTER TABLE `courses` MODIFY `thumbnail` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `location` VARCHAR(191) NULL,
    ADD COLUMN `notificationSettings` JSON NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `privacySettings` JSON NULL,
    ADD COLUMN `skills` TEXT NULL,
    ADD COLUMN `socialLinks` JSON NULL,
    ADD COLUMN `website` VARCHAR(191) NULL,
    MODIFY `avatar` TEXT NULL,
    MODIFY `bio` TEXT NULL;

-- CreateTable
CREATE TABLE `certificates` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `certificateUrl` TEXT NULL,
    `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `certificates_userId_courseId_key`(`userId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
