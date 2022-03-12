-- CreateTable
CREATE TABLE `CollectionTypeField` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `collectionTypeId` INTEGER NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `fieldType` VARCHAR(255) NOT NULL,
    `isRequired` BOOLEAN NOT NULL DEFAULT false,
    `isUnique` BOOLEAN NOT NULL DEFAULT false,
    `position` INTEGER NULL DEFAULT 0,
    `minLength` INTEGER NULL DEFAULT 0,
    `maxLength` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `collection_type`(`collectionTypeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CollectionTypeField` ADD CONSTRAINT `CollectionTypeField_collectionTypeId_fkey` FOREIGN KEY (`collectionTypeId`) REFERENCES `CollectionType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
