CREATE TABLE `payments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `order_id` varchar(36) NOT NULL DEFAULT '',
  `status` varchar(20) NOT NULL DEFAULT '',
  `amount` decimal(19,2) DEFAULT NULL,
  `transaction_id` varchar(36) DEFAULT NULL,
  `gateway_response` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_payment_transaction` (`user_id`,`order_id`,`status`),
  KEY `user_id` (`user_id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;