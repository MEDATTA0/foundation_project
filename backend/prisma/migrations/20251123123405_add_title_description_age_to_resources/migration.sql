-- AlterTable
ALTER TABLE `resources` ADD COLUMN `age_max` INTEGER NULL,
    ADD COLUMN `age_min` INTEGER NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `title` VARCHAR(191) NULL;
