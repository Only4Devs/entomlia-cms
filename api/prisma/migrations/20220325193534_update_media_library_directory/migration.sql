/*
  Warnings:

  - Added the required column `slug` to the `MediaLibraryDirectory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MediaLibraryDirectory` ADD COLUMN `slug` VARCHAR(255) NOT NULL;
