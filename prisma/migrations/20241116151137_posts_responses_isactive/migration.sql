-- AlterTable
ALTER TABLE `post` ADD COLUMN `IsActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `response` ADD COLUMN `IsActive` BOOLEAN NOT NULL DEFAULT true;
