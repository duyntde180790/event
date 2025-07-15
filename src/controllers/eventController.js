import Event from '../models/eventModel.js';

// Hiển thị danh sách sự kiện cho sinh viên
export const renderEventsList = async (req, res) => {
  try {
    const events = await Event.find();
    res.render('events', { events });
  } catch (error) {
    res.status(500).send('Không thể tải danh sách sự kiện');
  }
};

// Hiển thị chi tiết 1 sự kiện cho sinh viên
export const renderEventDetail = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('Không tìm thấy sự kiện');
    res.render('eventDetail', { event });
  } catch (error) {
    res.status(500).send('Không thể tải chi tiết sự kiện');
  }
}; 