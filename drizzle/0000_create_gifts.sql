CREATE TABLE `gifts` (
  `id` text PRIMARY KEY NOT NULL,
  `house` text NOT NULL,
  `owner` text NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `image_url` text NOT NULL,
  `product_url` text NOT NULL,
  `price` integer,
  `priority` integer NOT NULL,
  `timeframe` text NOT NULL,
  `status` text NOT NULL DEFAULT 'WANTED',
  `created_by` text NOT NULL,
  `received_at` text,
  `created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX `gifts_house_idx` ON `gifts` (`house`);
CREATE INDEX `gifts_status_idx` ON `gifts` (`status`);
CREATE INDEX `gifts_created_at_idx` ON `gifts` (`created_at`);
