CREATE TABLE `moneta_flow`.`account` (
  id INT PRIMARY KEY AUTO_INCREMENT,
  accountType ENUM('checking', 'savings', 'investment') NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0.00,
  opened_at DATE NOT NULL
);

CREATE TABLE `moneta_flow`.`transaction` (
  id INT PRIMARY KEY AUTO_INCREMENT,
  accountId INT NOT NULL,
  transactionType ENUM('deposit', 'withdrawal', 'transfer') NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (accountId) REFERENCES account(id)
);