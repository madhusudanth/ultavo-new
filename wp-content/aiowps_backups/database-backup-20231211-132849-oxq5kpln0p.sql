-- All In One WP Security & Firewall 4.3.2
-- MySQL dump
-- 2023-12-11 13:28:49

SET NAMES utf8;
SET foreign_key_checks = 0;

DROP TABLE IF EXISTS `wp_UPCP_Catalogue_Items`;

CREATE TABLE `wp_UPCP_Catalogue_Items` (
  `Catalogue_Item_ID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `Catalogue_ID` mediumint(9) DEFAULT '0',
  `Item_ID` mediumint(9) DEFAULT '0',
  `Category_ID` mediumint(9) DEFAULT '0',
  `SubCategory_ID` mediumint(9) DEFAULT '0',
  `Position` mediumint(9) NOT NULL DEFAULT '0',
  UNIQUE KEY `id` (`Catalogue_Item_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=188 DEFAULT CHARSET=utf8;

INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("97","1","168","0","0","3");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("104","1","169","0","0","10");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("113","1","1","0","0","19");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("121","1","157","0","0","27");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("122","1","156","0","0","28");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("123","1","158","0","0","29");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("124","1","159","0","0","30");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("126","1","170","0","0","32");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("132","1","177","0","0","38");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("133","1","176","0","0","39");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("134","1","175","0","0","40");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("141","1","178","0","0","47");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("148","4","0","4","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("149","5","0","2","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("150","6","0","16","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("151","7","0","13","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("152","8","0","8","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("153","9","0","3","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("154","10","0","12","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("155","11","0","10","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("156","12","0","6","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("157","13","0","11","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("158","14","0","15","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("159","15","0","14","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("161","17","0","18","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("162","18","0","19","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("166","22","0","23","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("168","24","0","26","0","1");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("171","28","0","32","0","2");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("183","25","0","27","0","0");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("184","30","0","33","0","0");
INSERT INTO `wp_UPCP_Catalogue_Items` VALUES("187","29","0","30","0","3");


DROP TABLE IF EXISTS `wp_UPCP_Catalogues`;

CREATE TABLE `wp_UPCP_Catalogues` (
  `Catalogue_ID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `Catalogue_Name` text NOT NULL,
  `Catalogue_Description` text NOT NULL,
  `Catalogue_Layout_Format` text NOT NULL,
  `Catalogue_Custom_CSS` text NOT NULL,
  `Catalogue_Item_Count` mediumint(9) NOT NULL DEFAULT '0',
  `Catalogue_Date_Created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  UNIQUE KEY `id` (`Catalogue_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

INSERT INTO `wp_UPCP_Catalogues` VALUES("1","Luxury Brands","<h1 class=\"sub-title\">THE FINEST ENTERTAINMENT SERVER</h1>
<p>Mozaex (pronounced mo-zae-x),is the world\'s premier provider of the world\'s first and most popular proprietary Blu-ray 3D Entertainment Server. Mozaex was formed by the founder of Axonix®, the 26 year old manufacturer of MediaMax which was introduced in 2004 as the world\'s first multimedia Entertainment Server.</p>
<p>Mozaex is a multi-room, multimedia, Entertainment Server that can load, store and instantly deliver Blu-ray/DVD movies, music, photos and online content. Combining elegant operation with uncompromised reliability and quality, Mozaex has quickly become the solution of choice for homes, yachts and hotels around the world. Mozaex is sold exclusively through a network of 750 dealers that are serviced by 10 domestic rep firms and 20 international distibuters in 25 countries.</p>","","","12","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("3","ATI Amplifier Technologies","<h1 class=\"sub-title\">THE FINEST ENTERTAINMENT SERVER</h1>
<p>ATI Amplifier, is the world\'s premier provider of the world\'s first and most popular proprietary Blu-ray 3D Entertainment Server. ATI Amplifier was formed by the founder of Axonix®, the 26 year old manufacturer of MediaMax which was introduced in 2004 as the world\'s first multimedia Entertainment Server.</p>
<p>ATI Amplifier is a multi-room, multimedia, Entertainment Server that can load, store and instantly deliver Blu-ray/DVD movies, music, photos and online content. Combining elegant operation with uncompromised reliability and quality, ATI Amplifier has quickly become the solution of choice for homes, yachts and hotels around the world. ATI Amplifier is sold exclusively through a network of 750 dealers that are serviced by 10 domestic rep firms and 20 international distibuters in 25 countries.</p>","","","0","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("4","Audio Physic","No loss of fine detail High End – Made in Germany Music can put a smile on our faces, grab our attention and capture us in its web of expression when, and only when, all artists and all instruments hit the nail on the head and all of the details come together to form a great composition. This can only be achieved when even the tiniest detail makes the perfect contribution towards the overall piece and this is exactly what makes truly great orchestras, groups or individual artists stand out from the crowd. The situation is no different when it comes to loudspeakers. Only when all of a loudspeaker’s elements work together precisely, right down to the finest detail, can the reproduction of music also become an unparalleled experience. When this happens, music can really get under your skin and give you goosebumps. This is what we are aiming for with every one of our AUDIO PHYSIC loudspeakers. Nevertheless, this is not where the production journey comes to an end. An AUDIO PHYSIC loudspeaker only leaves our factory once it has undergone careful testing involving using both measurement techniques and acoustic examinations. We document these tests for every single loudspeaker because we vouch for quality with our name. Our high-quality standards also mean that you can only purchase our loudspeakers from top-quality specialist dealers, where competent advice and exclusive service are a matter of course.","","","3","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("5","Avantgarde Acoustics","When we speak of our company we are often reminded of a quote from Johann Wolfgang von Goethe: “When all is in agreement it gives us peace of mind, but the contradiction is what makes us productive”. In actual fact, we embody key contradictions and opposing characteristics. Finally we reach the point of transcendence of all contradictions: our speakers. Each of them tells an inspirational story full of fascination. It is a story of the longing for a singular solution. And it is a story about groundbreaking innovations. About the excitement of experiment for the scientist and about the intentional restraint of the minimalist. A story about the goal oriented addiction of the creator and the quest for sustainability of the purist. From this fertile merging of contradictory claims and desires, our speakers have sprung to life. They are the fascinating outcome of the duality where “Purity meets Performance“. They capture all of our commitment, dedication and enthusiasm.","","","4","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("6","Blumont","","","","0","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("7","Ceratec","Ceratec has been founded in 1999 by Ulrich Ranke, the former Eton founder and inventor of the famous Hexacone membrane technology.
Ceratec offers synthesis of beauty, quality and functionality.
Ceratec design is classic and elegant.
Ceratec sound and picture are authentic.
Ceratec quality is especially obvious. Ceratec counts on fancy materials.","","","4","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("8","Crestron","At Crestron, we build the technology that integrates technology. Our automation and control solutions for buildings and homes let people control entire environments with the push of a button, integrating systems such as A/V, lighting, shading, IT, security, BMS, and HVAC to provide greater comfort, convenience, and security. All of our products are designed and built to work together as a complete system, enabling you to monitor, manage, and control everything from one platform","","","0","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("9","Garvan Acoustic","Garvan gives shape to the emotion of sound and music. Born from the passion of the two founders, Garvan has combined acoustic technology to the most refined and innovative design to create a perfect synthesis of form and performance. Not only basic and clean lines that express elegance and modernity perfectly adapting to any environment and enriching it with a touch of exclusivity, but also innovative solutions result of careful and painstaking research that has defined new possibilities in the world of collection and dissemination of acoustic . Made in Italy and contemporary style are the basis of every product Garvan, result of an expert craftsmanship that expresses its high product quality and attention to detail. exclusive materials such as steel, stainless steel, corian and ceramics are using new and unusual, forging exclusive products, modern and design pieces that exceed the traditional boundaries of the speakers. All our products are listened to and tested through strict controls and can be customized according to specific customer requirements, being able to choose from a wide range of colors and aesthetic. Highlights of our \"know-how\" we offer a 3-year warranty on each product, ensuring our customers the security of their choice.","","","5","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("10","Goldmund","For more than thirty five years, Goldmund has developed audio and video equipment at the highest level. In this continuous search for the accurate reproduction of sound and image, Goldmund has established an outstandingly powerful reputation with mythical products such as the Reference turntable, the Apologue wireless speakers or the Telos power amplifiers to name a few.
Goldmund products are developed with the most advanced technologies. Our company is strong of numerous years of fundamental research by audio and acoustic engineers who often had to create new technologies from scratch to achieve their goals of quality.","","","4","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("11","Meridian","In 1977 we embarked upon a mission. Our goal was simple: to put the listener at the heart of every recorded performance. Since then we’ve been continually pushing the boundaries of sound. Redefining the possible at every step of the way.Almost forty years later and our journey continues. Read on to discover more about us and our award-winning audio systems. But remember, when it comes to sound this incredible, you really have to hear it to believe it.","","","4","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("12","Mozaex media server","Mozaex (pronounced mo-zae-x),is the world\'s premier provider of the world\'s first and most popular proprietary Blu-ray 3D Entertainment Server. Mozaex was formed by the founder of Axonix®, the 26 year old manufacturer of MediaMax which was introduced in 2004 as the world\'s first* multimedia Entertainment Server. Mozaex is a multi-room, multimedia, Entertainment Server that can load, store and instantly deliver Blu-ray/DVD movies, music, photos and online content. Combining elegant operation with uncompromised reliability and quality, Mozaex has quickly become the solution of choice for homes, yachts and hotels around the world. Mozaex is sold exclusively through a network of 750 dealers that are serviced by 10 domestic rep firms and 20 international distributors in 25 countries.","","","4","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("13","Preference Audio","OEM Systems Company was formed in 1987 to develop In-Wall loudspeaker products and programs in the classic Original Equipment Manufacturing process.  Very early in the history of the In-Wall loudspeaker OEM Systems Company was one of the first to become involved.  At the outset OEM began designing products and programs for major brand name Companies.  This was during a period of time that the In-Wall loudspeaker category was devoid of products from legacy brand name loudspeaker manufacturers such as B&W, JBL, Bose, Snell, Tannoy, KEF, Klipsch, Polk, Jamo, etc.
At a time when there were only one or two Companies that Integrators and End Users could source In-Wall loudspeakers from, demand for the category out-stripped supply, many Integrators approached OEM Systems Company with need for product.","","","4","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("14","Screen Excellence","Located in Suffolk, England since 2008, Screen Excellence manufactures only the highest quality acoustically transparent projection screens for high-end home cinema and private cinema installations. Thanks to our expert knowledge of the audio-visual technology, we are the proven innovators and leaders in this market. This means that by installing our screens, you are guaranteeing your customers will receive the highest standard of home cinema technology available.","","","4","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("15","Sim2 Multimedia","SIM2 BV International is an Italian electronics industry that designs, manufactures and supplies the finest video projection and HDR products for residential and commercial applications. Today, SIM2 delivers new and unique video solutions with unparalleled performance, outstanding design and the finest customer support available. SIM2 projectors are made in Italy and sold worldwide in over 60 countries through sister companies in the US and China and partnerships with qualified distributors. SIM2 BV’s headquarters are located in Pordenone, Italy.","","","0","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("16","Zingali Acoustics","Zingali Acoustics was founded in 1986 in a small acoustic handcrafted workshop, where Giuseppe Zingali, a master of sound and electro-acoustics, understands the power of a professional audio market in those years dominated by the most famous American names in the field. But things change in a hurry.The early prototypes of high-efficiency Monitor moves quickly to highly sophisticated products, which in the intentions of the designer must be the best in the world for sound quality and affordable in the purchase price.","","","0","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("17","Basalte","For the fourth year in a row, Basalte is one of Belgium\'s 50 fastest growing tech companies, according to the Deloitte Fast50! This annual initiative is designed to encourage and promote entrepreneurial, fast-growing technology companies. The ranking is based on the company\'s percentage of growth in turnover during the last four years.
\"This recognition gives us an additional boost to continue investing in innovative products for home automation systems!\"
At Light+Building 2016, we showed our high-performance speakers for the very first time, setting a new standard by combining true elegance with incredible power! They are built with the same high-quality materials as our touch-sensitive switches and designed with a rich variety of luxury fabrics: acoustically tested, for any interior design. Together with our Asano multiroom audio system, our speakers elegantly blend audio in any interior!","","","5","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("18","Recliners","Optimum comfort, the prime aim which each of Recliners India products is manufactured, whether it is recliner chair or a sofa for a living room, a home theatre recliner or cinema recliner. Our inspiration to create more and more comfortable seating solutions is our consumer and their various needs. Our process of creation begins with research and study of international trends and then analysing the evolution and innovation in the lifestyle of the consumers. Recliner India believes in establishing and maintaining a personalised relation with every client and wish to bring comfort to more and more homes in the country.","","","1","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("19","Lutron","","","","0","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("21","Creation","","","","0","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("22","Oppo Digital","","","","0","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("23","JVC","","","","0","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("24","Devialet","Devialet’s origin: an invention that revolutionized sound processing.
Pierre-Emmanuel Calmel invented a revolutionary technology that transformed sound amplification:
The ADH Intelligence. The first hybrid technology that associates the preciseness of Analog amplification (Class A) to the power of Digital amplification (Class D) allowing Devialet products to reach a never heard before sound quality.","","","0","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("25","BEC AKUSTIK","For acoustic applications actually only 3 different types of magnet materials are used; in fact in quantitative order of Ferrite, NdFeB and AlNiCo. Since the 70s ferrite magnets have been used as inherent part of sound converters, which either must convince by low price or where installation space and weight do not play a major role. Those are the most representative ones. In the fields of automotive application meanwhile NdFeB magnets more and more prevailed due to their advantage of smaller size, higher strength and lower weight.

Thus they contribute to a significant weight reduction of the vehicle. Typical applications are loudspeakers, subwoofers and hands-free systems. Further those raw materials are more and more used for professional sonication, where smaller versions and lower weights are required. High remanent and high-temperature resistant magnet qualities also enable the usage in acoustic transducers at extreme conditions. Die excellent anti-corrosive characteristics and variously coating possibilities are other factors to guarantee a long lifetime and an optimal performance of the final product.

AlNiCo magnets are solely used for special loudspeakers, where music playback is rather used for vintage-similar characteristics (guitar-amps) or for modern broadband loudspeakers.","","","2","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("28"," KEF AUDIO","KEF is a British loudspeaker manufacturer with international distribution. It was founded in Tovil, Maidstone, Kent in 1961 by electrical engineer Raymond Cooke and named after Kent Engineering & Foundry with which it originally shared the site. Its founder, Raymond Cooke, was made an OBE by Elizabeth II in 1979.
KEF is now owned by GP Acoustics, which is itself a member of the Hong Kong-based Gold Peak Group. Product development, acoustical technology research and the manufacture of flagship products still occurs on the original Tovil site in England.Raymond Cooke and Robert Pearch founded KEF Electronics Ltd., with a view to creating innovative loudspeakers using the latest in materials technology. KEF Electronics was founded in Kent in 1961 and was physically situated on land adjacent to the River Medway in Tovil which at the time was owned by Kent Engineering & Foundry (a company owned by Robert Pearch and founded by his father Leonard) who at the time manufactured agricultural equipment and industrial sweeping machines. KEF derived its name from the firm.","","","1","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("29","VITREA ","Reliability and stability are a top priority for Vitrea which is why we use only premium-quality components and materials. Our products emphasis quick, simple installation and configuration. All of our products, designed and made in Israel, conform to international safety and quality standards. We work with only the most responsible distributers and installers to ensure our clients receive the highest quality services.","","","6","0000-00-00 00:00:00");
INSERT INTO `wp_UPCP_Catalogues` VALUES("30","AJAX","At Ajax, we believe that people shouldn’t have to live in fear in today\'s world. Our continually evolving security system gives people peace of mind. When you\'re under the reliable protection of Ajax, you\'re safe from thieves, fires or leaks that can cause real harm to property and people.","","","3","0000-00-00 00:00:00");


DROP TABLE IF EXISTS `wp_UPCP_Categories`;

CREATE TABLE `wp_UPCP_Categories` (
  `Category_ID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `Category_Name` text NOT NULL,
  `Category_Description` text NOT NULL,
  `Category_Image` text NOT NULL,
  `Category_Item_Count` mediumint(9) DEFAULT '0',
  `Category_Sidebar_Order` mediumint(9) DEFAULT '9999',
  `Category_Date_Created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `Category_WC_ID` mediumint(9) DEFAULT '0',
  `Category_Logo` text NOT NULL,
  `Category_Short_Description` text NOT NULL,
  `Category_White_Logo` text NOT NULL,
  `Category_Brand_Link` text NOT NULL,
  `Category_Type` text NOT NULL,
  UNIQUE KEY `id` (`Category_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

INSERT INTO `wp_UPCP_Categories` VALUES("2","Avantgarde Acoustics","When we speak of our company we are often reminded of a quote from Johann Wolfgang von Goethe: “When all is in agreement it gives us peace of mind, but the contradiction is what makes us productive”. In actual fact, we embody key contradictions and opposing characteristics. Finally we reach the point of transcendence of all contradictions: our speakers. Each of them tells an inspirational story full of fascination. It is a story of the longing for a singular solution. And it is a story about groundbreaking innovations. About the excitement of experiment for the scientist and about the intentional restraint of the minimalist. A story about the goal oriented addiction of the creator and the quest for sustainability of the purist. From this fertile merging of contradictory claims and desires, our speakers have sprung to life. They are the fascinating outcome of the duality where “Purity meets Performance“. They capture all of our commitment, dedication and enthusiasm.","https://www.ultavosounds.com/wp-content/uploads/2017/01/avantgarde-banner-3.jpg","3","2","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2017/01/avanta.png","When we speak of our company we are often reminded of a quote from Johann Wolfgang von Goethe: “When all is in agreement it gives us peace of mind, but the contradiction is what makes us productive”. In actual fact, we embody key contradictions and opposing characteristics.","https://www.ultavosounds.com/wp-content/uploads/2017/01/Avantgarde-white-bg-logo.jpg","http://www.avantgarde-acoustic.de/home.html","Audio");
INSERT INTO `wp_UPCP_Categories` VALUES("3","Garvan Acoustic","Garvan gives shape to the emotion of sound and music. Born from the passion of the two founders, Garvan has combined acoustic technology to the most refined and innovative design to create a perfect synthesis of form and performance. Not only basic and clean lines that express elegance and modernity perfectly adapting to any environment and enriching it with a touch of exclusivity, but also innovative solutions result of careful and painstaking research that has defined new possibilities in the world of collection and dissemination of acoustic . Made in Italy and contemporary style are the basis of every product Garvan, result of an expert craftsmanship that expresses its high product quality and attention to detail. exclusive materials such as steel, stainless steel, corian and ceramics are using new and unusual, forging exclusive products, modern and design pieces that exceed the traditional boundaries of the speakers. All our products are listened to and tested through strict controls and can be customized according to specific customer requirements, being able to choose from a wide range of colors and aesthetic. Highlights of our \"know-how\" we offer a 3-year warranty on each product, ensuring our customers the security of their choice.","https://www.ultavosounds.com/wp-content/uploads/2017/01/garvan-banner.jpg","9","11","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2016/12/logo.jpg","Garvan gives shape to the emotion of sound and music. Born from the passion of the two founders, Garvan has combined acoustic technology to the most refined and innovative design to create a perfect synthesis of form and performance.","https://www.ultavosounds.com/wp-content/uploads/2017/01/Garvan-whilte-logo.jpg","http://www.garvanacoustic.com/en/","Audio");
INSERT INTO `wp_UPCP_Categories` VALUES("4","Audio Physic","<p>No loss of fine detail High End
– Made in Germany.
Music can put a smile on our faces, grab our attention and capture us in its web of expression when, and only when, all artists and all instruments hit the nail on the head and all of the details come together to form a great composition. This can only be achieved when even the tiniest detail makes the perfect contribution towards the overall piece and this is exactly what makes truly great orchestras, groups or individual artists stand out from the crowd.</p>
<p>The situation is no different when it comes to loudspeakers. Only when all of a loudspeaker’s elements work together precisely, right down to the finest detail, can the reproduction of music also become an unparalleled experience. When this happens, music can really get under your skin and give you goosebumps. This is what we are aiming for with every one of our <strong>AUDIO PHYSIC</strong> loudspeakers. Nevertheless, this is not where the production journey comes to an end. An <strong>AUDIO PHYSIC</strong> loudspeaker only leaves our factory once it has undergone careful testing involving using both measurement techniques and acoustic examinations.</p>
<p>We document these tests for every single loudspeaker because we vouch for quality with our name. Our high-quality standards also mean that you can only purchase our loudspeakers from top-quality specialist dealers, where competent advice and exclusive service are a matter of course.</p>","https://www.ultavosounds.com/wp-content/uploads/2017/01/audio-physic-banner.jpg","6","1","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2016/12/audiophysic_logo_150x150.jpg","<p>No loss of fine detail High End
– Made in Germany.
Music can put a smile on our faces, grab our attention and capture us in its web of expression when, and only when, all artists and all instruments hit the nail on the head and all of the details come together to form a great composition.","https://www.ultavosounds.com/wp-content/uploads/2017/01/Audio-Physic-white-bg-logo.jpg","http://www.audiophysic.com/","Audio");
INSERT INTO `wp_UPCP_Categories` VALUES("6","Mozaex media server","<h2 class=\"sub-title\">THE FINEST ENTERTAINMENT SERVER</h2>
<p>Mozaex (pronounced mo-zae-x),is the world\'s premier provider of the world\'s first and most popular proprietary Blu-ray 3D Entertainment Server. Mozaex was formed by the founder of Axonix®, the 26 year old manufacturer of MediaMax which was introduced in 2004 as the world\'s first* multimedia Entertainment Server.</p>
<p>Mozaex is a multi-room, multimedia, Entertainment Server that can load, store and instantly deliver Blu-ray/DVD movies, music, photos and online content. Combining elegant operation with uncompromised reliability and quality, Mozaex has quickly become the solution of choice for homes, yachts and hotels around the world. Mozaex is sold exclusively through a network of 750 dealers that are serviced by 10 domestic rep firms and 20 international distributors in 25 countries.</p>","https://www.ultavosounds.com/wp-content/uploads/2017/01/mozaex-banner.jpg","12","16","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2016/11/mozaex-logo.jpg","Mozaex (pronounced mo-zae-x),is the world\'s premier provider of the world\'s first and most popular proprietary Blu-ray 3D Entertainment Server. Mozaex was formed by the founder of Axonix®, the 26 year old manufacturer of MediaMax which was introduced in 2004 as the world\'s first* multimedia Entertainment Server.","","","Other");
INSERT INTO `wp_UPCP_Categories` VALUES("8","Crestron","At Crestron, we build the technology that integrates technology. Our automation and control solutions for buildings and homes let people control entire environments with the push of a button, integrating systems such as A/V, lighting, shading, IT, security, BMS, and HVAC to provide greater comfort, convenience, and security. All of our products are designed and built to work together as a complete system, enabling you to monitor, manage, and control everything from one platform","https://www.ultavosounds.com/wp-content/uploads/2017/01/crestron-banner.jpg","9","9","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2016/12/Crestron_Blue_Logo_RGB_0.png","At Crestron, we build the technology that integrates technology. Our automation and control solutions for buildings and homes let people control entire environments with the push of a button, integrating systems such as A/V, lighting, shading, IT, security, BMS, and HVAC to provide greater comfort, convenience, and security.","https://www.ultavosounds.com/wp-content/uploads/2017/01/Crestron-whilte-logo.jpg","https://www.crestron.com/","Other");
INSERT INTO `wp_UPCP_Categories` VALUES("10","Meridian","<h2 class=\"sub-title\">Experience the technology and hear the difference</h2>
<div class=\"col-lg-6\"><p>In 1977 we embarked upon a mission. Our goal was simple: to put the listener at the heart of every recorded performance. Since then we’ve been continually pushing the boundaries of sound. Redefining the possible at every step of the way.Almost forty years later and our journey continues. Read on to discover more about us and our award-winning audio systems. But remember, when it comes to sound this incredible, you really have to hear it to believe it.</p></div><div class=\"video col-lg-6\" style=\"margin-bottom: 20px;\"><iframe src=\"https://www.youtube.com/embed/QIeLY2m-clU\" frameborder=\"0\" allowfullscreen=\"\"></iframe></div>","https://www.ultavosounds.com/wp-content/uploads/2017/01/meridian-banner.jpg","3","15","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2016/12/meridian.jpg","In 1977 Meridian embarked upon a mission. Their goal was simple: 
\"To put the listener at the heart of every recorded performance\".
Since then they’ve been continually pushing the boundaries of sound. Redefining the possible at every step of the way. 
Almost forty years later and their journey continues.","https://www.ultavosounds.com/wp-content/uploads/2017/01/Meridian-white-bg-logo.jpg","https://www.meridian-audio.com/","Audio");
INSERT INTO `wp_UPCP_Categories` VALUES("11","Preference Audio","OEM Systems Company was formed in 1987 to develop In-Wall loudspeaker products and programs in the classic Original Equipment Manufacturing process.  Very early in the history of the In-Wall loudspeaker OEM Systems Company was one of the first to become involved.  At the outset OEM began designing products and programs for major brand name Companies.  This was during a period of time that the In-Wall loudspeaker category was devoid of products from legacy brand name loudspeaker manufacturers such as B&W, JBL, Bose, Snell, Tannoy, KEF, Klipsch, Polk, Jamo, etc.
At a time when there were only one or two Companies that Integrators and End Users could source In-Wall loudspeakers from, demand for the category out-stripped supply, many Integrators approached OEM Systems Company with need for product.","https://www.ultavosounds.com/wp-content/uploads/2017/01/prefrence-banner.jpg","5","18","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2016/12/Preference-logo.jpg","Preference loudspeakers are the Preferred loudspeakers for performance and value in the In-Wall/In-Ceiling loudspeaker category.
Every Preference model loudspeaker is \"timbre-matched\" ensuring sonic uniformity throughout the line. This means all models have been carefully engineered to have a family sound; this is also referred to as \"voice matching\".","https://www.ultavosounds.com/wp-content/uploads/2017/01/Preference-white-bg-logo.jpg","http://preference-audio.com/","Audio");
INSERT INTO `wp_UPCP_Categories` VALUES("12","Goldmund","For more than thirty five years, Goldmund has developed audio and video equipment at the highest level. In this continuous search for the accurate reproduction of sound and image, Goldmund has established an outstandingly powerful reputation with mythical products such as the Reference turntable, the Apologue wireless speakers or the Telos power amplifiers to name a few.
Goldmund products are developed with the most advanced technologies. Our company is strong of numerous years of fundamental research by audio and acoustic engineers who often had to create new technologies from scratch to achieve their goals of quality.","https://www.ultavosounds.com/wp-content/uploads/2017/01/goldmund-banner.jpg","10","12","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2016/12/Goldmund-logo.jpeg","For more than thirty five years, Goldmund has developed audio and video equipment at the highest level. In this continuous search for the accurate reproduction of sound and image, Goldmund has established an outstandingly powerful reputation with mythical products such as the Reference turntable, the Apologue wireless speakers or the Telos power amplifiers to name a few.","","","Audio");
INSERT INTO `wp_UPCP_Categories` VALUES("13","Ceratec","Ceratec has been founded in 1999 by Ulrich Ranke, the former Eton founder and inventor of the famous Hexacone membrane technology. Ceratec offers synthesis of beauty, quality and functionality. Ceratec design is classic and elegant. Ceratec sound and picture are authentic. Ceratec quality is especially obvious. Maintaining the tradition, cerasonar heralds a similar paradigm shift in terms of invisible speakers.","https://www.ultavosounds.com/wp-content/uploads/2017/01/ceratec-banner.jpg","8","6","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2017/01/brand_CERATEC-thumb.jpg","Ceratec has been founded in 1999 by Ulrich Ranke, the former Eton founder and inventor of the famous Hexacone membrane technology.
Ceratec offers synthesis of beauty, quality and functionality.","https://www.ultavosounds.com/wp-content/uploads/2017/01/Ceratec-white-bg-logo.jpg","http://ceratecaudio.com/","Audio");
INSERT INTO `wp_UPCP_Categories` VALUES("14","Sim2 Multimedia","SIM2 BV International is an Italian electronics industry that designs, manufactures and supplies the finest video projection and HDR products for residential and commercial applications. Today, SIM2 delivers new and unique video solutions with unparalleled performance, outstanding design and the finest customer support available. SIM2 projectors are made in Italy and sold worldwide in over 60 countries through sister companies in the US and China and partnerships with qualified distributors. SIM2 BV’s headquarters are located in Pordenone, Italy.","https://www.ultavosounds.com/wp-content/uploads/2017/01/sim2-banner.jpg","8","21","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2017/01/sim2-1.png","SIM2 BV International is an Italian electronics industry that designs, manufactures and supplies the finest video projection and HDR products for residential and commercial applications.","https://www.ultavosounds.com/wp-content/uploads/2017/01/Sim2-whilte-logo.jpg","http://www.sim2.com/","Video");
INSERT INTO `wp_UPCP_Categories` VALUES("15","Screen Excellence","<div class=\"col-lg-6\"><p>Thanks to years in research & development, Screen Excellence delivers the most advanced, truly acoustically transparent screens, on the market.</p>
<p><strong>Above Products</strong></p>
<p>Flat, curved, HD, WS, fixed or electrically retractable... Screen Excellence provides a complete range of top quality screens for leisure or business. Hand crafted in England or in the USA, our screens provide flawless picture quality, enabling you to get the best from both your projector and sound system.</p></div><div class=\"video col-lg-6\"><iframe src=\"https://www.youtube.com/embed/-elNPyA-RVI\" frameborder=\"0\" allowfullscreen=\"\"></iframe></div>","https://www.ultavosounds.com/wp-content/uploads/2017/01/screen-excellence-banner-1.jpg","1","20","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2016/12/Screen-Excellence-logo.jpg","Located in Suffolk, England since 2008, Screen Excellence manufactures only the highest quality acoustically transparent projection screens for high-end home cinema and private cinema installations.","https://www.ultavosounds.com/wp-content/uploads/2017/01/Screen-Excellence-white-bg-logo.png","http://www.screenexcellence.com/","Video");
INSERT INTO `wp_UPCP_Categories` VALUES("16","Blumont","The home entertainment now has a new style. The intimate spaces of the house are redrawn, giving an unprecedented feeling of relax and welcoming.
The future becomes the present, seizing the past’s values. Tradition, experience, manual skill, comes back again in the essence of the shape, in the naturalness of the materials. In a game of stylistic harmony, elegance meets innovation, design translates ergonomics. In the name of researched functionality. In a balance between emotion and rationality. This is Blumont. Creativity to the nth degree, pursing the aethetic and technical perfection. Also customizable.
Because dreams can come true.","https://www.ultavosounds.com/wp-content/uploads/2017/01/blumont-banner.jpg","9","5","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2016/12/blumont-logo.jpg","The home entertainment now has a new style. The intimate spaces of the house are redrawn, giving an unprecedented feeling of relax and welcoming.
The future becomes the present, seizing the past’s values. Tradition, experience, manual skill, comes back again in the essence of the shape, in the naturalness of the materials.","https://www.ultavosounds.com/wp-content/uploads/2017/01/Blumont-white-bg-logo.jpg","http://www.blumont.it/","Video");
INSERT INTO `wp_UPCP_Categories` VALUES("18","Basalte","<p><strong>Basalte</strong> creates unique user experiences for the Smart Home. The company was founded in 2008 in <strong>Ghent, Belgium</strong>. In only a few years Basalte has built a product range that is distributed in over <strong>50 countries worldwide</strong>.</p>
<p>Our constant striving towards the essence results in timeless products that are both elegant and simple to use. They do not only look or feel good, they are also great fun to use.</p>
<p>For the fourth year in a row, Basalte is one of Belgium\'s 50 fastest growing tech companies, according to the Deloitte Fast50! This annual initiative is designed to encourage and promote entrepreneurial, fast-growing technology companies.</p>
<p>Home automation systems are often designed from a technical point of view,  while we believe that you should be able to control everything in an intuitive and simple way.</p>","https://www.ultavosounds.com/wp-content/uploads/2017/01/basalte-banner-1.jpg","5","3","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2016/12/Basalte-logo.jpg","For the fourth year in a row, Basalte is one of Belgium\'s 50 fastest growing tech companies, according to the Deloitte Fast50! This annual initiative is designed to encourage and promote entrepreneurial, fast-growing technology companies. The ranking is based on the company\'s percentage of growth in turnover during the last four years.","","","Other");
INSERT INTO `wp_UPCP_Categories` VALUES("19","Recliners","“Comfort is at the core of everything we do and it is the satisfaction of the customer that makes us get up each day and strive for perfection all the way.”
We at Recliners India are focused on building long term relationships with our clients and our partners and aim to provide not just customer satisfaction, but customer delight.
Recliners India is the pioneer in introducing Motion Furniture in the country. As a company, we heralded an era of comfort seating and were instrumental in bringing affordable luxury to homes in India.
Recliners India also envisioned the futuristic change taking place in the cinema industry and brought to the forefront a new class of products with our Gold Class/ VIP recliners to cinema. The company currently holds a market share of over 95% in the commercial recliner space in the nation with some of the major clients being Cinemax, PVR, Big Cinemas, Inox, Cinepolis and several others.
Recliners India has research and development facilities which deploy state-of-the-art technology and technical expertise in their processes. Incorporated in the year 1996, the company has risen from humble beginnings to becoming an industry leader in the short span of 15 years.
Our products have been a testimony to the expertise and experience of the company. The recliners are designed with ergonomics in mind and manufactured by highly skilled craftsmen. Recliners India products are manufactured with premium quality raw materials and mechanics, at par with international standards.
More than a product, we offer our trust to customers. The company has a dedicated service and customer support team. It is our commitment to the customer which propels us to work better and create something extraordinary every time. ","https://www.ultavosounds.com/wp-content/uploads/2017/01/recliners-banner.jpg","1","19","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2017/01/recliners-logo.jpg","“Comfort is at the core of everything we do and it is the satisfaction of the customer that makes us get up each day and strive for perfection all the way.”","http://","","Other");
INSERT INTO `wp_UPCP_Categories` VALUES("23","Oppo Digital","<p>Based in the heart of Silicon Valley, OPPO Digital designs and markets high quality digital electronics that deliver style, performance, innovation, and value to A/V enthusiasts and savvy consumers alike. The company\'s attention to core product performance and strong customer focus distinguishes it from traditional consumer-electronics brands.</p>
<p>With products that speak for themselves and relying on word-of-mouth, OPPO Digital does not have any dedicated Marketing and Sales personnel. We have spent most of all energy on product design and customer service. We pride ourselves on servicing all our customers right here in Menlo Park, California.</p>","https://www.ultavosounds.com/wp-content/uploads/2017/01/oppo-1.jpg","9","17","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2017/01/oppo-logo.png","","http://","","Video");
INSERT INTO `wp_UPCP_Categories` VALUES("26","Devialet","Devialet’s origin: an invention that revolutionized sound processing.<br>
Pierre-Emmanuel Calmel invented a revolutionary technology that transformed sound amplification:
The ADH Intelligence. The first hybrid technology that associates the preciseness of Analog amplification (Class A) to the power of Digital amplification (Class D) allowing Devialet products to reach a never heard before sound quality.","https://www.ultavosounds.com/wp-content/uploads/2017/04/devialet-banner.jpg","9","10","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2017/04/Devialet-logo.png","Devialet’s origin: an invention that revolutionized sound processing.","https://www.ultavosounds.com/wp-content/uploads/2017/04/Devialet-white-bg-logo.jpg","","Audio");
INSERT INTO `wp_UPCP_Categories` VALUES("27","BEC AKUSTIK","<div class=\"col-lg-6\"><p>
It is the spontaneous ideas that make a lasting impact on life. This certainly includes the
foundation of our company in the 90s.
 
At the beginning of 2015, we relocated our laboratory, materials and materials testing and
technical advice to our headquarters and today employ about 50 people in Moers, Seoul
and Shanghai.
We have been working intensively on the subject of permanent magnets and magnet
systems since the early 1990s.
We have never seen ourselves as a dealer without influencing production.
We have researched and improved production processes and we have introduced new
ways to produce better products with our own team of technicians.
That is why we are today one of the most respected suppliers for development of NdFeB
magnetic materials and systems worldwide, with offices in Germany, Korea and China.
Our created connections in the global industry have also brought us to many loudspeaker
manufacturers.
We have learned that since the 90s, many information in the transmission of speech and
music for marketing and cost reasons have been rationalized.
The loudspeaker industry played into the hands of the music industry.
The quality of the reproduction went downhill for years.
Both the speaker and the music industry devote themselves to compressed and loud
productions, made only for small and very small devices such as smartphones.
We want to break this cycle and have decided that “this” can be improved.
 Better through our own speaker development in Germany
 Better by using high quality components in production
 Better because our speakers sound incredibly good even without a DSP
 Better for playing dynamic music and voice reproduction
Thus they contribute to a significant weight reduction of the vehicle. Typical applications are loudspeakers, subwoofers and hands-free systems. Further those raw materials are more and more used for professional sonication, where smaller versions and lower weights are required. High remanent and high-temperature resistant magnet qualities also enable the usage in acoustic transducers at extreme conditions. Die excellent anti-corrosive characteristics and variously coating possibilities are other factors to guarantee a long lifetime and an optimal performance of the final product.

AlNiCo magnets are solely used for special loudspeakers, where music playback is rather used for vintage-similar characteristics (guitar-amps) or for modern broadband loudspeakers.</p></div><div class=\"video1 col-lg-6\" style=\"margin-bottom: 20px;\"><iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/8CXvfk4AJwI\" frameborder=\"0\" allowfullscreen></iframe></div>","https://www.ultavosounds.com/wp-content/uploads/2022/01/Treiber1.png","13","4","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2021/11/BECGesell_00157000022VkwZAAS.jpg","For more than 25 years, BEC is a solid and reliable player in the industrial supply of all types of permanent magnets. Especially in the field of NdFeB, we have created a name for ourselves with our own development ranks of TERRAMAG series. To date, we employ about 50 people in Moers, Seoul and Shanghai. A lean corporate structure and short decision-making paths shape our reliability and flexibility.","https://www.ultavosounds.com/wp-content/uploads/2021/11/BECGesell_00157000022VkwZAAS.jpg","https://bec-akustik.de/en/","Other");
INSERT INTO `wp_UPCP_Categories` VALUES("30","VITREA ","Reliability and stability are a top priority for Vitrea which is why we use only premium-quality components and materials. Our products emphasis quick, simple installation and configuration. All of our products, designed and made in Israel, conform to international safety and quality standards. We work with only the most responsible distributers and installers to ensure our clients receive the highest quality services.","https://www.ultavosounds.com/wp-content/uploads/2022/01/vitrea_doorbell-1.jpg","8","9999","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2022/02/unnamed-1.jpg","With more than 25 years of experience in the telecom and communication industries, Vitrea, an Israeli company, stands out as an innovative leader in home automation technology. Engineers and designers contribute the best of both worlds to make exquisite products with superior functionality.","https://www.ultavosounds.com/wp-content/uploads/2022/02/unnamed-1.jpg","https://www.vitrea-sh.com/","Other");
INSERT INTO `wp_UPCP_Categories` VALUES("32","KEF AUDIO","KEF is a British loudspeaker manufacturer with international distribution. It was founded in Tovil, Maidstone, Kent in 1961 by electrical engineer Raymond Cooke and named after Kent Engineering & Foundry with which it originally shared the site. Its founder, Raymond Cooke, was made an OBE by Elizabeth II in 1979.
KEF is now owned by GP Acoustics, which is itself a member of the Hong Kong-based Gold Peak Group. Product development, acoustical technology research and the manufacture of flagship products still occurs on the original Tovil site in England.Raymond Cooke and Robert Pearch founded KEF Electronics Ltd., with a view to creating innovative loudspeakers using the latest in materials technology. KEF Electronics was founded in Kent in 1961 and was physically situated on land adjacent to the River Medway in Tovil which at the time was owned by Kent Engineering & Foundry (a company owned by Robert Pearch and founded by his father Leonard) who at the time manufactured agricultural equipment and industrial sweeping machines. KEF derived its name from the firm.","https://www.ultavosounds.com/wp-content/uploads/2022/01/kef.jpg","8","9999","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2021/11/downloadkef.png","KEF is a British loudspeaker manufacturer with international distribution. It was founded in Tovil, Maidstone, Kent in 1961 by electrical engineer Raymond Cooke and named after Kent Engineering & Foundry with which it originally shared the site. Its founder, Raymond Cooke, was made an OBE by Elizabeth II in 1979.","https://www.ultavosounds.com/wp-content/uploads/2021/11/downloadkef.png","https://uk.kef.com/","Other");
INSERT INTO `wp_UPCP_Categories` VALUES("33","AJAX","<div class=\"col-lg-6\"><p>
At Ajax, we believe that people shouldn’t have to live in fear in today\'s world. Our continually evolving security system gives people peace of mind. When you\'re under the reliable protection of Ajax, you\'re safe from thieves, fires or leaks that can cause real harm to property and people.</p></div><div class=\"video1 col-lg-6\" style=\"margin-bottom: 20px;\"><iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/XZDNd3ud-ck\" frameborder=\"0\" allowfullscreen></iframe></div>","https://www.ultavosounds.com/wp-content/uploads/2022/01/Hub-7.jpg","9","9999","0000-00-00 00:00:00","0","https://www.ultavosounds.com/wp-content/uploads/2022/01/ajax.png","At Ajax, we believe that people shouldn’t have to live in fear in today\'s world. Our continually evolving security system gives people peace of mind. When you\'re under the reliable protection of Ajax, you\'re safe from thieves, fires or leaks that can cause real harm to property and people.","https://www.ultavosounds.com/wp-content/uploads/2022/01/ajax.png","https://ajax.systems/","Video");


DROP TABLE IF EXISTS `wp_UPCP_Custom_Fields`;

CREATE TABLE `wp_UPCP_Custom_Fields` (
  `Field_ID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `Field_Name` text NOT NULL,
  `Field_Slug` text NOT NULL,
  `Field_Type` text NOT NULL,
  `Field_Description` text NOT NULL,
  `Field_Values` text NOT NULL,
  `Field_Displays` text NOT NULL,
  `Field_Searchable` text NOT NULL,
  `Field_Sidebar_Order` mediumint(9) DEFAULT '9999',
  `Field_Display_Tabbed` text NOT NULL,
  `Field_Control_Type` text NOT NULL,
  `Field_Date_Created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  UNIQUE KEY `id` (`Field_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `wp_UPCP_Fields_Meta`;

CREATE TABLE `wp_UPCP_Fields_Meta` (
  `Meta_ID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `Field_ID` mediumint(9) DEFAULT '0',
  `Item_ID` mediumint(9) DEFAULT '0',
  `Meta_Value` text NOT NULL,
  UNIQUE KEY `id` (`Meta_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `wp_UPCP_Item_Images`;

CREATE TABLE `wp_UPCP_Item_Images` (
  `Item_Image_ID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `Item_ID` mediumint(9) NOT NULL DEFAULT '0',
  `Item_Image_URL` text,
  `Item_Image_Description` text,
  `Item_Image_Order` mediumint(9) NOT NULL DEFAULT '0',
  UNIQUE KEY `id` (`Item_Image_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `wp_UPCP_Items`;

CREATE TABLE `wp_UPCP_Items` (
  `Item_ID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `Item_Name` text NOT NULL,
  `Item_Slug` text NOT NULL,
  `Item_Description` text,
  `Item_Price` text NOT NULL,
  `Item_Sale_Price` text NOT NULL,
  `Item_Sale_Mode` text NOT NULL,
  `Item_Link` text,
  `Item_Photo_URL` text,
  `Category_ID` mediumint(9) DEFAULT '0',
  `Category_Name` text,
  `Global_Item_ID` mediumint(9) DEFAULT '0',
  `Item_Special_Attr` text,
  `SubCategory_ID` mediumint(9) DEFAULT '0',
  `SubCategory_Name` text,
  `Item_Date_Created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `Item_Views` mediumint(9) DEFAULT '0',
  `Item_Display_Status` text,
  `Item_Related_Products` text,
  `Item_Next_Previous` text,
  `Item_SEO_Description` text,
  `Item_Category_Product_Order` mediumint(9) DEFAULT '9999',
  `Item_WC_ID` mediumint(9) DEFAULT '0',
  UNIQUE KEY `id` (`Item_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=374 DEFAULT CHARSET=utf8;

INSERT INTO `wp_UPCP_Items` VALUES("156","Telos 250+","telos_250+","","","","","","https://www.ultavosounds.com/wp-content/uploads/2016/12/Telos-250.jpg","12","Goldmund","0","","0","","2016-12-14 13:42:04","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("157","Telos 1000+","telos_1000+","","","","","","https://www.ultavosounds.com/wp-content/uploads/2016/12/Telos-1000.jpg","12","Goldmund","0","","0","","2016-12-14 13:42:04","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("158","Telos 3500+","telos_3500+","","","","","","https://www.ultavosounds.com/wp-content/uploads/2016/12/Telos-3500.jpg","12","Goldmund","0","","0","","2016-12-14 13:42:04","1","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("159","Telos Headphone Amplifier 2","telos_headphone_amplifier_2","","","","","","https://www.ultavosounds.com/wp-content/uploads/2016/12/Telos-Headphone-Amplifier-2.jpg","12","Goldmund","0","","0","","2016-12-14 13:42:04","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("168","CLIENT EVO","client_evo","","","","","","https://www.ultavosounds.com/wp-content/uploads/2016/12/CLIENT-EVO.png","0","","0","","0","","2016-12-14 13:42:04","1","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("169","Home Monitor","home_monitor","","","","","","https://www.ultavosounds.com/wp-content/uploads/2016/12/Home-Monitor.jpg","0","","0","","0","","2016-12-14 13:42:04","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("170","TWENTY EVO","twenty_evo","","","","","","https://www.ultavosounds.com/wp-content/uploads/2016/12/TWENTY-EVO.jpg","0","","0","","0","","2016-12-14 13:42:04","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("175","ATP8700","atp8700","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2016/12/ATP8700.jpg","0","","0","","0","","2016-12-15 09:38:31","1","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("176","ATP7700","atp7700","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2016/12/ATP7700.jpg","0","","0","","0","","2016-12-15 09:41:59","1","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("177","ATP6700","atp6700","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2016/12/ATP6700.jpg","0","","0","","0","","2016-12-15 11:33:03","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("178","Show for Screen Excelence","show-for-screen-excelence","","","","No","","","15","Screen Excellence","0","","0","","2016-12-15 11:34:18","1","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("186","Digital Video Processor","digital-video-processor","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Digital-Video-Processor.png","8","Crestron","0","","0","","2016-12-26 11:49:02","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("187","DM-MD64X64","dm-md64x64","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2016/12/DM-MD64X64.png","8","Crestron","0","","0","","2016-12-26 11:50:00","1","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("188","In Wall Speakers","in-wall-speakers","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/In-Wall-Speakers.png","8","Crestron","0","","0","","2016-12-26 11:51:30","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("189","Sonnex Multiroom Audio System","sonnex-multiroom-audio-system","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2016/12/Sonnex-Multiroom-Audio-System.png","8","Crestron","0","","0","","2016-12-26 11:52:22","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("190","LCD Displays","lcd-displays","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2016/12/LCD-Displays.png","14","Sim2 Multimedia","0","","0","","2016-12-26 11:59:18","0","Hide","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("191","PRO5DL_HOST Projector","pro5dl_host-projector","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2016/12/PRO5DL_HOST-Projector.png","14","Sim2 Multimedia","0","","0","","2016-12-26 11:59:55","0","Hide","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("192","RPU270HBD Engine","rpu270hbd-engine","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2016/12/RPU270HBD-Engine.png","14","Sim2 Multimedia","0","","0","","2016-12-26 12:00:46","0","Hide","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("195","SVC_2000 Controller","svc_2000-controller","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2016/12/SVC_2000-Controller.png","14","Sim2 Multimedia","0","","0","","2016-12-26 12:04:49","0","Hide","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("201","DSP 5200","dsp-5200","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/DSP5200.jpg","10","Meridian","0","","0","","2017-01-11 10:35:46","1","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("202","DSP 7200","dsp-7200","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/DSP7200.jpg","10","Meridian","0","","0","","2017-01-11 10:36:18","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("203","DSP 8000","dsp-8000","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/DSP8000.jpg","10","Meridian","0","","0","","2017-01-11 10:36:48","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("204","Classic 30","classic-30","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Classic-30.png","4","Audio Physic","0","","0","","2017-01-11 12:08:02","2","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("205","Classic 20","classic-20","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Classic-20.png","4","Audio Physic","0","","0","","2017-01-11 12:08:47","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("206","Cardeas","cardeas","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Cardeas.png","4","Audio Physic","0","","0","","2017-01-11 12:09:20","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("207","Sitara","sitara","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Sitara.png","4","Audio Physic","0","","0","","2017-01-11 12:09:44","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("208","Scorpio","scorpio","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Scorpio.png","4","Audio Physic","0","","0","","2017-01-11 12:10:32","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("209","Avanti","avanti","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Avanti.png","4","Audio Physic","0","","0","","2017-01-11 12:11:56","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("210","Switches","switches","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Switch.png","18","Basalte","0","","0","","2017-01-11 15:09:20","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("211","Deseo","deseo","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Deseo.png","18","Basalte","0","","0","","2017-01-11 15:10:22","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("212","Eve","eve","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Eve.png","18","Basalte","0","","0","","2017-01-11 15:10:47","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("213","Asano","asano","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Asano.png","18","Basalte","0","","0","","2017-01-11 15:11:20","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("214","Auro","auro","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Auro.png","18","Basalte","0","","0","","2017-01-11 15:11:45","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("215","Adamantio","adamantio","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Adamantio.png","16","Blumont","0","","0","","2017-01-11 15:33:26","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("216","Arco + Sofia","arco-sofia","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Arco-Sofia.png","16","Blumont","0","","0","","2017-01-11 15:34:06","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("217","Diva","diva","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Diva.png","16","Blumont","0","","0","","2017-01-11 15:34:35","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("218","Divo","divo","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Divo.png","16","Blumont","0","","0","","2017-01-11 15:34:59","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("219","Vivaldi","vivaldi","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Vivaldi.png","16","Blumont","0","","0","","2017-01-11 15:35:26","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("220","Arco + Diadema","arco-diadema","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Arco-Diadema.png","16","Blumont","0","","0","","2017-01-11 15:36:15","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("221","Diadema","diadema","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Diadema.png","16","Blumont","0","","0","","2017-01-11 15:36:48","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("222","Bianco","bianco","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Bianco.png","16","Blumont","0","","0","","2017-01-11 15:37:23","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("223","Blu","blu","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Blu.png","16","Blumont","0","","0","","2017-01-11 15:37:54","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("224","Cera Sonar","cera-sonar","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Cera-Sonar.png","13","Ceratec","0","","0","","2017-01-11 16:08:09","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("225","Ceraart","ceraart","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Ceraart.png","13","Ceratec","0","","0","","2017-01-11 16:08:54","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("226","Effeqt CS","effeqt-cs","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Effeqt-CS.png","13","Ceratec","0","","0","","2017-01-11 16:09:15","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("227","Effeqt Micro W","effeqt-micro-w","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Effeqt-Micro-W.png","13","Ceratec","0","","0","","2017-01-11 16:10:12","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("228","Effeqt mk IV","effeqt-mk-iv","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Effeqt-mk-IV.png","13","Ceratec","0","","0","","2017-01-11 16:11:19","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("229","Effeqt W","effeqt-w","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Effeqt-W.png","13","Ceratec","0","","0","","2017-01-11 16:11:48","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("230","Effeqt","effeqt","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Effeqt.png","13","Ceratec","0","","0","","2017-01-11 16:12:22","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("231","Venom","venom","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Venom.png","13","Ceratec","0","","0","","2017-01-11 16:13:20","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("232","Apologue Anniversary","apologue-anniversary","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Apologue-Anniversary.png","12","Goldmund","0","","0","","2017-01-12 09:57:52","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("233","Logos 1N-2N Speaker System","logos-1n-2n-speaker-system","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Logos-1N-2N-Speaker-System.png","12","Goldmund","0","","0","","2017-01-12 09:59:54","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("234","Logos 3N","logos-3n","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Logos-3N.png","12","Goldmund","0","","0","","2017-01-12 10:00:20","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("235","Logos Anatta","logos-anatta","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Logos-Anatta.png","12","Goldmund","0","","0","","2017-01-12 10:00:47","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("236","Logos Satya","logos-satya","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Logos-Satya.png","12","Goldmund","0","","0","","2017-01-12 10:01:11","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("237","ProLogos Plus Wireless","prologos-plus-wireless","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/ProLogos-Plus-Wireless.png","12","Goldmund","0","","0","","2017-01-12 10:01:39","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("238","K-5LCRSd","k-5lcrsd","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/K-5LCRSd.png","11","Preference Audio","0","","0","","2017-01-12 10:30:59","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("239","K-8LCRS","k-8lcrs","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/K-8LCRS.png","11","Preference Audio","0","","0","","2017-01-12 10:31:30","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("240","K-8SWd","k-8swd","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/K-8SWd.png","11","Preference Audio","0","","0","","2017-01-12 10:31:55","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("241","K-625d","k-625d","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/K-625d.png","11","Preference Audio","0","","0","","2017-01-12 10:32:20","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("242","K-802","k-802","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/K-802.png","11","Preference Audio","0","","0","","2017-01-12 10:32:42","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("243","NERO 3","nero-3","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/NERO-3.png","14","Sim2 Multimedia","0","","0","","2017-01-12 10:50:18","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("244","NERO 4K PROJECTOR","nero-4k-projector","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/NERO-4K-PROJECTOR.png","14","Sim2 Multimedia","0","","0","","2017-01-12 10:50:47","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("245","SIM2xTV INV","sim2xtv-inv","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/SIM2xTV-INV.png","14","Sim2 Multimedia","0","","0","","2017-01-12 10:51:20","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("246","SIM2xTV","sim2xtv","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/SIM2xTV.png","14","Sim2 Multimedia","0","","0","","2017-01-12 10:51:51","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("247","Chroma™ Player BD","chroma-player-bd","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Chroma™-Player-BD.png","6","Mozaex media server","0","","0","","2017-01-12 14:32:02","1","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("248","Chroma™ Player ND","chroma-player-nd","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Chroma™-Player-ND.png","6","Mozaex media server","0","","0","","2017-01-12 14:32:23","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("249","Chroma™ Sonnet","chroma-sonnet","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Chroma™-Sonnet.png","6","Mozaex media server","0","","0","","2017-01-12 14:32:42","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("250","Chroma™ Server","chroma-server","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Chroma™-Server.png","6","Mozaex media server","0","","0","","2017-01-12 14:33:46","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("251","Player 1","player-1","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Player-1.png","6","Mozaex media server","0","","0","","2017-01-12 14:34:06","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("252","Player 2","player-2","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Player-2.png","6","Mozaex media server","0","","0","","2017-01-12 14:34:26","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("253","Player 3","player-3","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Player-3.png","6","Mozaex media server","0","","0","","2017-01-12 14:34:47","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("254","RAID Server","raid-server","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/RAID-Server.png","6","Mozaex media server","0","","0","","2017-01-12 14:35:06","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("255","Server 2U","server-2u","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Server-2U.png","6","Mozaex media server","0","","0","","2017-01-12 14:35:24","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("256","Server","server","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Server.png","6","Mozaex media server","0","","0","","2017-01-12 14:35:44","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("257","Solo 2™","solo-2","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Solo-2™.png","6","Mozaex media server","0","","0","","2017-01-12 14:36:03","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("258","Solo 3™","solo-3","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Solo-3™.png","6","Mozaex media server","0","","0","","2017-01-12 14:36:24","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("260","Ariadni Dimmer","","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/AriadniToggDim_03_hero.png","0","","0","","0","","2017-01-18 06:18:07","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("261","PB Big","","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/pb-big.jpg","19","Recliner","0","","0","","2017-01-18 06:18:49","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("262","SIR513","sir513","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/SIR513.png","3","Garvan Acoustic","0","","0","","2017-01-18 11:22:04","1","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("263","SVK14 - Drop","svk14-drop","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/SVK14-Drop.png","3","Garvan Acoustic","0","","0","","2017-01-18 11:22:36","1","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("264","SN115 - 360°","sn115-360","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/SN115-360°.png","3","Garvan Acoustic","0","","0","","2017-01-18 11:23:07","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("265","SB313","sb313","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/SB313.png","3","Garvan Acoustic","0","","0","","2017-01-18 11:23:38","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("266","Out Door","out-door","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Out-Door.png","3","Garvan Acoustic","0","","0","","2017-01-18 11:24:07","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("267","BookShelf","bookshelf","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/BookShelf.png","3","Garvan Acoustic","0","","0","","2017-01-18 11:24:30","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("268","Tabletop Keypad","","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/TabletopKeypad.png","0","","0","","0","","2017-01-19 09:29:38","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("269","Palladiom Keypad","","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/PalladiomKeypad.png","0","","0","","0","","2017-01-19 09:30:42","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("270","Maestro Dimmer","","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/MaestroDimmer.png","0","","0","","0","","2017-01-19 09:36:40","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("271","UNO XD","uno-xd","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/UNO-XD.jpg","2","Avantgarde Acoustics","0","","0","","2017-01-19 10:03:02","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("272","DUO XD","duo-xd","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/DUO-XD.jpg","2","Avantgarde Acoustics","0","","0","","2017-01-19 10:03:25","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("273","ZERO 1","zero-1","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/ZERO-1.jpg","2","Avantgarde Acoustics","0","","0","","2017-01-19 10:03:53","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("274","Sectional Sofas","","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/sectionalsofas.jpg","0","","0","","0","","2017-01-19 13:55:12","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("275","Chairs","","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Chairs.jpg","0","","0","","0","","2017-01-19 13:56:04","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("276","Roja Cinema Chair","","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/redc.png","0","","0","","0","","2017-01-24 09:45:10","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("277","TV Amrella Chair","","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/TV-Amarilla-Chair.png","0","","0","","0","","2017-01-24 09:45:55","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("278","Azul Cinema Chair","","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Azul-Cinema-Chair.png","0","","0","","0","","2017-01-24 09:46:45","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("280","UDP-203","udp-203","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/UDP-203.png","23","Oppo Digital","0","","0","","2017-01-31 11:32:41","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("281","UDP-205","udp-205","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/UDP-205.png","23","Oppo Digital","0","","0","","2017-01-31 11:33:10","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("282","OPPO Digital Sonica DAC","oppo-digital-sonica-dac","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/OPPO-Digital-Sonica-DAC.png","23","Oppo Digital","0","","0","","2017-01-31 11:33:37","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("283","HA-1","ha-1","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/HA-1.jpg","23","Oppo Digital","0","","0","","2017-01-31 11:34:07","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("284","HA-2SE","ha-2se","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/HA-2SE.png","23","Oppo Digital","0","","0","","2017-01-31 11:34:35","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("285","DLA-RS4500K","dla-rs4500k","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/DLA-RS4500K.png","0","","0","","0","","2017-01-31 11:36:06","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("286","DLA-X970R","dla-x970r","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/DLA-X970R.png","0","","0","","0","","2017-01-31 11:36:33","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("287","DM85UXR","dm85uxr","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/DM85UXR.png","0","","0","","0","","2017-01-31 11:37:00","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("288","EM55RF5","em55rf5","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/EM55RF5.png","0","","0","","0","","2017-01-31 11:37:27","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("289","EM65FTR","em65ftr","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/EM65FTR.png","0","","0","","0","","2017-01-31 11:38:11","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("290","KD-R985BTS","kd-r985bts","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/KD-R985BTS.png","0","","0","","0","","2017-01-31 11:38:53","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("291","KD-R988BTS","kd-r988bts","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/KD-R988BTS.png","0","","0","","0","","2017-01-31 11:39:18","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("292","CP3 Processor","cp3-processor","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/CP3-Processor.png","8","Crestron","0","","0","","2017-01-31 13:43:54","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("293","Cameo® Wireless Keypad w-infiNET EX®","cameo-wireless-keypad-w-infinet-ex","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Cameo®-Wireless-Keypad-w-infiNET-EX®.png","8","Crestron","0","","0","","2017-01-31 13:45:08","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("294","Cameo® Keypad, Standard Mount","cameo-keypad-standard-mount","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Cameo®-Keypad-Standard-Mount.png","8","Crestron","0","","0","","2017-01-31 13:45:29","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("295","Capacitive Touch Screens","capacitive-touch-screens","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Capacitive-Touch-Screens.png","8","Crestron","0","","0","","2017-01-31 13:45:56","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("296","Scheduling Touch Screens","scheduling-touch-screens","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/01/Scheduling-Touch-Screens.png","8","Crestron","0","","0","","2017-01-31 13:46:24","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("301","DLA-X5500B","dla-x5500b","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/02/DLA-X5500B-1.jpg","0","","0","","0","","2017-02-02 09:16:07","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("302","DLA-X7500W","dla-x7500w","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/02/DLA-X7500W-1.jpg","0","","0","","0","","2017-02-02 09:16:49","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("303","DLA-X9500B","dla-x9500b","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/02/DLA-X9500B.jpg","0","","0","","0","","2017-02-02 09:17:25","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("304","BDP-103 Blu-ray Player","bdp-103-blu-ray-player","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/02/BDP-103-Blu-ray-Player-1.jpg","23","Oppo Digital","0","","0","","2017-02-02 09:19:28","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("305","BDP-103D 3D Blu-ray Player Darbee Edition","bdp-103d-3d-blu-ray-player-darbee-edition","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/02/BDP-103D-3D-Blu-ray-Player-Darbee-Edition.jpg","23","Oppo Digital","0","","0","","2017-02-02 09:19:58","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("306","BDP-105 3D Blu-ray Player","bdp-105-3d-blu-ray-player","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/02/BDP-105-3D-Blu-ray-Player.jpg","23","Oppo Digital","0","","0","","2017-02-02 09:20:37","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("307","BDP-105D 3D Blu-ray Player Darbee Edition","bdp-105d-3d-blu-ray-player-darbee-edition","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/02/BDP-105D-3D-Blu-ray-Player-Darbee-Edition.jpg","23","Oppo Digital","0","","0","","2017-02-02 09:20:59","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("308","GOLD PHANTOM","gold-phantom","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/04/GOLD-PHANTOM.png","26","Devialet","0","","0","","2017-04-26 09:05:38","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("309","SILVER PHANTOM","silver-phantom","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2017/04/SILVER-PHANTOM.png","26","Devialet","0","","0","","2017-04-26 09:06:49","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("310","LSX GREEN","lsx","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2021/11/LSX-Green_e4c61b0b-9e07-44a5-bbc2-4858e33490dd_1024x1024.png","32","KEF AUDIO","0","","0","","2021-11-11 11:25:37","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("312","Hub Plus","Hub plus","","","","No","https://ajax.systems/products/hubplus/","https://www.ultavosounds.com/wp-content/uploads/2021/12/HUB_B-1x.jpg","33","AJAX","0","","0","","2021-12-31 07:15:35","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("313","Slimmest Loudspeaker","loudspeaker","","","","No","https://bec-akustik.de/en/products-en/loudspeaker/","https://www.ultavosounds.com/wp-content/uploads/2022/01/speaker-chrome-1024x576.jpg","27","BEC AKUSTIK","0","","0","","2022-01-03 14:32:03","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("315","Hub Plus 2","hp2","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/Hub-13.png","33","AJAX","0","","0","","2022-01-05 12:35:54","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("316","Hub 2","h2","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/Hub-6.jpg","33","AJAX","0","","0","","2022-01-05 12:40:04","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("317","LeaksProtect","leaksprotect","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/LeaksProtect-1.jpg","33","AJAX","0","","0","","2022-01-05 12:55:48","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("318","DoorProtect Plus","doorpplus","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/doorprotect-plus-interior-image-1x.jpg","33","AJAX","0","","0","","2022-01-05 13:03:51","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("319","DoorProtect","doorprotect","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/DoorProtect-3280 × 1776.jpg","33","AJAX","0","","0","","2022-01-05 13:23:41","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("320","CombiProtect","CombiProtect","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/CombiProtect-1.jpg","33","AJAX","0","","0","","2022-01-05 13:29:31","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("321","GlassProtect","GlassProtect","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/GlassProtect-3.jpg","33","AJAX","0","","0","","2022-01-05 13:33:57","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("322","Hub","hub","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/Hub-7.jpg","33","AJAX","0","","0","","2022-01-05 13:41:46","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("324","Unique Technology","Treiber1","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/Treiber1.png","27","BEC AKUSTIK","0","","0","","2022-01-07 12:57:09","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("325","Smallest form factor","Treiber2","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/Treiber2.png","27","BEC AKUSTIK","0","","0","","2022-01-07 13:01:11","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("326","Different sizes to choose from","wide_bunt_weiß","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/wide_bunt_weiß.png","27","BEC AKUSTIK","0","","0","","2022-01-07 13:04:07","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("327","Custom colors","Bunt_4","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/Bunt_4.png","27","BEC AKUSTIK","0","","0","","2022-01-07 13:07:05","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("328","Vitrea Doorbell","Doorbell","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/vitrea_doorbell.jpg","30","VITREA ","0","","0","","2022-01-18 12:35:43","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("329","VTouch Pro","VTouch","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/02.jpg","30","VITREA ","0","","0","","2022-01-18 12:37:47","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("334","Switches","switches","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/003_dimmer_black_72.png","30","VITREA ","0","","0","","2022-01-20 05:29:23","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("336","Beautiful designed auditorium of university","becs1","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/5dfe86b8-242d-4536-a11f-70d115f5d183.jpg","27","BEC AKUSTIK","0","","0","","2022-01-24 10:07:23","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("337","Beautiful designed auditorium of university","bec2","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/53072356-3277-4b0a-ad8e-b962de72ffce.jpg","27","BEC AKUSTIK","0","","0","","2022-01-24 10:08:22","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("338","Nearly invisible and versatile speaker","bsc3","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/b05457f7-4b8e-4178-9aed-c1bc31550d9c.jpg","27","BEC AKUSTIK","0","","0","","2022-01-24 10:09:37","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("339","Project Site Image-Bec Speakers","becsp1","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/41e82acb-f037-4d1a-a3ff-59a1b6d564cb.jpg","27","BEC AKUSTIK","0","","0","","2022-01-24 10:16:58","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("340","Project Site Image-Bec Speaker 2","speaker","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/d13f36ee-7740-4d9e-86d4-6022c23550bb.jpg","27","BEC AKUSTIK","0","","0","","2022-01-24 10:17:56","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("341","Project Site Image-Bec Speaker 3","sp3","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/8995e73f-d52d-4454-b3c3-b44547c7d86d.jpg","27","BEC AKUSTIK","0","","0","","2022-01-24 10:18:44","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("342","Project Site Image-Bec Speaker 4","sp4","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/f3f1db85-a11c-404e-8062-4b6ebd47d6c5.jpg","27","BEC AKUSTIK","0","","0","","2022-01-24 10:20:24","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("350","MUON","muon","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/MUON.jpg","32","KEF AUDIO","0","","0","","2022-01-25 02:39:03","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("351","LS50 Wireless ll","ls5","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/LS50-wireless-II.png","32","KEF AUDIO","0","","0","","2022-01-25 02:40:18","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("352","LSX Soundwave","lsxs","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/LSX-SOUNDWAVE.jpg","32","KEF AUDIO","0","","0","","2022-01-25 02:41:05","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("353","Reference 5floorstanding Speaker","reference","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/reference-5floorstanding-Speaker.jpg","32","KEF AUDIO","0","","0","","2022-01-25 02:42:13","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("354","REFERENCE-8b Subwoofer","REFERENCE-","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/REFERENCE-8b-Subwoofer.jpg","32","KEF AUDIO","0","","0","","2022-01-25 02:43:00","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("355","Beautiful designed auditorium of university","Beautiful","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/ead2fc13-9972-4870-84c4-1e1aa8bd80a4.jpg","27","BEC AKUSTIK","0","","0","","2022-01-25 03:29:33","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("356","Mu3","Mu3","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/mu3.png","32","KEF AUDIO","0","","0","","2022-01-25 04:12:46","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("357","Garvan Speaker-SVK15","SVK","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/svk15-650x433.jpg","3","Garvan Acoustic","0","","0","","2022-01-25 04:21:37","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("358","Suspended-speakers-Garvan-KN116","suspended-speakers-for-commercial-environments-Garvan-KN116-768x512","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/suspended-speakers-for-commercial-environments-Garvan-KN116-768x512.jpg","3","Garvan Acoustic","0","","0","","2022-01-25 04:22:34","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("359","Outdoor speaker system-Garvan-SA115","outdoor-speaker-system-Garvan-SA115-768x512","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/outdoor-speaker-system-Garvan-SA115-768x512.jpg","3","Garvan Acoustic","0","","0","","2022-01-25 04:25:12","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("361","Phantom Dark Chrome","dchrome","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/8595e4e6-b2f2-41b1-9f4d-c7b5fd84915b-1.jpg","26","Devialet","0","","0","","2022-01-25 05:43:27","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("362","Phantom Opera","opera","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/Phantom-opera.jpg","26","Devialet","0","","0","","2022-01-25 05:44:31","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("363","Phantom ll reactor","Phantom ll reactor","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/Phantom-Premier-vs-Phantom-Reactor-hwz.jpg","26","Devialet","0","","0","","2022-01-25 05:50:42","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("364","Cocoon Rug","rug","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/Phantom-103-dB-Black-matte-Coccon.jpg","26","Devialet","0","","0","","2022-01-25 05:52:32","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("365","Care Packages","pck","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/71kKHZMJHYL._AC_SX679_.jpg","26","Devialet","0","","0","","2022-01-25 05:56:26","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("366","Walls Speaker-Ci200RS-THX","Ci200RS-THX","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/ci200rs-thx_900x900_2_1024x1024.jpg","32","KEF AUDIO","0","","0","","2022-01-25 06:09:11","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("367","Stands Image","stands","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/stands.jpg","26","Devialet","0","","0","","2022-01-25 08:29:44","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("368","Stands Image","std","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/51cdvGIDsLL._SL1024_.jpg","26","Devialet","0","","0","","2022-01-25 10:59:55","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("369","Room tempreture - red","Room tempreture - red","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/Room-tempreture-red.jpg","30","VITREA ","0","","0","","2022-01-27 12:54:00","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("370","Scenario set - Horizontal","Scenario set - Horizontal","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/dae8a71b-ad0e-438f-af19-e5405a79dade.jpg","30","VITREA ","0","","0","","2022-01-27 12:55:32","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("371","Scenario set - Vertical- WHITE","Scenario set - Vertical- WHITE","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/Scenario-set-Vertical-WHITE.jpg","30","VITREA ","0","","0","","2022-01-27 12:56:53","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("372","Door Bell","Door Bell","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/Door-Bell.jpg","30","VITREA ","0","","0","","2022-01-27 12:57:58","0","Show","","","","9999","0");
INSERT INTO `wp_UPCP_Items` VALUES("373","AC Thermostat2","AC Thermostat2","","","","No","","https://www.ultavosounds.com/wp-content/uploads/2022/01/AC-Thermostat2.jpg","30","VITREA ","0","","0","","2022-01-27 12:58:53","0","Show","","","","9999","0");


DROP TABLE IF EXISTS `wp_UPCP_SubCategories`;

CREATE TABLE `wp_UPCP_SubCategories` (
  `SubCategory_ID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `Category_ID` mediumint(9) NOT NULL DEFAULT '0',
  `Category_Name` text NOT NULL,
  `SubCategory_Name` text NOT NULL,
  `SubCategory_Description` text NOT NULL,
  `SubCategory_Image` text NOT NULL,
  `SubCategory_Item_Count` mediumint(9) NOT NULL DEFAULT '0',
  `SubCategory_Sidebar_Order` mediumint(9) DEFAULT '9999',
  `SubCategory_Date_Created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `SubCategory_WC_ID` mediumint(9) DEFAULT '0',
  UNIQUE KEY `id` (`SubCategory_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `wp_UPCP_Tag_Groups`;

CREATE TABLE `wp_UPCP_Tag_Groups` (
  `Tag_Group_ID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `Tag_Group_Name` text NOT NULL,
  `Tag_Group_Description` text NOT NULL,
  `Display_Tag_Group` text NOT NULL,
  `Tag_Group_Order` mediumint(9) NOT NULL DEFAULT '0',
  UNIQUE KEY `id` (`Tag_Group_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `wp_UPCP_Tagged_Items`;

CREATE TABLE `wp_UPCP_Tagged_Items` (
  `Tagged_Item_ID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `Tag_ID` mediumint(9) NOT NULL DEFAULT '0',
  `Item_ID` mediumint(9) NOT NULL DEFAULT '0',
  UNIQUE KEY `id` (`Tagged_Item_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `wp_UPCP_Tags`;

CREATE TABLE `wp_UPCP_Tags` (
  `Tag_ID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `Tag_Name` text NOT NULL,
  `Tag_Description` text NOT NULL,
  `Tag_Item_Count` text NOT NULL,
  `Tag_Group_ID` mediumint(9) NOT NULL DEFAULT '0',
  `Tag_Sidebar_Order` mediumint(9) DEFAULT '9999',
  `Tag_Date_Created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `Tag_WC_ID` mediumint(9) DEFAULT '0',
  UNIQUE KEY `id` (`Tag_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `wp_UPCP_Videos`;

CREATE TABLE `wp_UPCP_Videos` (
  `Item_Video_ID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `Item_ID` mediumint(9) NOT NULL DEFAULT '0',
  `Item_Video_URL` text,
  `Item_Video_Type` text,
  `Item_Video_Order` mediumint(9) NOT NULL DEFAULT '0',
  UNIQUE KEY `id` (`Item_Video_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `wp_advps_optionset`;

CREATE TABLE `wp_advps_optionset` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `template` varchar(10) CHARACTER SET utf8 NOT NULL,
  `plist` text CHARACTER SET utf8 NOT NULL,
  `query` text CHARACTER SET utf8 NOT NULL,
  `slider` text NOT NULL,
  `caro_ticker` text NOT NULL,
  `container` text NOT NULL,
  `content` text NOT NULL,
  `navigation` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

INSERT INTO `wp_advps_optionset` VALUES("1","one","a:5:{s:17:\"advps_post_stypes\";s:4:\"post\";s:14:\"advps_plistmax\";s:2:\"99\";s:19:\"advps_plistorder_by\";s:4:\"name\";s:16:\"advps_plistorder\";s:3:\"ASC\";s:11:\"advps_plist\";a:0:{}}","a:6:{s:16:\"advps_post_types\";s:4:\"post\";s:13:\"advps_maxpost\";s:2:\"10\";s:12:\"advps_offset\";s:0:\"\";s:13:\"advps_exclude\";s:0:\"\";s:14:\"advps_order_by\";s:4:\"date\";s:11:\"advps_order\";s:4:\"DESC\";}","a:8:{s:17:\"advps_slider_type\";s:8:\"standard\";s:16:\"advps_transition\";s:4:\"css3\";s:13:\"advps_effects\";s:4:\"fade\";s:11:\"advps_speed\";s:4:\"2000\";s:14:\"advps_autoplay\";s:3:\"yes\";s:13:\"advps_timeout\";s:4:\"3000\";s:15:\"advps_sldmargin\";s:1:\"0\";s:14:\"advps_ps_hover\";s:3:\"yes\";}","a:2:{s:15:\"advps_caro_slds\";s:1:\"3\";s:19:\"advps_caro_sldwidth\";s:3:\"180\";}","a:14:{s:15:\"advps_thumbnail\";s:15:\"advps-thumb-one\";s:19:\"advps_default_image\";s:0:\"\";s:15:\"advps_sld_width\";s:3:\"600\";s:15:\"advps_centering\";s:2:\"no\";s:13:\"advps_bgcolor\";s:7:\"#FFFFFF\";s:17:\"advps_border_size\";s:1:\"1\";s:17:\"advps_border_type\";s:5:\"solid\";s:18:\"advps_border_color\";s:7:\"#444444\";s:19:\"advps_remove_border\";s:2:\"no\";s:13:\"advps_bxshad1\";s:1:\"0\";s:13:\"advps_bxshad2\";s:1:\"1\";s:13:\"advps_bxshad3\";s:1:\"4\";s:17:\"advps_bxshadcolor\";s:7:\"#000000\";s:16:\"advps_remove_shd\";s:2:\"no\";}","a:42:{s:19:\"advps_overlay_width\";s:2:\"30\";s:20:\"advps_overlay_height\";s:3:\"100\";s:19:\"advps_overlay_color\";s:7:\"#000000\";s:21:\"advps_overlay_opacity\";s:3:\"0.6\";s:18:\"advps_text_opacity\";s:1:\"1\";s:16:\"advps_text_align\";s:4:\"left\";s:16:\"advps_ttitle_tag\";s:2:\"h2\";s:17:\"advps_titleFcolor\";s:7:\"#FFFFFF\";s:17:\"advps_titleHcolor\";s:7:\"#c9c9c9\";s:17:\"advps_titleFsizeL\";s:2:\"20\";s:17:\"advps_titleFsize1\";s:2:\"18\";s:17:\"advps_titleFsize2\";s:2:\"16\";s:17:\"advps_titleFsize3\";s:2:\"15\";s:17:\"advps_titleFsize4\";s:2:\"15\";s:17:\"advps_titleFsize5\";s:2:\"15\";s:19:\"advps_titleLheightL\";s:2:\"20\";s:19:\"advps_titleLheight1\";s:2:\"18\";s:19:\"advps_titleLheight2\";s:2:\"16\";s:19:\"advps_titleLheight3\";s:2:\"15\";s:19:\"advps_titleLheight4\";s:2:\"15\";s:19:\"advps_titleLheight5\";s:2:\"15\";s:17:\"advps_excptFcolor\";s:7:\"#FFFFFF\";s:17:\"advps_excptFsizeL\";s:2:\"14\";s:17:\"advps_excptFsize1\";s:2:\"12\";s:17:\"advps_excptFsize2\";s:2:\"12\";s:17:\"advps_excptFsize3\";s:2:\"12\";s:17:\"advps_excptFsize4\";s:2:\"12\";s:17:\"advps_excptFsize5\";s:2:\"12\";s:19:\"advps_excptLheightL\";s:2:\"14\";s:19:\"advps_excptLheight1\";s:2:\"12\";s:19:\"advps_excptLheight2\";s:2:\"12\";s:19:\"advps_excptLheight3\";s:2:\"12\";s:19:\"advps_excptLheight4\";s:2:\"12\";s:19:\"advps_excptLheight5\";s:2:\"12\";s:16:\"advps_excerptlen\";s:2:\"25\";s:22:\"advps_excpt_visibility\";s:11:\"always show\";s:20:\"advps_excpt_position\";s:4:\"left\";s:19:\"advps_exclude_excpt\";s:2:\"no\";s:13:\"advps_ed_link\";s:6:\"enable\";s:15:\"advps_link_type\";s:9:\"permalink\";s:14:\"advps_link_rel\";s:4:\"none\";s:17:\"advps_link_target\";s:5:\"_self\";}","a:9:{s:19:\"advps_exclude_pager\";s:2:\"no\";s:16:\"advps_pager_type\";s:6:\"bullet\";s:18:\"advps_pthumb_width\";s:2:\"10\";s:17:\"advps_pager_align\";s:6:\"center\";s:18:\"advps_pager_bottom\";s:3:\"-35\";s:23:\"advps_exclude_playpause\";s:2:\"no\";s:18:\"advps_ppause_align\";s:6:\"center\";s:19:\"advps_ppause_bottom\";s:1:\"6\";s:21:\"advps_exclude_nxtprev\";s:2:\"no\";}");
INSERT INTO `wp_advps_optionset` VALUES("2","two","a:5:{s:17:\"advps_post_stypes\";s:4:\"post\";s:14:\"advps_plistmax\";s:2:\"99\";s:19:\"advps_plistorder_by\";s:4:\"name\";s:16:\"advps_plistorder\";s:3:\"ASC\";s:11:\"advps_plist\";a:0:{}}","a:6:{s:16:\"advps_post_types\";s:4:\"post\";s:13:\"advps_maxpost\";s:2:\"10\";s:12:\"advps_offset\";s:0:\"\";s:13:\"advps_exclude\";s:0:\"\";s:14:\"advps_order_by\";s:4:\"date\";s:11:\"advps_order\";s:4:\"DESC\";}","a:8:{s:17:\"advps_slider_type\";s:8:\"standard\";s:16:\"advps_transition\";s:4:\"css3\";s:13:\"advps_effects\";s:4:\"fade\";s:11:\"advps_speed\";s:4:\"2000\";s:14:\"advps_autoplay\";s:3:\"yes\";s:13:\"advps_timeout\";s:4:\"3000\";s:15:\"advps_sldmargin\";s:1:\"0\";s:14:\"advps_ps_hover\";s:3:\"yes\";}","a:2:{s:15:\"advps_caro_slds\";s:1:\"3\";s:19:\"advps_caro_sldwidth\";s:3:\"180\";}","a:17:{s:15:\"advps_thumbnail\";s:15:\"advps-thumb-one\";s:19:\"advps_default_image\";s:0:\"\";s:15:\"advps_sld_width\";s:3:\"600\";s:15:\"advps_centering\";s:2:\"no\";s:13:\"advps_bgcolor\";s:7:\"#FFFFFF\";s:17:\"advps_border_size\";s:1:\"1\";s:17:\"advps_border_type\";s:5:\"solid\";s:18:\"advps_border_color\";s:7:\"#444444\";s:19:\"advps_remove_border\";s:2:\"no\";s:13:\"advps_bxshad1\";s:1:\"0\";s:13:\"advps_bxshad2\";s:1:\"1\";s:13:\"advps_bxshad3\";s:1:\"4\";s:17:\"advps_bxshadcolor\";s:7:\"#000000\";s:16:\"advps_remove_shd\";s:2:\"no\";s:13:\"advps_ed_link\";s:6:\"enable\";s:15:\"advps_link_type\";s:9:\"permalink\";s:17:\"advps_link_target\";s:5:\"_self\";}","","a:9:{s:19:\"advps_exclude_pager\";s:2:\"no\";s:16:\"advps_pager_type\";s:6:\"bullet\";s:18:\"advps_pthumb_width\";s:2:\"10\";s:17:\"advps_pager_align\";s:6:\"center\";s:18:\"advps_pager_bottom\";s:3:\"-35\";s:23:\"advps_exclude_playpause\";s:2:\"no\";s:18:\"advps_ppause_align\";s:6:\"center\";s:19:\"advps_ppause_bottom\";s:1:\"6\";s:21:\"advps_exclude_nxtprev\";s:2:\"no\";}");
INSERT INTO `wp_advps_optionset` VALUES("3","three","a:4:{s:17:\"advps_post_stypes\";s:4:\"post\";s:14:\"advps_plistmax\";s:1:\"3\";s:19:\"advps_plistorder_by\";s:4:\"date\";s:16:\"advps_plistorder\";s:4:\"DESC\";}","a:6:{s:16:\"advps_post_types\";s:4:\"post\";s:13:\"advps_maxpost\";s:2:\"10\";s:12:\"advps_offset\";s:0:\"\";s:13:\"advps_exclude\";s:0:\"\";s:14:\"advps_order_by\";s:4:\"date\";s:11:\"advps_order\";s:4:\"DESC\";}","a:8:{s:17:\"advps_slider_type\";s:8:\"standard\";s:16:\"advps_transition\";s:6:\"jquery\";s:13:\"advps_effects\";s:10:\"horizontal\";s:11:\"advps_speed\";s:3:\"300\";s:14:\"advps_autoplay\";s:2:\"no\";s:13:\"advps_timeout\";s:4:\"3000\";s:15:\"advps_sldmargin\";s:1:\"0\";s:14:\"advps_ps_hover\";s:3:\"yes\";}","a:2:{s:15:\"advps_caro_slds\";s:1:\"3\";s:19:\"advps_caro_sldwidth\";s:3:\"180\";}","a:22:{s:15:\"advps_thumbnail\";s:6:\"medium\";s:19:\"advps_default_image\";s:0:\"\";s:15:\"advps_sld_width\";s:3:\"600\";s:15:\"advps_centering\";s:2:\"no\";s:13:\"advps_bgcolor\";s:7:\"#FFFFFF\";s:17:\"advps_border_size\";s:1:\"1\";s:17:\"advps_border_type\";s:5:\"solid\";s:18:\"advps_border_color\";s:7:\"#444444\";s:19:\"advps_remove_border\";s:2:\"no\";s:13:\"advps_bxshad1\";s:1:\"0\";s:13:\"advps_bxshad2\";s:1:\"1\";s:13:\"advps_bxshad3\";s:1:\"4\";s:17:\"advps_bxshadcolor\";s:7:\"#000000\";s:16:\"advps_remove_shd\";s:2:\"no\";s:14:\"advps_contpad1\";s:3:\"0.8\";s:14:\"advps_contpad2\";s:3:\"0.8\";s:14:\"advps_contpad3\";s:3:\"0.8\";s:14:\"advps_contpad4\";s:3:\"0.8\";s:11:\"advps_padu1\";s:2:\"vw\";s:11:\"advps_padu2\";s:2:\"vw\";s:11:\"advps_padu3\";s:2:\"vw\";s:11:\"advps_padu4\";s:2:\"vw\";}","a:35:{s:17:\"advps_content_set\";a:3:{i:0;s:5:\"thumb\";i:1;s:5:\"title\";i:2;s:7:\"excerpt\";}s:16:\"advps_cont_width\";s:3:\"100\";s:16:\"advps_ttitle_tag\";s:2:\"h2\";s:17:\"advps_titleFcolor\";s:7:\"#565656\";s:17:\"advps_titleHcolor\";s:7:\"#000000\";s:17:\"advps_titleFsizeL\";s:2:\"20\";s:17:\"advps_titleFsize1\";s:2:\"18\";s:17:\"advps_titleFsize2\";s:2:\"16\";s:17:\"advps_titleFsize3\";s:2:\"15\";s:17:\"advps_titleFsize4\";s:2:\"15\";s:17:\"advps_titleFsize5\";s:2:\"15\";s:19:\"advps_titleLheightL\";s:2:\"20\";s:19:\"advps_titleLheight1\";s:2:\"18\";s:19:\"advps_titleLheight2\";s:2:\"16\";s:19:\"advps_titleLheight3\";s:2:\"15\";s:19:\"advps_titleLheight4\";s:2:\"15\";s:19:\"advps_titleLheight5\";s:2:\"15\";s:17:\"advps_excptFcolor\";s:7:\"#444444\";s:17:\"advps_excptFsizeL\";s:2:\"14\";s:17:\"advps_excptFsize1\";s:2:\"12\";s:17:\"advps_excptFsize2\";s:2:\"12\";s:17:\"advps_excptFsize3\";s:2:\"12\";s:17:\"advps_excptFsize4\";s:2:\"12\";s:17:\"advps_excptFsize5\";s:2:\"12\";s:19:\"advps_excptLheightL\";s:2:\"14\";s:19:\"advps_excptLheight1\";s:2:\"12\";s:19:\"advps_excptLheight2\";s:2:\"12\";s:19:\"advps_excptLheight3\";s:2:\"12\";s:19:\"advps_excptLheight4\";s:2:\"12\";s:19:\"advps_excptLheight5\";s:2:\"12\";s:16:\"advps_excerptlen\";s:2:\"50\";s:13:\"advps_ed_link\";s:6:\"enable\";s:15:\"advps_link_type\";s:9:\"permalink\";s:14:\"advps_link_rel\";s:4:\"none\";s:17:\"advps_link_target\";s:5:\"_self\";}","a:9:{s:19:\"advps_exclude_pager\";s:2:\"no\";s:16:\"advps_pager_type\";s:6:\"bullet\";s:18:\"advps_pthumb_width\";s:2:\"10\";s:17:\"advps_pager_align\";s:6:\"center\";s:18:\"advps_pager_bottom\";s:3:\"-35\";s:23:\"advps_exclude_playpause\";s:2:\"no\";s:18:\"advps_ppause_align\";s:6:\"center\";s:19:\"advps_ppause_bottom\";s:1:\"6\";s:21:\"advps_exclude_nxtprev\";s:2:\"no\";}");
INSERT INTO `wp_advps_optionset` VALUES("4","three","a:5:{s:17:\"advps_post_stypes\";s:4:\"post\";s:14:\"advps_plistmax\";s:2:\"99\";s:19:\"advps_plistorder_by\";s:4:\"name\";s:16:\"advps_plistorder\";s:3:\"ASC\";s:11:\"advps_plist\";a:0:{}}","a:6:{s:16:\"advps_post_types\";s:4:\"post\";s:13:\"advps_maxpost\";s:2:\"10\";s:12:\"advps_offset\";s:0:\"\";s:13:\"advps_exclude\";s:0:\"\";s:14:\"advps_order_by\";s:4:\"date\";s:11:\"advps_order\";s:4:\"DESC\";}","a:8:{s:17:\"advps_slider_type\";s:8:\"standard\";s:16:\"advps_transition\";s:4:\"css3\";s:13:\"advps_effects\";s:4:\"fade\";s:11:\"advps_speed\";s:4:\"2000\";s:14:\"advps_autoplay\";s:3:\"yes\";s:13:\"advps_timeout\";s:4:\"3000\";s:15:\"advps_sldmargin\";s:1:\"0\";s:14:\"advps_ps_hover\";s:3:\"yes\";}","a:2:{s:15:\"advps_caro_slds\";s:1:\"3\";s:19:\"advps_caro_sldwidth\";s:3:\"180\";}","a:22:{s:15:\"advps_thumbnail\";s:6:\"medium\";s:19:\"advps_default_image\";s:0:\"\";s:15:\"advps_sld_width\";s:3:\"600\";s:15:\"advps_centering\";s:2:\"no\";s:13:\"advps_bgcolor\";s:7:\"#FFFFFF\";s:17:\"advps_border_size\";s:1:\"1\";s:17:\"advps_border_type\";s:5:\"solid\";s:18:\"advps_border_color\";s:7:\"#444444\";s:19:\"advps_remove_border\";s:2:\"no\";s:13:\"advps_bxshad1\";s:1:\"0\";s:13:\"advps_bxshad2\";s:1:\"1\";s:13:\"advps_bxshad3\";s:1:\"4\";s:17:\"advps_bxshadcolor\";s:7:\"#000000\";s:16:\"advps_remove_shd\";s:2:\"no\";s:14:\"advps_contpad1\";s:3:\"0.8\";s:14:\"advps_contpad2\";s:3:\"0.8\";s:14:\"advps_contpad3\";s:3:\"0.8\";s:14:\"advps_contpad4\";s:3:\"0.8\";s:11:\"advps_padu1\";s:2:\"vw\";s:11:\"advps_padu2\";s:2:\"vw\";s:11:\"advps_padu3\";s:2:\"vw\";s:11:\"advps_padu4\";s:2:\"vw\";}","a:35:{s:17:\"advps_content_set\";a:3:{i:0;s:5:\"thumb\";i:1;s:5:\"title\";i:2;s:7:\"excerpt\";}s:16:\"advps_cont_width\";s:3:\"250\";s:16:\"advps_ttitle_tag\";s:2:\"h2\";s:17:\"advps_titleFcolor\";s:7:\"#565656\";s:17:\"advps_titleHcolor\";s:7:\"#000000\";s:17:\"advps_titleFsizeL\";s:2:\"20\";s:17:\"advps_titleFsize1\";s:2:\"18\";s:17:\"advps_titleFsize2\";s:2:\"16\";s:17:\"advps_titleFsize3\";s:2:\"15\";s:17:\"advps_titleFsize4\";s:2:\"15\";s:17:\"advps_titleFsize5\";s:2:\"15\";s:19:\"advps_titleLheightL\";s:2:\"20\";s:19:\"advps_titleLheight1\";s:2:\"18\";s:19:\"advps_titleLheight2\";s:2:\"16\";s:19:\"advps_titleLheight3\";s:2:\"15\";s:19:\"advps_titleLheight4\";s:2:\"15\";s:19:\"advps_titleLheight5\";s:2:\"15\";s:17:\"advps_excptFcolor\";s:7:\"#444444\";s:17:\"advps_excptFsizeL\";s:2:\"14\";s:17:\"advps_excptFsize1\";s:2:\"12\";s:17:\"advps_excptFsize2\";s:2:\"12\";s:17:\"advps_excptFsize3\";s:2:\"12\";s:17:\"advps_excptFsize4\";s:2:\"12\";s:17:\"advps_excptFsize5\";s:2:\"12\";s:19:\"advps_excptLheightL\";s:2:\"14\";s:19:\"advps_excptLheight1\";s:2:\"12\";s:19:\"advps_excptLheight2\";s:2:\"12\";s:19:\"advps_excptLheight3\";s:2:\"12\";s:19:\"advps_excptLheight4\";s:2:\"12\";s:19:\"advps_excptLheight5\";s:2:\"12\";s:16:\"advps_excerptlen\";s:2:\"25\";s:13:\"advps_ed_link\";s:6:\"enable\";s:15:\"advps_link_type\";s:9:\"permalink\";s:14:\"advps_link_rel\";s:4:\"none\";s:17:\"advps_link_target\";s:5:\"_self\";}","a:9:{s:19:\"advps_exclude_pager\";s:2:\"no\";s:16:\"advps_pager_type\";s:6:\"bullet\";s:18:\"advps_pthumb_width\";s:2:\"10\";s:17:\"advps_pager_align\";s:6:\"center\";s:18:\"advps_pager_bottom\";s:3:\"-35\";s:23:\"advps_exclude_playpause\";s:2:\"no\";s:18:\"advps_ppause_align\";s:6:\"center\";s:19:\"advps_ppause_bottom\";s:1:\"6\";s:21:\"advps_exclude_nxtprev\";s:2:\"no\";}");


DROP TABLE IF EXISTS `wp_advps_thumbnail`;

CREATE TABLE `wp_advps_thumbnail` (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `thumb_name` varchar(500) NOT NULL,
  `width` int(4) NOT NULL,
  `height` int(4) NOT NULL,
  `crop` varchar(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

INSERT INTO `wp_advps_thumbnail` VALUES("1","advps-thumb-one","600","220","yes");


DROP TABLE IF EXISTS `wp_aiowps_audit_log`;

CREATE TABLE `wp_aiowps_audit_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `network_id` bigint(20) NOT NULL DEFAULT '0',
  `site_id` bigint(20) NOT NULL DEFAULT '0',
  `username` varchar(60) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `ip` varchar(45) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `level` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `event_type` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `details` text COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `stacktrace` text COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `created` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `username` (`username`),
  KEY `ip` (`ip`),
  KEY `level` (`level`),
  KEY `event_type` (`event_type`)
) ENGINE=InnoDB AUTO_INCREMENT=917505 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

