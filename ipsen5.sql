CREATE DATABASE  IF NOT EXISTS `ipsen5` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `ipsen5`;
-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: 37.97.229.119    Database: ipsen5
-- ------------------------------------------------------
-- Server version	5.5.55-0+deb8u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  KEY `watertype_krw_id` (`watertype_krw_id`),
  CONSTRAINT `location_ibfk_1` FOREIGN KEY (`waterschap_id`) REFERENCES `waterschap` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `location_ibfk_2` FOREIGN KEY (`watertype_id`) REFERENCES `watertype` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `location_ibfk_3` FOREIGN KEY (`watertype_krw_id`) REFERENCES `watertype` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reference`
--

DROP TABLE IF EXISTS `reference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reference` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `watertype_id` int(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `watertype_id` (`watertype_id`),
  KEY `watertype_id_2` (`watertype_id`),
  CONSTRAINT `reference_ibfk_1` FOREIGN KEY (`watertype_id`) REFERENCES `watertype` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reference`
--

LOCK TABLES `reference` WRITE;
/*!40000 ALTER TABLE `reference` DISABLE KEYS */;
/*!40000 ALTER TABLE `reference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reference_species`
--

DROP TABLE IF EXISTS `reference_species`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reference_species` (
  `reference_id` int(3) NOT NULL,
  `species_id` int(5) NOT NULL,
  PRIMARY KEY (`reference_id`,`species_id`),
  KEY `reference_species_ibfk_2` (`species_id`),
  CONSTRAINT `reference_species_ibfk_1` FOREIGN KEY (`reference_id`) REFERENCES `reference` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reference_species_ibfk_2` FOREIGN KEY (`species_id`) REFERENCES `species` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reference_species`
--

LOCK TABLES `reference_species` WRITE;
/*!40000 ALTER TABLE `reference_species` DISABLE KEYS */;
/*!40000 ALTER TABLE `reference_species` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reference_wew_factor_class`
--

DROP TABLE IF EXISTS `reference_wew_factor_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reference_wew_factor_class` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `reference_id` int(3) NOT NULL,
  `factor_class_id` int(5) NOT NULL,
  `computed_value` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reference_id` (`reference_id`),
  KEY `factor_class` (`factor_class_id`),
  CONSTRAINT `reference_wew_factor_class_ibfk_1` FOREIGN KEY (`reference_id`) REFERENCES `reference` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reference_wew_factor_class_ibfk_2` FOREIGN KEY (`factor_class_id`) REFERENCES `wew_factor_class` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reference_wew_factor_class`
--

LOCK TABLES `reference_wew_factor_class` WRITE;
/*!40000 ALTER TABLE `reference_wew_factor_class` DISABLE KEYS */;
/*!40000 ALTER TABLE `reference_wew_factor_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sample`
--

DROP TABLE IF EXISTS `sample`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `sample_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `sample_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample`
--

LOCK TABLES `sample` WRITE;
/*!40000 ALTER TABLE `sample` DISABLE KEYS */;
/*!40000 ALTER TABLE `sample` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sample_species`
--

DROP TABLE IF EXISTS `sample_species`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sample_species` (
  `sample_id` int(9) NOT NULL,
  `species_id` int(5) NOT NULL,
  PRIMARY KEY (`sample_id`,`species_id`),
  KEY `sample_species_ibfk_2` (`species_id`),
  CONSTRAINT `sample_species_ibfk_1` FOREIGN KEY (`sample_id`) REFERENCES `sample` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `sample_species_ibfk_2` FOREIGN KEY (`species_id`) REFERENCES `species` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_species`
--

LOCK TABLES `sample_species` WRITE;
/*!40000 ALTER TABLE `sample_species` DISABLE KEYS */;
/*!40000 ALTER TABLE `sample_species` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sample_wew_factor_class`
--

DROP TABLE IF EXISTS `sample_wew_factor_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sample_wew_factor_class` (
  `id` int(14) NOT NULL AUTO_INCREMENT,
  `sample_id` int(9) NOT NULL,
  `factor_class_id` int(5) NOT NULL,
  `computed_value` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sample_id` (`sample_id`),
  KEY `factor_class_id` (`factor_class_id`),
  CONSTRAINT `sample_wew_factor_class_ibfk_1` FOREIGN KEY (`sample_id`) REFERENCES `sample` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `sample_wew_factor_class_ibfk_2` FOREIGN KEY (`factor_class_id`) REFERENCES `wew_factor_class` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_wew_factor_class`
--

LOCK TABLES `sample_wew_factor_class` WRITE;
/*!40000 ALTER TABLE `sample_wew_factor_class` DISABLE KEYS */;
/*!40000 ALTER TABLE `sample_wew_factor_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `species`
--

DROP TABLE IF EXISTS `species`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `species` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category_id` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `species_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `species_category` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `species`
--

LOCK TABLES `species` WRITE;
/*!40000 ALTER TABLE `species` DISABLE KEYS */;
/*!40000 ALTER TABLE `species` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `species_category`
--

DROP TABLE IF EXISTS `species_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `species_category` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `species_category`
--

LOCK TABLES `species_category` WRITE;
/*!40000 ALTER TABLE `species_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `species_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` char(60) NOT NULL,
  `name` varchar(100) NOT NULL,
  `group_id` int(3) NOT NULL,
  `session_token` char(36) DEFAULT NULL,
  `expiration_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `user_group` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'reinierkors@hotmail.com','123','Reinier',2,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_group`
--

DROP TABLE IF EXISTS `user_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_group`
--

LOCK TABLES `user_group` WRITE;
/*!40000 ALTER TABLE `user_group` DISABLE KEYS */;
INSERT INTO `user_group` VALUES (2,'Administrator'),(1,'Gebruiker');
/*!40000 ALTER TABLE `user_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waterschap`
--

DROP TABLE IF EXISTS `waterschap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `waterschap` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waterschap`
--

LOCK TABLES `waterschap` WRITE;
/*!40000 ALTER TABLE `waterschap` DISABLE KEYS */;
/*!40000 ALTER TABLE `waterschap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watertype`
--

DROP TABLE IF EXISTS `watertype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `watertype` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watertype`
--

LOCK TABLES `watertype` WRITE;
/*!40000 ALTER TABLE `watertype` DISABLE KEYS */;
/*!40000 ALTER TABLE `watertype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wew_factor`
--

DROP TABLE IF EXISTS `wew_factor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wew_factor` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wew_factor`
--

LOCK TABLES `wew_factor` WRITE;
/*!40000 ALTER TABLE `wew_factor` DISABLE KEYS */;
/*!40000 ALTER TABLE `wew_factor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wew_factor_class`
--

DROP TABLE IF EXISTS `wew_factor_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wew_factor_class` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `factor_id` int(3) NOT NULL,
  `code` varchar(10) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `factor_id` (`factor_id`),
  CONSTRAINT `wew_factor_class_ibfk_1` FOREIGN KEY (`factor_id`) REFERENCES `wew_factor` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wew_factor_class`
--

LOCK TABLES `wew_factor_class` WRITE;
/*!40000 ALTER TABLE `wew_factor_class` DISABLE KEYS */;
/*!40000 ALTER TABLE `wew_factor_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wew_value`
--

DROP TABLE IF EXISTS `wew_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wew_value` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `factor_class_id` int(3) NOT NULL,
  `species_id` int(5) NOT NULL,
  `value` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `factor_class_id` (`factor_class_id`),
  KEY `species_id` (`species_id`),
  CONSTRAINT `wew_value_ibfk_1` FOREIGN KEY (`factor_class_id`) REFERENCES `wew_factor_class` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wew_value_ibfk_2` FOREIGN KEY (`species_id`) REFERENCES `species` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wew_value`
--

LOCK TABLES `wew_value` WRITE;
/*!40000 ALTER TABLE `wew_value` DISABLE KEYS */;
/*!40000 ALTER TABLE `wew_value` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'ipsen5'
--

--
-- Dumping routines for database 'ipsen5'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-06-06 11:28:02
