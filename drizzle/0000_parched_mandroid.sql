CREATE TABLE `deal` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`description` text,
	`isActive` integer
);
--> statement-breakpoint
CREATE TABLE `glamp` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`description` text,
	`type` text,
	`price` real,
	`available_from` text,
	`available_to` text,
	`adult_capacity` integer,
	`child_capacity` integer,
	`isLuxury` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text,
	`name` text
);
