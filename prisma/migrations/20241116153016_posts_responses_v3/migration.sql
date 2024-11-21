/*
  Warnings:

  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `content` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `response` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `message` VARCHAR(300) NOT NULL;

-- CreateIndex
CREATE INDEX `Post_createdAt_idx` ON `Post`(`createdAt`);

-- CreateIndex
CREATE INDEX `Response_createdAt_idx` ON `Response`(`createdAt`);
