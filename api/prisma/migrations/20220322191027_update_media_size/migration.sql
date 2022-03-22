/*
  Warnings:

  - Added the required column `slug` to the `MediaSize` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `MediaSize` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MediaSize` ADD COLUMN `slug` VARCHAR(255) NOT NULL,
    ADD COLUMN `title` VARCHAR(255) NOT NULL;
