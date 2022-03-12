-- AlterTable
ALTER TABLE `MediaLibrary` ADD COLUMN `mediaLibraryDirectoryId` INTEGER NULL;

-- CreateTable
CREATE TABLE `MediaLibraryDirectory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MediaLibrary` ADD CONSTRAINT `MediaLibrary_mediaLibraryDirectoryId_fkey` FOREIGN KEY (`mediaLibraryDirectoryId`) REFERENCES `MediaLibraryDirectory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
