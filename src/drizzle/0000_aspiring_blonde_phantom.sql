CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`address` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
