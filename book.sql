-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 30, 2025 at 09:53 AM
-- Server version: 9.1.0
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `book`
--

-- --------------------------------------------------------

--
-- Table structure for table `authors`
--

DROP TABLE IF EXISTS `authors`;
CREATE TABLE IF NOT EXISTS `authors` (
  `author_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `bio` text,
  `birth_date` date DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `authors`
--

INSERT INTO `authors` (`author_id`, `name`, `bio`, `birth_date`, `country`) VALUES
('46bb0c01-d5b5-4ab6-a224-30b076d86d5b', 'Vĩnh Thành Trương', 'Thiên tài số 1 Việt Nam', '2003-01-21', 'Vietnam');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
CREATE TABLE IF NOT EXISTS `books` (
  `book_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int NOT NULL DEFAULT '0',
  `publisher_id` char(36) DEFAULT NULL,
  `published_date` date DEFAULT NULL,
  `language` varchar(50) DEFAULT NULL,
  `cover_image` text,
  PRIMARY KEY (`book_id`),
  KEY `fk_books_publisher` (`publisher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`book_id`, `title`, `isbn`, `description`, `price`, `stock_quantity`, `publisher_id`, `published_date`, `language`, `cover_image`) VALUES
('f5a8b765-7024-4819-81ac-23393aff56c9', 'ád111', NULL, 'dsad', 5164.00, 110, '67faef72-5d7d-45fb-a577-104e54f0b677', '2025-11-18', 'Việt Nam', 'https://res.cloudinary.com/dw8subctq/image/upload/v1764343087/uploads/dc5ig6sc8cwmbhf1vxvy.png');

-- --------------------------------------------------------

--
-- Table structure for table `book_authors`
--

DROP TABLE IF EXISTS `book_authors`;
CREATE TABLE IF NOT EXISTS `book_authors` (
  `book_id` char(36) NOT NULL,
  `author_id` char(36) NOT NULL,
  PRIMARY KEY (`book_id`,`author_id`),
  KEY `fk_bookauthors_author` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `book_authors`
--

INSERT INTO `book_authors` (`book_id`, `author_id`) VALUES
('f5a8b765-7024-4819-81ac-23393aff56c9', '46bb0c01-d5b5-4ab6-a224-30b076d86d5b');

-- --------------------------------------------------------

--
-- Table structure for table `book_categories`
--

DROP TABLE IF EXISTS `book_categories`;
CREATE TABLE IF NOT EXISTS `book_categories` (
  `book_id` char(36) NOT NULL,
  `category_id` char(36) NOT NULL,
  PRIMARY KEY (`book_id`,`category_id`),
  KEY `fk_bookcategories_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `book_categories`
--

INSERT INTO `book_categories` (`book_id`, `category_id`) VALUES
('f5a8b765-7024-4819-81ac-23393aff56c9', 'fddab122-7b94-4b90-9773-10425580fdfa');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `description`) VALUES
('fddab122-7b94-4b90-9773-10425580fdfa', 'Khoa Học Viễn Tưởng', 'Khoa học tương lai');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `customer_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` char(36) NOT NULL,
  `customer_id` char(36) NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','paid','shipped','delivered','cancelled') DEFAULT 'pending',
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','credit_card','paypal','bank_transfer') DEFAULT 'cash',
  PRIMARY KEY (`order_id`),
  KEY `fk_orders_customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `order_item_id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `book_id` char(36) NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `fk_orderitems_order` (`order_id`),
  KEY `fk_orderitems_book` (`book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `publishers`
--

DROP TABLE IF EXISTS `publishers`;
CREATE TABLE IF NOT EXISTS `publishers` (
  `publisher_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`publisher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `publishers`
--

INSERT INTO `publishers` (`publisher_id`, `name`, `address`, `email`, `phone`) VALUES
('67faef72-5d7d-45fb-a577-104e54f0b677', 'Nụ Cười Mới', '47 Âu Cơ', 'nucuoimoi@nucuoi.com', '0933654852'),
('7da75e2f-1829-46a1-a38b-6af98f57e92e', 'admin admin', 'admin address', 'admin@gmail.com', '1231231231'),
('ef470c63-0f6f-4a66-8720-2d4ed8a6e9cd', 'Kim Đồng', '58 Cao Lỗ', 'kimdong@kimdong.hcm.com', '0958858888');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `review_id` char(36) NOT NULL,
  `book_id` char(36) NOT NULL,
  `customer_id` char(36) NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `fk_reviews_book` (`book_id`),
  KEY `fk_reviews_customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `name`, `email`, `password`, `phone`, `role`, `created_at`) VALUES
('05fc5f63-0f93-46e6-867f-94a98744ab5a', 'USER admin', 'user@gmail.com', '$2b$10$rWAFFrcuLoYUaFHyz/EIY.VJ4xzre9t2VhBxziQx7tMYFnhTQJdna', '0123123123', 'user', '2025-11-28 15:19:51'),
('22af825e-33b4-4c9f-843c-094c36a66eaf', 'admin admin', 'admin@gmail.com', '$2b$10$gJj8MbHoOVJTW6.82g.bbeFzmQYY9W6QWyOLc4DS5JUeKUAvqT00m', '0123123123', 'admin', '2025-11-28 13:52:49'),
('82ebd5c1-b085-420e-a05f-450c60eeac0d', 'Thành Trương', 'vinhthanh9105b@gmail.com', '$2b$10$DVMyaNso872ijlbMuKGnMO.vOm4mzJvf1RCjfWmR45KH7NZGNGBR2', '0966399763', 'user', '2025-11-29 08:16:47');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `fk_books_publisher` FOREIGN KEY (`publisher_id`) REFERENCES `publishers` (`publisher_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `book_authors`
--
ALTER TABLE `book_authors`
  ADD CONSTRAINT `fk_bookauthors_author` FOREIGN KEY (`author_id`) REFERENCES `authors` (`author_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_bookauthors_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `book_categories`
--
ALTER TABLE `book_categories`
  ADD CONSTRAINT `fk_bookcategories_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_bookcategories_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_orderitems_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_orderitems_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_reviews_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reviews_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
