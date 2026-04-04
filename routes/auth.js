const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Đăng ký
router.post('/dang-ky', async (req, res) => {
    try {
        const { ho_ten, email, mat_khau, so_dien_thoai } = req.body;
        
        // Kiểm tra email đã tồn tại
        const [existing] = await db.execute(
            'SELECT id FROM users WHERE email = ?', [email]
        );
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }
        
        const hashedPass = await bcrypt.hash(mat_khau, 10);
        await db.execute(
            'INSERT INTO users (ho_ten, email, mat_khau, so_dien_thoai) VALUES (?, ?, ?, ?)',
            [ho_ten, email, hashedPass, so_dien_thoai]
        );
        
        res.json({ message: 'Đăng ký thành công!' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
});

// Đăng nhập
router.post('/dang-nhap', async (req, res) => {
    try {
        const { email, mat_khau } = req.body;
        
        const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ?', [email]
        );
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
        
        const user = users[0];
        const isValid = await bcrypt.compare(mat_khau, user.mat_khau);
        if (!isValid) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
        
        const token = jwt.sign(
            { id: user.id, vai_tro: user.vai_tro },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );
        
        res.json({
            token,
            user: { id: user.id, ho_ten: user.ho_ten, email: user.email, vai_tro: user.vai_tro }
        });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
});

module.exports = router;