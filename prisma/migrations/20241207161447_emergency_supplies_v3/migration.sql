/*
  Warnings:

  - You are about to drop the column `addedById` on the `supply` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `supply` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,cityId]` on the table `Area` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,divisionId]` on the table `City` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Division` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cityId` to the `Supply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Supply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divisionId` to the `Supply` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `area` DROP FOREIGN KEY `Area_cityId_fkey`;

-- DropForeignKey
ALTER TABLE `city` DROP FOREIGN KEY `City_divisionId_fkey`;

-- DropForeignKey
ALTER TABLE `supply` DROP FOREIGN KEY `Supply_addedById_fkey`;

-- AlterTable
ALTER TABLE `supply` DROP COLUMN `addedById`,
    DROP COLUMN `quantity`,
    ADD COLUMN `cityId` INTEGER NOT NULL,
    ADD COLUMN `createdBy` INTEGER NOT NULL,
    ADD COLUMN `divisionId` INTEGER NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Area_name_cityId_key` ON `Area`(`name`, `cityId`);

-- CreateIndex
CREATE UNIQUE INDEX `City_name_divisionId_key` ON `City`(`name`, `divisionId`);

-- CreateIndex
CREATE UNIQUE INDEX `Division_name_key` ON `Division`(`name`);

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `Division`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Area` ADD CONSTRAINT `Area_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supply` ADD CONSTRAINT `Supply_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `Division`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supply` ADD CONSTRAINT `Supply_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supply` ADD CONSTRAINT `Supply_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
