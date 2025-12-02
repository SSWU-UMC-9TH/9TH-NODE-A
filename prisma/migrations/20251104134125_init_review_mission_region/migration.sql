/*
  Warnings:

  - You are about to drop the `user_store_review` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_store_review` DROP FOREIGN KEY `user_store_review_store_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_store_review` DROP FOREIGN KEY `user_store_review_user_id_fkey`;

-- AlterTable
ALTER TABLE `store` ADD COLUMN `address` VARCHAR(255) NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `created_by_user_id` INTEGER NULL,
    ADD COLUMN `food_category_id` INTEGER NULL,
    ADD COLUMN `region_id` INTEGER NULL;

-- DropTable
DROP TABLE `user_store_review`;

-- CreateTable
CREATE TABLE `region` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `region_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `store_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_review_store`(`store_id`),
    INDEX `idx_review_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `store_id` INTEGER NOT NULL,
    `title` VARCHAR(120) NOT NULL,
    `description` TEXT NULL,
    `reward_points` INTEGER NOT NULL DEFAULT 0,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_mission_store`(`store_id`),
    INDEX `idx_mission_active`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_mission_challenge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `mission_id` INTEGER NOT NULL,
    `status` ENUM('CHALLENGING', 'COMPLETED', 'CANCELED') NOT NULL DEFAULT 'CHALLENGING',
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completed_at` DATETIME(3) NULL,

    INDEX `idx_umc_user`(`user_id`),
    INDEX `idx_umc_mission`(`mission_id`),
    UNIQUE INDEX `uk_user_mission`(`user_id`, `mission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_store_region` ON `store`(`region_id`);

-- CreateIndex
CREATE INDEX `idx_store_category` ON `store`(`food_category_id`);

-- AddForeignKey
ALTER TABLE `store` ADD CONSTRAINT `store_region_id_fkey` FOREIGN KEY (`region_id`) REFERENCES `region`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store` ADD CONSTRAINT `store_food_category_id_fkey` FOREIGN KEY (`food_category_id`) REFERENCES `food_category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store` ADD CONSTRAINT `store_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mission` ADD CONSTRAINT `mission_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_mission_challenge` ADD CONSTRAINT `user_mission_challenge_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_mission_challenge` ADD CONSTRAINT `user_mission_challenge_mission_id_fkey` FOREIGN KEY (`mission_id`) REFERENCES `mission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
