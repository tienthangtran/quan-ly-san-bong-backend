const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Đặt sân
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { san_id, ngay_dat, gio_bat_dau, gio_ket_thuc, ghi_chu } = req.body;
        const user_id = req.user.id;
        
        // Kiểm tra sân có trống không
        const [conflicts] = await db.execute(
            `SELECT id FROM dat_san 
             WHERE san_id = ? AND ngay_dat = ? AND trang_thai != 'da_huy'
             AND ((gio_bat_dau < ? AND gio_ket_thuc > ?) OR (gio_bat_dau < ? AND gio_ket_thuc > ?))`,
            [san_id, ngay_dat, gio_ket_thuc, gio_bat_dau, gio_ket_thuc, gio_bat_dau]
        );
        
        if (conflicts.length > 0) {
            return res.status(400).json({ message: 'Sân đã được đặt trong khung giờ này!' });
        }
        
        // Tính tiền
        const [san] = await db.execute('SELECT gia_thue FROM san_bong WHERE id = ?', [san_id]);
        const soGio = (new Date(`2000-01-01 ${gio_ket_thuc}`) - new Date(`2000-01-01 ${gio_bat_dau}`)) / 3600000;
        const tong_tien = san[0].gia_thue * soGio;
        
        const [result] = await db.execute(
            `INSERT INTO dat_san (user_id, san_id, ngay_dat, gio_bat_dau, gio_ket_thuc, tong_tien, ghi_chu)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user_id, san_id, ngay_dat, gio_bat_dau, gio_ket_thuc, tong_tien, ghi_chu]
        );
        
        res.json({ message: 'Đặt sân thành công!', id: result.insertId, tong_tien });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
});

// Lấy lịch sử đặt sân của người dùng
router.get('/cua-toi', authMiddleware, async (req, res) => {
    try {
        const [bookings] = await db.execute(
            `SELECT ds.*, sb.ten_san, sb.loai_san 
             FROM dat_san ds 
             JOIN san_bong sb ON ds.san_id = sb.id
             WHERE ds.user_id = ? ORDER BY ds.ngay_tao DESC`,
            [req.user.id]
        );
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Hủy đặt sân
router.put('/:id/huy', authMiddleware, async (req, res) => {
    try {
        const [booking] = await db.execute(
            'SELECT * FROM dat_san WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        
        if (booking.length === 0) return res.status(404).json({ message: 'Không tìm thấy đơn đặt sân' });
        if (booking[0].trang_thai === 'da_huy') return res.status(400).json({ message: 'Đơn đã bị hủy' });
        
        await db.execute('UPDATE dat_san SET trang_thai = "da_huy" WHERE id = ?', [req.params.id]);
        res.json({ message: 'Hủy đặt sân thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Admin: Xem tất cả đơn đặt
router.get('/tat-ca', authMiddleware, async (req, res) => {
    if (req.user.vai_tro !== 'admin') return res.status(403).json({ message: 'Không có quyền' });
    try {
        const [bookings] = await db.execute(
            `SELECT ds.*, sb.ten_san, u.ho_ten, u.so_dien_thoai
             FROM dat_san ds
             JOIN san_bong sb ON ds.san_id = sb.id
             JOIN users u ON ds.user_id = u.id
             ORDER BY ds.ngay_tao DESC`
        );
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;