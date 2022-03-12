-- CreateTable
CREATE TABLE `FormConfiguration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `collectionTypeId` INTEGER NULL,
    `content` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FormConfiguration` ADD CONSTRAINT `FormConfiguration_collectionTypeId_fkey` FOREIGN KEY (`collectionTypeId`) REFERENCES `CollectionType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
