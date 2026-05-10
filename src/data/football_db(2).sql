-- Tạo database
CREATE DATABASE football_db;
USE football_db;

-- Bảng người dùng
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ho_ten VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mat_khau VARCHAR(255) NOT NULL,
    so_dien_thoai VARCHAR(15),
    vai_tro ENUM('admin', 'khach_hang') DEFAULT 'khach_hang',
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng sân bóng
CREATE TABLE san_bong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_san VARCHAR(100) NOT NULL,
    loai_san ENUM('5 nguoi', '7 nguoi', '11 nguoi') NOT NULL,
    gia_thue DECIMAL(10,2) NOT NULL,  -- giá theo giờ
    mo_ta TEXT,
    hinh_anh VARCHAR(255),
    trang_thai ENUM('hoat_dong', 'bao_tri') DEFAULT 'hoat_dong',
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng đặt sân
CREATE TABLE dat_san (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    san_id INT NOT NULL,
    ngay_dat DATE NOT NULL,
    gio_bat_dau TIME NOT NULL,
    gio_ket_thuc TIME NOT NULL,
    tong_tien DECIMAL(10,2) NOT NULL,
    trang_thai ENUM('cho_xac_nhan', 'da_xac_nhan', 'da_huy', 'hoan_thanh') DEFAULT 'cho_xac_nhan',
    ghi_chu TEXT,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (san_id) REFERENCES san_bong(id)
);

-- Bảng thanh toán
CREATE TABLE thanh_toan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dat_san_id INT NOT NULL,
    so_tien DECIMAL(10,2) NOT NULL,
    phuong_thuc ENUM('tien_mat', 'chuyen_khoan', 'vi_dien_tu') NOT NULL,
    trang_thai ENUM('cho_thanh_toan', 'da_thanh_toan') DEFAULT 'cho_thanh_toan',
    ngay_thanh_toan TIMESTAMP,
    FOREIGN KEY (dat_san_id) REFERENCES dat_san(id)
);

-- Dữ liệu mẫu
INSERT INTO users VALUES (1, 'Admin', 'admin@sanbong.vn', MD5('admin123'), '0901234567', 'admin', NOW());
INSERT INTO users VALUES (2, 'Nguyễn Văn A', 'nguyenvana@gmail.com', MD5('123456'), '0912345678', 'khach_hang', NOW());

INSERT INTO san_bong VALUES 
(1, 'Sân A1', '5 nguoi', 200000, 'Sân cỏ nhân tạo, có mái che', 'san_a1.jpg', 'hoat_dong', NOW()),
(2, 'Sân B1', '7 nguoi', 350000, 'Sân cỏ nhân tạo cao cấp', 'san_b1.jpg', 'hoat_dong', NOW()),
(3, 'Sân C1', '11 nguoi', 600000, 'Sân tiêu chuẩn thi đấu', 'san_c1.jpg', 'hoat_dong', NOW());
