/*
  Warnings:

  - You are about to drop the column `createdAt` on the `response` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `response` table. All the data in the column will be lost.
  - You are about to alter the column `message` on the `response` table. The data in that column could be lost. The data in that column will be cast from `VarChar(300)` to `VarChar(191)`.

*/
-- DropForeignKey
ALTER TABLE `response` DROP FOREIGN KEY `Response_postId_fkey`;

-- DropForeignKey
ALTER TABLE `response` DROP FOREIGN KEY `Response_userId_fkey`;

-- DropIndex
DROP INDEX `Response_createdAt_idx` ON `response`;

-- DropIndex
DROP INDEX `Response_postId_userId_key` ON `response`;

-- AlterTable
ALTER TABLE `response` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `message` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Response` ADD CONSTRAINT `Response_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Response` ADD CONSTRAINT `Response_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
