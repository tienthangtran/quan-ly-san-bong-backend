CREATE DATABASE IF NOT EXISTS football_db;
USE football_db;

-- Bảng users
CREATE TABLE IF NOT EXISTS users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
role ENUM('admin', 'user') DEFAULT 'user',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng sân
CREATE TABLE IF NOT EXISTS fields (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
type VARCHAR(50),
price_per_hour DECIMAL(10,2) NOT NULL,
status ENUM('available', 'maintenance') DEFAULT 'available'
);

-- Bảng đặt sân
CREATE TABLE IF NOT EXISTS bookings (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
field_id INT,
booking_date DATE,
time_start TIME,
time_end TIME,
status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (field_id) REFERENCES fields(id)
);

-- Bảng thanh toán
CREATE TABLE IF NOT EXISTS payments (
id INT AUTO_INCREMENT PRIMARY KEY,
booking_id INT,
amount DECIMAL(10,2),
payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Dữ liệu users
INSERT INTO users (username, password, role) VALUES
('admin', '123456', 'admin'),
('user1', '123456', 'user'),
('user2', '123456', 'user'),
('user3', '123456', 'user');

-- Dữ liệu sân
INSERT INTO fields (name, type, price_per_hour, status) VALUES
('Sân A', '5 người', 200000, 'available'),
('Sân B', '7 người', 300000, 'available'),
('Sân C', '5 người', 180000, 'available'),
('Sân D', '7 người', 320000, 'available'),
('Sân E', '11 người', 500000, 'maintenance'),
('Sân F', '5 người', 200000, 'available');

-- Dữ liệu booking
INSERT INTO bookings (user_id, field_id, booking_date, time_start, time_end, status) VALUES
(2, 1, '2026-03-25', '18:00:00', '19:00:00', 'confirmed'),
(1, 2, '2026-03-26', '17:00:00', '18:00:00', 'confirmed'),
(2, 3, '2026-03-26', '18:00:00', '19:30:00', 'pending'),
(3, 1, '2026-03-27', '16:00:00', '17:00:00', 'confirmed');

-- Dữ liệu payment
INSERT INTO payments (booking_id, amount, payment_status) VALUES
(1, 200000, 'paid'),
(2, 300000, 'unpaid'),
(3, 200000, 'paid');
