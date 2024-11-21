/*
  Warnings:

  - You are about to drop the column `IsActive` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `IsActive` on the `response` table. All the data in the column will be lost.
  - You are about to drop the column `responderId` on the `response` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `response` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `response` DROP FOREIGN KEY `Response_responderId_fkey`;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `IsActive`,
    DROP COLUMN `timestamp`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `response` DROP COLUMN `IsActive`,
    DROP COLUMN `responderId`,
    DROP COLUMN `timestamp`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Response` ADD CONSTRAINT `Response_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
