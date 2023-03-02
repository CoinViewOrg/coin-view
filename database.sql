CREATE TABLE `UsrAccount` (
    `Ua_Id` varchar(30) NOT NULL,
    `Ua_login` varchar(50) DEFAULT NULL,
    `Ua_Email` varchar(50) DEFAULT NULL,
    `Ua_Password` varchar(60) DEFAULT NULL,
    `Ua_FavoriteMarket` int DEFAULT NULL,
    `VerificationId` varchar(64) DEFAULT NULL,
    `EmailVerified` int DEFAULT NULL,
    PRIMARY KEY (`Ua_Id`),
    KEY `Ua_FavoriteMarket` (`Ua_FavoriteMarket`),
    CONSTRAINT `UsrAccount_ibfk_1` FOREIGN KEY (`Ua_FavoriteMarket`) REFERENCES `MarketList` (`Ml_Id`)
);

CREATE TABLE `CryptoFavorites` (
    `Cf_UaID` varchar(30) NOT NULL,
    `Cf_CryptoId` int NOT NULL,
    KEY `Cf_UaID` (`Cf_UaID`),
    CONSTRAINT `CryptoFavorites_ibfk_1` FOREIGN KEY (`Cf_UaID`) REFERENCES `UsrAccount` (`Ua_Id`)
);

CREATE TABLE `CryptoNotification` (
    `Cn_UaId` varchar(30) NOT NULL,
    `Cn_CryptoId` int NOT NULL,
    `Cn_Treshold` int NOT NULL,
    KEY `Cn_UaId` (`Cn_UaId`),
    CONSTRAINT `CryptoNotification_ibfk_1` FOREIGN KEY (`Cn_UaId`) REFERENCES `UsrAccount` (`Ua_Id`)
);

CREATE TABLE `MarketList` (
    `Ml_Id` varchar(30) NOT NULL,
    `Ml_name` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`Ml_Id`)
);

CREATE TABLE `UserEmailSubscriptions` (
    `UserId` varchar(30) NOT NULL,
    `CryptoAlerts` tinyint(1) DEFAULT NULL,
    `Newsletters` tinyint(1) DEFAULT NULL,
    `ProductUpdate` tinyint(1) DEFAULT NULL,
    KEY `UserId` (`UserId`),
    CONSTRAINT `UserEmailSubscriptions_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `UsrAccount` (`Ua_Id`)
);

CREATE TABLE `UserNotifications` (
    `NotificationId` int NOT NULL AUTO_INCREMENT,
    `Ua_Id` varchar(30) NOT NULL,
    `Content` varchar(4096) NOT NULL,
    `Date` timestamp NOT NULL,
    `Type` varchar(64) DEFAULT NULL,
    `Seen` int DEFAULT NULL,
    PRIMARY KEY (`NotificationId`),
    KEY `Ua_Id` (`Ua_Id`),
    CONSTRAINT `UserNotifications_ibfk_1` FOREIGN KEY (`Ua_Id`) REFERENCES `UsrAccount` (`Ua_Id`)
);