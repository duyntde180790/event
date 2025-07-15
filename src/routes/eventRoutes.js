import express from 'express';
import { renderEventsList, renderEventDetail } from '../controllers/eventController.js';

const router = express.Router();

// Hiển thị danh sách sự kiện cho tất cả mọi người
router.get('/list', renderEventsList);

// Hiển thị chi tiết 1 sự kiện cho tất cả mọi người
router.get('/detail/:id', renderEventDetail);

export default router; 