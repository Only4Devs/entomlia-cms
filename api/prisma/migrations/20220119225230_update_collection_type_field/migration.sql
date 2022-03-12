/*
  Warnings:

  - Added the required column `defaultValue` to the `CollectionTypeField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CollectionTypeField` ADD COLUMN `defaultValue` VARCHAR(255) NOT NULL;
