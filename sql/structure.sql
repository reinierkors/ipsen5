SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `waterscan`
--

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `code` varchar(100) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `x_coor` int(6) DEFAULT NULL,
  `y_coor` int(6) DEFAULT NULL,
  `waterschap_id` int(3) DEFAULT NULL,
  `watertype_id` int(3) NOT NULL,
  `watertype_krw_id` int(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `waterschap_id` (`waterschap_id`),
  KEY `watertype_id` (`watertype_id`),
  KEY `watertype_krw_id` (`watertype_krw_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `reference`
--

CREATE TABLE `reference` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `watertype_id` int(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `watertype_id` (`watertype_id`),
  KEY `watertype_id_2` (`watertype_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table `reference_species`
--

CREATE TABLE `reference_species` (
  `reference_id` int(3) NOT NULL,
  `species_id` int(5) NOT NULL,
  PRIMARY KEY (`reference_id`,`species_id`),
  KEY `reference_species_ibfk_2` (`species_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `reference_wew_factor_class`
--

CREATE TABLE `reference_wew_factor_class` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `reference_id` int(3) NOT NULL,
  `factor_class_id` int(5) NOT NULL,
  `computed_value` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_id_factor_class_id` (`reference_id`,`factor_class_id`),
  KEY `reference_id` (`reference_id`),
  KEY `factor_class` (`factor_class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table `sample`
--

CREATE TABLE `sample` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `location_id` int(8) NOT NULL,
  `owner_id` int(6) DEFAULT NULL,
  `quality` double DEFAULT NULL,
  `x_coor` int(6) DEFAULT NULL,
  `y_coor` int(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `location_id` (`location_id`),
  KEY `owner_id` (`owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table `sample_species`
--

CREATE TABLE `sample_species` (
  `sample_id` int(9) NOT NULL,
  `species_id` int(5) NOT NULL,
  `value` int(4) NOT NULL,
  PRIMARY KEY (`sample_id`,`species_id`),
  KEY `sample_species_ibfk_2` (`species_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sample_wew_factor_class`
--

CREATE TABLE `sample_wew_factor_class` (
  `id` int(14) NOT NULL AUTO_INCREMENT,
  `sample_id` int(9) NOT NULL,
  `factor_class_id` int(5) NOT NULL,
  `computed_value` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sample_id_factor_class_id` (`sample_id`,`factor_class_id`),
  KEY `sample_id` (`sample_id`),
  KEY `factor_class_id` (`factor_class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table `species`
--

CREATE TABLE `species` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category_id` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table `species_category`
--

CREATE TABLE `species_category` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` char(60) NOT NULL,
  `name` varchar(100) NOT NULL,
  `group_id` int(3) NOT NULL,
  `waterschap_id` int NULL,
  `session_token` char(36) DEFAULT NULL,
  `expiration_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table `user_group`
--

CREATE TABLE `user_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table `waterschap`
--

CREATE TABLE `waterschap` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` VARCHAR(255) NULL,
  `house_number` INT(20) NULL,
  `zip_code`  CHAR(6) NULL,
  `location` VARCHAR(255) NULL,
  `phone_number` VARCHAR(20) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table `watertype`
--

CREATE TABLE `watertype` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table `wew_factor`
--

CREATE TABLE `wew_factor` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table `wew_factor_class`
--

CREATE TABLE `wew_factor_class` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `factor_id` int(3) NOT NULL,
  `code` varchar(10) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `order` int(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `factor_id` (`factor_id`),
  KEY `order` (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table `wew_value`
--

CREATE TABLE `wew_value` (
  `id` int(7) NOT NULL AUTO_INCREMENT,
  `factor_class_id` int(3) NOT NULL,
  `species_id` int(5) NOT NULL,
  `value` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `factor_class_id_species_id` (`factor_class_id`,`species_id`),
  KEY `factor_class_id` (`factor_class_id`),
  KEY `species_id` (`species_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `location`
--
ALTER TABLE `location`
  ADD CONSTRAINT `location_ibfk_1` FOREIGN KEY (`waterschap_id`) REFERENCES `waterschap` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `location_ibfk_2` FOREIGN KEY (`watertype_id`) REFERENCES `watertype` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `location_ibfk_3` FOREIGN KEY (`watertype_krw_id`) REFERENCES `watertype` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `reference`
--
ALTER TABLE `reference`
  ADD CONSTRAINT `reference_ibfk_1` FOREIGN KEY (`watertype_id`) REFERENCES `watertype` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `reference_species`
--
ALTER TABLE `reference_species`
  ADD CONSTRAINT `reference_species_ibfk_1` FOREIGN KEY (`reference_id`) REFERENCES `reference` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `reference_species_ibfk_2` FOREIGN KEY (`species_id`) REFERENCES `species` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `reference_wew_factor_class`
--
ALTER TABLE `reference_wew_factor_class`
  ADD CONSTRAINT `reference_wew_factor_class_ibfk_1` FOREIGN KEY (`reference_id`) REFERENCES `reference` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `reference_wew_factor_class_ibfk_2` FOREIGN KEY (`factor_class_id`) REFERENCES `wew_factor_class` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `sample`
--
ALTER TABLE `sample`
  ADD CONSTRAINT `sample_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `sample_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `sample_species`
--
ALTER TABLE `sample_species`
  ADD CONSTRAINT `sample_species_ibfk_1` FOREIGN KEY (`sample_id`) REFERENCES `sample` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `sample_species_ibfk_2` FOREIGN KEY (`species_id`) REFERENCES `species` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `sample_wew_factor_class`
--
ALTER TABLE `sample_wew_factor_class`
  ADD CONSTRAINT `sample_wew_factor_class_ibfk_1` FOREIGN KEY (`sample_id`) REFERENCES `sample` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `sample_wew_factor_class_ibfk_2` FOREIGN KEY (`factor_class_id`) REFERENCES `wew_factor_class` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `species`
--
ALTER TABLE `species`
  ADD CONSTRAINT `species_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `species_category` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `user_group` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`waterschap_id`) REFERENCES `waterschap` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `wew_factor_class`
--
ALTER TABLE `wew_factor_class`
  ADD CONSTRAINT `wew_factor_class_ibfk_1` FOREIGN KEY (`factor_id`) REFERENCES `wew_factor` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `wew_value`
--
ALTER TABLE `wew_value`
  ADD CONSTRAINT `wew_value_ibfk_1` FOREIGN KEY (`factor_class_id`) REFERENCES `wew_factor_class` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `wew_value_ibfk_2` FOREIGN KEY (`species_id`) REFERENCES `species` (`id`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
