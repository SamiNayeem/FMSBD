-- AlterTable
ALTER TABLE `chat` ADD COLUMN `lastMessage` VARCHAR(191) NULL,
    ADD COLUMN `lastMessageAt` DATETIME(3) NULL;
