/*
  Warnings:

  - Added the required column `mimetype` to the `MediaLibrary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `MediaLibrary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MediaLibrary` ADD COLUMN `mimetype` VARCHAR(96) NOT NULL,
    ADD COLUMN `size` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `uid` VARCHAR(255) NOT NULL;
