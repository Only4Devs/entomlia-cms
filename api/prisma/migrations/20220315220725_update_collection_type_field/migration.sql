-- AlterTable
ALTER TABLE `CollectionTypeField` ADD COLUMN `makeUrl` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sourceUrl` VARCHAR(255) NULL;
