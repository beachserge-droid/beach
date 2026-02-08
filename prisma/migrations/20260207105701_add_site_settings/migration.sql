-- CreateTable
CREATE TABLE `SiteSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `siteName` VARCHAR(191) NOT NULL DEFAULT 'Catalog',
    `logoUrl` VARCHAR(191) NULL,
    `headerPhone` VARCHAR(191) NULL,
    `headerEmail` VARCHAR(191) NULL,
    `footerAbout` LONGTEXT NULL,
    `footerPhone` VARCHAR(191) NULL,
    `footerWorkHours` VARCHAR(191) NULL,
    `socialFacebook` VARCHAR(191) NULL,
    `socialInstagram` VARCHAR(191) NULL,
    `socialYoutube` VARCHAR(191) NULL,
    `socialX` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
