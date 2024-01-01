CREATE TABLE `account` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('checking','savings','investment') NOT NULL,
	`wallet` varchar(16) NOT NULL,
	`balance` decimal(15,2) DEFAULT '0.00',
	`opened_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `account_id` PRIMARY KEY(`id`),
	CONSTRAINT `account_wallet_unique` UNIQUE(`wallet`)
);
--> statement-breakpoint
CREATE TABLE `transaction` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accountId` int NOT NULL,
	`type` enum('deposit','withdrawal','transfer') NOT NULL,
	`currency` varchar(10) NOT NULL,
	`balance` decimal(15,2) DEFAULT '0.00',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `transaction_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_accountId_account_id_fk` FOREIGN KEY (`accountId`) REFERENCES `account`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
INSERT INTO moneta_flow.account
(id, `type`, wallet, balance, opened_at)
VALUES(DEFAULT, 'checking', '987654321987', 1200.50, '2023-01-10 09:30:00');
--> statement-breakpoint
INSERT INTO moneta_flow.account
(id, `type`, wallet, balance, opened_at)
VALUES(DEFAULT, 'savings', '456789012345', 2500.75, '2022-11-15 14:45:00');
--> statement-breakpoint
INSERT INTO moneta_flow.account
(id, `type`, wallet, balance, opened_at)
VALUES(DEFAULT, 'investment', '789012345678', 4000.90, '2023-03-05 11:15:00');
