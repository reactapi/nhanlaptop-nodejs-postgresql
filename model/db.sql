CREATE TABLE address (
  id SERIAL,
  customer_id varchar(15) NOT NULL,
  address varchar(255) NOT NULL,
  active smallint NOT NULL DEFAULT '0'
)  ;


INSERT INTO address (id, customer_id, address, active) VALUES
(4, 'lzXBPgL70H', 'KP 7, Phường 1, Thành phố Cà Mau, Cà Mau 3232', 0),
(5, 'lzXBPgL70H', 'KP1, Xã Định Môn, Huyện Thới Lai, Cần Thơ', 0);


CREATE TABLE administrator (
  user_id varchar(15) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  full_name varchar(50) NOT NULL,
  role int NOT NULL DEFAULT '2'
)  ;


INSERT INTO administrator (user_id, email, password, full_name, role) VALUES
('H1fY224dAb', 'admin@gmail.com', '$2a$10$smdbgwQtpEaiEjFWQUzbVOYr21LE8N0zssLPUXjYRjGtfh99qsUTW', 'Nhân Ngô', 3),
('NvfY135dbc', 'nhanvien@gmail.com', '$2a$12$61gU8ZvB1LMMQann9rgp4uj8q3MsksI10wOjD65nZxx6pDcRJQhYW', 'Nhân viên A', 2);

CREATE TABLE brand (
  id SERIAL,
  name varchar(20) NOT NULL,
  slug varchar(20) NOT NULL,
  alias varchar(20) NOT NULL
)  ;


INSERT INTO brand (id, name, slug, alias) VALUES
(1, 'Acer', 'acer', 'AC'),
(2, 'MSI', 'msi', 'MSI'),
(3, 'Lenovo', 'lenovo', 'LE'),
(4, 'HP', 'hp', 'HP'),
(5, 'Dell', 'dell', 'DE'),
(6, 'Intel', 'intel', 'INTEL');

CREATE TABLE order (
  order_id varchar(15) NOT NULL,
  customer_id varchar(15) DEFAULT NULL,
  full_name varchar(50) NOT NULL,
  phone_number varchar(11) NOT NULL,
  email varchar(50) NOT NULL,
  address varchar(255) NOT NULL,
  created_at timestamp(0) NOT NULL,
  total int NOT NULL,
  pay_method smallint NOT NULL,
  status smallint NOT NULL
)  ;

--
-- SQLINES DEMO *** table order
--

INSERT INTO order (order_id, customer_id, full_name, phone_number, email, address, created_at, total, pay_method, status) VALUES
('7Nc519B8tS', 'lzXBPgL70H', 'Nhan', '09508434', '19520800@gm.uit.edu.vn', 'KP 7, Phường 1, Thành phố Cà Mau, Cà Mau', '2022-03-20 21:32:09', 80039000, 2, 3),
('9m8jdhAWAi', 'lOP7l0ilLT', 'Ngô Nhân', '05994854', 'nhan231@gmail.com', 'Ấp 5, Xã Minh Đức, Huyện Mỏ Cày Nam, Bến Tre', '2022-03-21 22:10:41', 30040000, 2, 0),
('aThzVdzQMg', 'lzXBPgL70H', 'Nhan', '9867565', '19520800@gm.uit.edu.vn', 'KP1, Xã Định Môn, Huyện Thới Lai, Cần Thơ', '2022-04-17 13:46:10', 27200000, 2, 3),
('c6gsYMtmlq', 'lzXBPgL70H', 'Nhan', '0950454', '19520800@gm.uit.edu.vn', 'KP1, Xã Định Môn, Huyện Thới Lai, Cần Thơ', '2022-03-20 21:33:47', 49999000, 2, 0),
('kgDB8aXcJo', NULL, 'Ngô Hữu Nhân', '0908312', 'nhan@gmail.com', 'Ấp 2, Xã Tân Trung, Huyện Mỏ Cày Nam, Bến Tre', '2022-03-20 21:40:57', 38940000, 2, 0),
('uIeo4dRTmo', NULL, 'Nguyễn Thị Ngọc', '0878778', 'ngocthi@gmail.com', 'KP 6, Phường 1, Thành phố Cà Mau, Cà Mau', '2022-03-22 23:54:57', 17350000, 2, 3),
('YdU3iNdAOB', 'lzXBPgL70H', 'Ngô Nhàn', '9096859', '19520800@gm.uit.edu.vn', 'Ấp 2, Xã An Bình Tây, Huyện Ba Tri, Bến Tre', '2022-03-22 23:52:04', 55750000, 2, 0);

