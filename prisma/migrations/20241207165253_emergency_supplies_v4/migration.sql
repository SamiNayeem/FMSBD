/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `area` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `city` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `division` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `supply` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `area` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `city` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `division` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `supply` DROP COLUMN `updatedAt`;
