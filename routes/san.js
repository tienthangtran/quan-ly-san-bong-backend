const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Lấy danh sách sân
router.get('/', async (req, res) => {
    try {
        const [sans] = await db.execute(
            'SELECT * FROM san_bong WHERE trang_thai = "hoat_dong"'
        );
        res.json(sans);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Lấy sân theo ID
router.get('/:id', async (req, res) => {
    try {
        const [sans] = await db.execute(
            'SELECT * FROM san_bong WHERE id = ?', [req.params.id]
        );
        if (sans.length === 0) return res.status(404).json({ message: 'Không tìm thấy sân' });
        res.json(sans[0]);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Kiểm tra sân trống theo ngày
router.get('/:id/lich', async (req, res) => {
    try {
        const { ngay } = req.query;
        const [bookings] = await db.execute(
            `SELECT gio_bat_dau, gio_ket_thuc FROM dat_san 
             WHERE san_id = ? AND ngay_dat = ? AND trang_thai != 'da_huy'`,
            [req.params.id, ngay]
        );
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Thêm sân (Admin)
router.post('/', authMiddleware, async (req, res) => {
    if (req.user.vai_tro !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền' });
    }
    try {
        const { ten_san, loai_san, gia_thue, mo_ta } = req.body;
        const [result] = await db.execute(
            'INSERT INTO san_bong (ten_san, loai_san, gia_thue, mo_ta) VALUES (?, ?, ?, ?)',
            [ten_san, loai_san, gia_thue, mo_ta]
        );
        res.json({ message: 'Thêm sân thành công', id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;