-- SQLINES DEMO *** ---------------------------------------

--
-- SQLINES DEMO *** or table order_detail
--

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE order_detail (
  order_id varchar(15) NOT NULL,
  product_id varchar(20) NOT NULL,
  quantity int NOT NULL,
  total int DEFAULT NULL
)  ;

--
-- SQLINES DEMO *** table order_detail
--

INSERT INTO order_detail (order_id, product_id, quantity, total) VALUES
('7Nc519B8tS', 'LTAC0003', 1, 49999000),
('7Nc519B8tS', 'LTDE0001', 2, 30040000),
('9m8jdhAWAi', 'LTDE0001', 2, 30040000),
('aThzVdzQMg', 'LTDE13414', 1, 14400000),
('aThzVdzQMg', 'LTHP0002', 1, 12800000),
('c6gsYMtmlq', 'LTAC0003', 1, 49999000),
('kgDB8aXcJo', 'LTHP0001', 1, 17350000),
('kgDB8aXcJo', 'LTHP0002', 1, 12800000),
('kgDB8aXcJo', 'LTLE0001', 1, 8790000),
('uIeo4dRTmo', 'LTHP0001', 1, 17350000),
('YdU3iNdAOB', 'LTHP0001', 1, 17350000),
('YdU3iNdAOB', 'LTHP0002', 3, 38400000);

-- SQLINES DEMO *** ---------------------------------------

--
-- SQLINES DEMO *** or table category
--

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE category (
  id SERIAL,
  name varchar(40) NOT NULL,
  slug varchar(40) NOT NULL,
  parent_id int DEFAULT '0'
)  ;

--
-- SQLINES DEMO *** table category
--

INSERT INTO category (id, name, slug, parent_id) VALUES
(1, 'Laptop', 'laptop', 0),
(4, 'Laptop Gaming', 'laptop-gaming', 1),
(5, 'Laptop Văn Phòng', 'laptop-van-phong', 1),
(7, 'RAM', 'ram', 0),
(8, 'Chuột', 'chuột', 0),
(9, 'Balo', 'balo', 0);

-- SQLINES DEMO *** ---------------------------------------

--
-- SQLINES DEMO *** or table customer
--

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE customer (
  customer_id varchar(15) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(100) DEFAULT NULL,
  full_name varchar(255) DEFAULT NULL,
  avatarDefault varchar(500) NOT NULL DEFAULT 'https://res.cloudinary.com/dbynglvwk/image/upload/v1650182653/NHANLAPTOP/istockphoto-666545204-612x612_yu3gcq.jpg',
  avatar varchar(500) DEFAULT NULL,
  public_id varchar(255) DEFAULT NULL,
  role smallint NOT NULL DEFAULT '0'
  code_reset_password varchar(255) DEFAULT NULL,
)  ;

--
-- SQLINES DEMO *** table customer
--

