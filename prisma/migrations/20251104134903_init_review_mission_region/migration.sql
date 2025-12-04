/*
  Warnings:

  - Made the column `created_by_user_id` on table `store` required. This step will fail if there are existing NULL values in that column.
  - Made the column `region_id` on table `store` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `store` DROP FOREIGN KEY `store_created_by_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `store` DROP FOREIGN KEY `store_region_id_fkey`;

-- DropIndex
DROP INDEX `store_created_by_user_id_fkey` ON `store`;

-- AlterTable
ALTER TABLE `store` MODIFY `created_by_user_id` INTEGER NOT NULL,
    MODIFY `region_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `store` ADD CONSTRAINT `store_region_id_fkey` FOREIGN KEY (`region_id`) REFERENCES `region`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store` ADD CONSTRAINT `store_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