INSERT INTO customer (customer_id, email, password, full_name, avatarDefault, avatar, public_id, role) VALUES
('lzXBPgL70H', '19520800@gm.uit.edu.vn', '$2b$10$xyVGtn6Oh3BwyXVAADdgv.B3GhTsYAYWGnaRnkuRxclp.ws.EZWei', 'Nhan', 'https://res.cloudinary.com/dbynglvwk/image/upload/v1650182653/NHANLAPTOP/istockphoto-666545204-612x612_yu3gcq.jpg', 'https://res.cloudinary.com/dbynglvwk/image/upload/v1650175834/NHANLAPTOP/hmzfqttyslbms0zkke4p.jpg', 'NHANLAPTOP/hmzfqttyslbms0zkke4p', 0),
('lOP7l0ilLT', 'project.php.nhncomputer@gmail.com', '$2b$10$N0ymGDNhZgyFwCj3uMS0Xeng.gjE5BPUVXkapYg5YP7dnSOwULNB6', 'Ngô Nhân', 'https://res.cloudinary.com/dbynglvwk/image/upload/v1650182653/NHANLAPTOP/istockphoto-666545204-612x612_yu3gcq.jpg', NULL, '', 0),
('5kfD7zXLmR', 'nhan@gmail.com', '$2b$10$y4G.JbyhLaox8zqgxj0RS.TYno54Hnh6O2vM8zsfjZ4VbPMX0nk6.', 'Nhân', 'https://res.cloudinary.com/dbynglvwk/image/upload/v1650182653/NHANLAPTOP/istockphoto-666545204-612x612_yu3gcq.jpg', NULL, NULL, 0),
('3nlLyeM2xy', 'hung1@hotmail.com', '$2b$10$IwZFdBxWyzuzsb3UKo9daeeD9pL8cy65yjLsITDsLoSt08Z4kduxa', 'Hung', 'https://res.cloudinary.com/dbynglvwk/image/upload/v1650182653/NHANLAPTOP/istockphoto-666545204-612x612_yu3gcq.jpg', 'https://res.cloudinary.com/dbynglvwk/image/upload/v1650201211/NHANLAPTOP/vitdmunn02zxqluz6ci2.png', 'NHANLAPTOP/vitdmunn02zxqluz6ci2', 0);

-- SQLINES DEMO *** ---------------------------------------

--
-- SQLINES DEMO *** or table laptop_specification
--

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE laptop_specification (
  id SERIAL,
  product_id varchar(20) NOT NULL,
  cpu varchar(40) DEFAULT NULL,
  cpuDetail varchar(60) DEFAULT NULL,
  ram int DEFAULT NULL,
  hardDriveSize varchar(20) DEFAULT NULL,
  hardDriveDesc varchar(60) DEFAULT NULL,
  graphics varchar(60) DEFAULT NULL,
  screen varchar(60) DEFAULT NULL,
  weight double precision DEFAULT NULL
)  ;

--
-- SQLINES DEMO *** table laptop_specification
--

INSERT INTO laptop_specification (id, product_id, cpu, cpuDetail, ram, hardDriveSize, hardDriveDesc, graphics, screen, weight) VALUES
(1, 'LTAC0001', 'AMD Ryzen 5', '5500U (6 nhân 12 luồng)', 8, '512GB SSD', 'PCIe® NVMe™ M.2', 'NVIDIA GeForce GTX 1650 4GB GDDR6', '15.6 inch FHD (1920 x 1080) 144Hz', 2.15),
(2, 'LTLE0001', 'Intel Pentium', 'N5030', 4, '256GB SSD', '', 'Intel UHD Graphics', '11.6 inch HD (1366 x 768) TN', 1.2),
(3, 'LTAC0002', 'Intel Core i5', '1035G1 1.0GHz up to 3.6GHz 6MB', 4, '256GB SSD', 'M.2 PCIE, 1x slot SATA3 2.5"', 'Intel UHD Graphics', '15.6 inch FHD (1920 x 1080), IPS, Acer ComfyView LCD, ', 1.7),
(4, 'LTDE0001', 'AMD Ryzen 3', '3250U (2.6Ghz/4MB cache)', 8, '256GB SSD', 'M.2 PCIe NVMe', 'AMD Radeon Graphics', '15.6-inch FHD (1920 x 1080) Anti-glare LED Backlig', 1.83),
(5, 'LTDE0002', 'Intel Core i3', 'Tiger Lake 1.70 GHz', 8, '256GB SSD', 'NVMe PCIe', 'Intel UHD Graphics', '14 inch Full HD (1920 x 1080)', 1.64),
(6, 'LTHP0001', 'Intel Core i5', '1135G7', 4, '256GB SSD', 'PCIe (M.2 2280)', 'Intel UHD Graphics', '14 inch ( 1366 x 768 ) FHD', 1.4),
(7, 'LTHP0002', 'Intel Core i3', '10110U, up to 4.1GHz', 4, '256GB SSD', 'PCIe® NVMe™ M.2', 'Intel UHD Graphics', '15.6 inch HD (1366x768)', 1.78),
(8, 'LTMSI0001', 'Intel Core i5', '10500H 2.50GHz upto 4.50GHz, 6 cores 12 ', 8, '512GB SSD', 'M.2 PCIE', 'NVIDIA GeForce GTX 1650 4GB GDDR6', '15.6 inch FHD (1920 x 1080) IPS', 1.86),
(9, 'LTMSI0002', 'AMD Ryzen 5', '5600H 3.30GHz upto 4.20GHz, 6 cores 12 t', 8, '512GB SSD', 'NVMe PCIe Gen3x4', 'Radeon RX5500M 4GB', '15.6 inch FHD (1920*1080) 60Hz', 2.35),
(10, 'LTLE0002', 'Intel Core i3', '1115G4', 8, '256GB SSD', 'M.2 PCIe', 'Intel UHD Graphics', '15.6 inch FHD (1920 x 1080) TN', 1.65),
(11, 'LTDE0003', 'Intel Core i5', '11300H', 8, '512GB SSD', 'PCIe NVMe', 'Intel UHD Graphics', '15.6 inch FHD (1920 x 1080)', 1.63),
(12, 'LTAC0003', 'Intel Core i7', '11800H (2.3Ghz upto 4.6Ghz, 24MB cache)', 16, '512GB SSD', 'PCIe NVMe SED', 'NVIDIA GeForce RTX 3070 8G-GDDR6', '15.6 inch QHD 165Hz', 2),
(14, 'LTDE13414', 'Intel Core i3', '1115G4', 8, '128GB SSD', '', 'Intel UHD', '15.6 inch FHD', 1.73);

-- SQLINES DEMO *** ---------------------------------------

--
-- SQLINES DEMO *** or table product
--

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE product (
  product_id varchar(20) NOT NULL,
  product_type smallint NOT NULL,
  slug varchar(255) NOT NULL,
  categoryId int NOT NULL,
  name varchar(100) NOT NULL,
  brand int NOT NULL,
  thumbnail varchar(255) NOT NULL,
  public_id varchar(255) NOT NULL,
  price int NOT NULL,
  discount int NOT NULL,
  created_at timestamp(0) DEFAULT NULL,
  status smallint NOT NULL DEFAULT '1'
)  ;

--
-- SQLINES DEMO *** table product
--

INSERT INTO product (product_id, product_type, slug, categoryId, name, brand, thumbnail, public_id, price, discount, created_at, status) VALUES
('LTAC0001', 1, 'acer-aspire-7-a715-42g-r05g', 4, 'Acer Aspire 7 A715 42G R05G', 1, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1650349037/NHANLAPTOP/eqqyd3kyx60t5satma4o.jpg', 'NHANLAPTOP/eqqyd3kyx60t5satma4o', 21699000, 4, '2022-03-19 03:09:18', 1),
('LTAC0002', 1, 'acer-aspire-3-a315-56-37dv', 5, 'Acer Aspire 3 A315-56-37DV', 1, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1641128689/Project-NHN-Computer-PHP/Laptop/58716_laptop_acer_aspire_3_a315_56_17_qruzug.jpg', 'Project-NHN-Computer-PHP/Laptop/58716_laptop_acer_aspire_3_a315_56_17_qruzug', 12599000, 2, NULL, 1),
('LTAC0003', 1, 'acer-gaming-predator-triton-300', 4, 'Acer Gaming Predator Triton 300', 1, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1641386760/Project-NHN-Computer-PHP/Laptop/60632_laptop_acer_gaming_predator_triton_300_pt315_53_11_zyccno.jpg', 'Project-NHN-Computer-PHP/Laptop/60632_laptop_acer_gaming_predator_triton_300_pt315_53_11_zyccno', 49999000, 0, NULL, 1),
('LTDE0001', 1, 'dell-inspiron-3505-y1n1t3', 5, 'Dell Inspiron 3505 Y1N1T3', 5, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1641128717/Project-NHN-Computer-PHP/Laptop/60971_inspiron3505_4_obt2qf.png', 'Project-NHN-Computer-PHP/Laptop/60971_inspiron3505_4_obt2qf', 15489000, 3, NULL, 1),
('LTDE0002', 1, 'dell-vostro-3400-70235020', 5, 'Dell Vostro 3400 70235020', 5, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1641128786/Project-NHN-Computer-PHP/Laptop/57844_vostro3400__3__feeuxo.png', 'Project-NHN-Computer-PHP/Laptop/57844_vostro3400__3__feeuxo', 15589000, 0, NULL, 0),
('LTDE0003', 1, 'dell-vostro-5510', 5, 'Dell Vostro 5510', 5, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1641386157/Project-NHN-Computer-PHP/Laptop/60797_laptop_dell_vostro_5510_70253901_xam_2021_5_vsykie.jpg', 'Project-NHN-Computer-PHP/Laptop/60797_laptop_dell_vostro_5510_70253901_xam_2021_5_vsykie', 22499000, 2, '2022-03-17 19:33:02', 1),
('LTDE13414', 1, 'dell-inspiron-3511', 5, 'Dell Inspiron 3511', 5, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1648025121/NHANLAPTOP/flunb5idvthuf98nwhfk.jpg', 'NHANLAPTOP/flunb5idvthuf98nwhfk', 14689000, 2, '2022-03-23 15:45:04', 1),
('LTHP0001', 1, 'hp-240-g8-518v6pa', 5, 'HP 240 G8 518V6PA', 4, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1641128822/Project-NHN-Computer-PHP/Laptop/63289_laptop_hp_240_g8_6_gcgdix.jpg', 'Project-NHN-Computer-PHP/Laptop/63289_laptop_hp_240_g8_6_gcgdix', 17699000, 2, NULL, 1),
('LTHP0002', 1, 'hp-15s-du1105tu-2z6l3pa', 5, 'HP 15s du1105TU 2Z6L3PA', 4, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1641128848/Project-NHN-Computer-PHP/Laptop/63290_laptop_hp_15s_15_vnddh0.jpg', 'Project-NHN-Computer-PHP/Laptop/63290_laptop_hp_15s_15_vnddh0', 13199000, 3, '2022-03-08 00:00:00', 1),
('LTLE0001', 1, 'lenovo-ip1-11igl05-81vt006fvn', 5, 'Lenovo IP1 11IGL05 81VT006FVN', 3, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1641129167/Project-NHN-Computer-PHP/Laptop/11igl05_-77_m0hr95.png', 'Project-NHN-Computer-PHP/Laptop/11igl05_-77_m0hr95', 8790000, 0, NULL, 1),
('LTLE0002', 1, 'lenovo-ideapad-3-15itl6-82h800m4vn', 5, 'Lenovo IdeaPad 3 15ITL6 82H800M4VN', 3, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1641129041/Project-NHN-Computer-PHP/Laptop/61009_laptop_lenovo_ideapad_3_3_e2acbs.jpg', 'Project-NHN-Computer-PHP/Laptop/61009_laptop_lenovo_ideapad_3_3_e2acbs', 14499000, 3, NULL, 1),
('LTMSI0001', 1, 'msi-gf63-thin-10sc-468vn', 4, 'MSI GF63 Thin 10SC 468VN', 2, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1641129109/Project-NHN-Computer-PHP/Laptop/60212_laptop_msi_gaming_gf63_thin_10sc_468vn_den_2021_12_fmbzk3.jpg', 'Project-NHN-Computer-PHP/Laptop/60212_laptop_msi_gaming_gf63_thin_10sc_468vn_den_2021_12_fmbzk3', 21289000, 3, '2022-03-16 00:00:00', 1),
('LTMSI0002', 1, 'msi-bravo-15-b5dd-276vn', 4, 'MSI Bravo 15 B5DD 276VN', 2, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1641129136/Project-NHN-Computer-PHP/Laptop/61782_laptop_msi_gaming_bravo_15_9_zpxw2l.jpg', 'Project-NHN-Computer-PHP/Laptop/61782_laptop_msi_gaming_bravo_15_9_zpxw2l', 21999000, 4, NULL, 1),
('LPKLGT04413', 2, 'tai-nghe-logitech-h110', 15, 'Tai nghe Logitech H110', 7, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1650635303/NHANLAPTOP/o7obv2w4gsdmzjmeeixo.jpg', 'NHANLAPTOP/o7obv2w4gsdmzjmeeixo', 309000, 25, '2022-04-22 20:48:24', 1),
('LPKLGT037', 2, 'tai-nghe-logitech-h340', 15, 'Tai nghe Logitech H340', 7, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1650635849/NHANLAPTOP/bpwetblndshp7lvwuewu.jpg', 'NHANLAPTOP/bpwetblndshp7lvwuewu', 609000, 5, '2022-04-22 20:57:28', 1),
('LPKLGT00312', 2, 'tai-nghe-logitech-h390', 15, 'Tai nghe Logitech H390', 7, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1650635057/NHANLAPTOP/esenmbimkgvtafdsmlpn.jpg', 'NHANLAPTOP/esenmbimkgvtafdsmlpn', 909000, 20, '2022-04-22 20:44:16', 1),
('LPKLGT00134', 2, 'tai-nghe-khong-day-logitech-h600-wireless-headset', 15, 'Tai nghe không dây Logitech H600 Wireless Headset', 7, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1650635574/NHANLAPTOP/tz5pxhfqx0bwnaeur9wn.jpg', 'NHANLAPTOP/tz5pxhfqx0bwnaeur9wn', 1500000, 10, '2022-04-22 20:52:53', 1),
('LPKDE031231', 2, 'tui-chong-soc-dell-essential-sleeve-15-es1520v', 9, 'Túi chống sốc Dell Essential Sleeve 15 ES1520V', 5, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1650634596/NHANLAPTOP/y1u0mxpn1ewroppvxwqz.jpg', 'NHANLAPTOP/y1u0mxpn1ewroppvxwqz', 600000, 10, '2022-04-22 20:36:35', 1),
('LPKDE00012', 2, 'balo-dell-gaming-lite-backpack', 9, 'Balo Dell Gaming Lite Backpack', 5, 'https://res.cloudinary.com/dbynglvwk/image/upload/v1650634345/NHANLAPTOP/ypgoukn7o31el6gz3tct.jpg', 'NHANLAPTOP/ypgoukn7o31el6gz3tct', 990000, 10 '2022-04-22 20:32:27', 1);


CREATE TABLE product_review (
  product_id varchar(20) NOT NULL,
  content text NOT NULL
) ;


INSERT INTO product_review (product_id, content) VALUES
('LTAC0001', ''),
('LTDE13414', '<h1>test review</h1>');


CREATE TABLE product_type (
  id SERIAL,
  alias varchar(20) NOT NULL,
  name varchar(40) NOT NULL
) ;


INSERT INTO product_type (id, alias, name) VALUES
(1, 'LT', 'Laptop'),
(2, 'other', 'Khác');



CREATE TABLE accessories_info (
  product_id varchar(20) NOT NULL,
  description text,
  info varchar(100)
) ;


INSERT INTO accessories_info (product_id, description, info) VALUES
('LPKDE00012', '<p>- Thương hiệu: Dell</p><p>- Model: GM1720PE</p><p>- Màu sắc: Màu đen với màu đỏ là điểm nhấn</p><p>- Chất liệu chống nước&nbsp;</p><p>- Các ngăn chuyên dụng cho Gaming Gear&nbsp;</p><p>- Đa dụng cho nhiều mục đích sử dụng khác&nbsp;</p><p>- Laptop tối đa 17 inch</p>', ''),
('LPKLGT00312', '<p>- Thương hiệu: Logitech</p><p>- Trải nghiệm cuộc gọi Internet có âm thanh rõ ràng với kết nối USB-A cắm vào là phát&nbsp;</p><p>- Micro khử tiếng ồn.&nbsp;</p><p>- Các nút điều khiển trên dây cho phép bạn chỉnh âm lượng hoặc tắt tiếng mà không làm gián đoạn cuộc gọi.&nbsp;</p><p>- Các màng loa được chỉnh laze đem lại âm thanh kỹ thuật số cao cấp cho các bản nhạc hoặc trò chơi yêu thích của bạn.</p>', ''),
('LPKDE031231', '<p>- Thương hiêu: Dell</p><p>- Model: ES1520V</p><p>- Bảo hiểm cho máy tính của bạn khi bạn di chuyển.&nbsp;</p><p>- Túi chống sốc bền và chống nước tốt Phù hợp với Laptop &lt;=15 Inch&nbsp;</p><p>- Được thiết kế để vừa khít và an toàn, tay áo cao su tổng hợp, với lớp lót bên trong Nylex mềm mại, bảo vệ máy tính xách tay của bạn chống lại sự cố tràn, va đập và trầy xước.&nbsp;</p><p>- Trọng lượng nhỏ gọn, dễ dàng mang theo bên mình.</p>', ''),
('LPKLGT037', '<p>- Trở kháng đầu vào: 20 Ohm</p><p>- Độ nhạy (tai nghe): 115dB +/-3dB</p><p>- Độ nhạy (micrô): -42dBV/Pa +/- 3dB</p><p>- Độ nhạy tần số (Tai nghe): 20Hz - 20kHz</p><p>- Độ nhạy tần số (Micrô): 100Hz - 16kHz</p><p>- Độ dài dây cáp: 1,8m</p><p>- Kết nối: USB(1.1, 2.0, 3.0)</p>', ''),
('LPKLGT04413', '<p>- Thương hiêu: Logitech</p><p>- Trở kháng đầu vào: 32 Ohm</p><p>- Kết nối: Jack nối: 2 x 3.5 mm</p><p>- Độ nhạy (tai nghe): 100dB +/-3dB</p><p>- Độ nhạy (micrô): -58dBV/μBar, -38dBV/Pa +/-4dB</p><p>- Độ nhạy tần số (Tai nghe): 20Hz - 20kHz</p><p>- Độ nhạy tần số (Micrô): 100Hz - 16kHz</p><p>- Độ dài dây cáp: 1,8m</p>', ''),
('LPKLGT00134', '<p>- Thương hiệu: Logitech</p><p>- Thiết kế: Chụp tai</p><p>- Kết nối: USB Wireless</p><p>- Microphone: Có</p><p>- Màu sắc: Đen</p><p>- Mô tả khác: Thoải mái rời khỏi máy tính và đi lại tự do trong khi trò chuyện. Tai nghe không dây tầm xa có trọng lượng nhẹ này cho phép bạn nghe và nói chuyện lên tới 10 m. Các màng loa được chỉnh bằng laze và micrô khử tiếng ồn mang lại âm thanh nổi cho cuộc gọi rõ ràng. Hoạt động với Windows®, Mac và các ứng dụng gọi điện ưa thích. Quai đeo có thể điều chỉnh và miếng che tai bằng mút đem lại cảm giác thoải mái ngay cả sau nhiều giờ sử dụng.</p>', ''),;



ALTER TABLE address
  ADD PRIMARY KEY (id,customer_id);

ALTER TABLE administrator
  ADD PRIMARY KEY (user_id);

ALTER TABLE brand
  ADD PRIMARY KEY (id);

ALTER TABLE order
  ADD PRIMARY KEY (order_id);

ALTER TABLE order_detail
  ADD PRIMARY KEY (order_id,product_id);

ALTER TABLE category
  ADD PRIMARY KEY (id);

ALTER TABLE laptop_specification
  ADD PRIMARY KEY (id,product_id)

ALTER TABLE accessories_info
  ADD PRIMARY KEY (product_id)


ALTER TABLE product
  ADD PRIMARY KEY (product_id)


ALTER TABLE product_review
  ADD PRIMARY KEY (product_id);

ALTER TABLE order_detail
  ADD CONSTRAINT order_detail_ibfk_1 FOREIGN KEY (order_id) REFERENCES order (order_id),
  ADD CONSTRAINT order_detail_ibfk_2 FOREIGN KEY (product_id) REFERENCES produc (product_id);


ALTER TABLE laptop_specification
  ADD CONSTRAINT laptop_specification_ibfk_1 FOREIGN KEY (product_id) REFERENCES product (product_id);


ALTER TABLE product
  ADD CONSTRAINT product_ibfk_1 FOREIGN KEY (categoryId) REFERENCES category (id),
  ADD CONSTRAINT product_ibfk_2 FOREIGN KEY (brand) REFERENCES brand (id);


ALTER TABLE product_review
  ADD CONSTRAINT product_review_ibfk_1 FOREIGN KEY (product_id) REFERENCES product (product_id) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;