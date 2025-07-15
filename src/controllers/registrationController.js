import Registration from '../models/registrationModel.js';
import Event from '../models/eventModel.js';

// Register for an event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const studentId = req.user._id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Check if event has reached maximum capacity
    const currentRegistrations = await Registration.countDocuments({ eventId });
    if (currentRegistrations >= event.capacity) {
      return res.status(400).json({
        status: 'error',
        message: 'Đã đạt sức chứa tối đa'
      });
    }
    
    const registration = await Registration.create({
      studentId,
      eventId
    });

    res.status(201).json({
      status: 'success',
      data: {
        registration
      }
    });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({
        status: 'error',
        message: 'You have already registered for this event'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Error registering for event'
    });
  }
};

// Unregister from an event
export const unregisterFromEvent = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const studentId = req.user._id;

    const registration = await Registration.findOneAndDelete({
      _id: registrationId,
      studentId
    });

    if (!registration) {
      return res.status(404).json({
        status: 'error',
        message: 'Registration not found or not authorized'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Successfully unregistered from event'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error unregistering from event'
    });
  }
};

// Get list of registrations (admin only)
export const getRegistrations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const registrations = await Registration.find()
      .populate('eventId', 'name date location') // Add event details
      .populate('studentId', 'username') // Add student username
      .skip(skip)
      .limit(limit)
      .sort({ registrationDate: -1 });

    const total = await Registration.countDocuments();

    if (registrations.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'No registrations found',
        data: {
          registrations: [],
          total: 0,
          page,
          pages: 0
        }
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        registrations,
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching registrations'
    });
  }
};

// Search registrations by date range (admin only)
export const getRegistrationsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both start and end dates'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        status: 'error',
        message: 'Start date must be before end date'
      });
    }

    const registrations = await Registration.find({
      registrationDate: {
        $gte: start,
        $lte: end
      }
    })
      .populate('eventId', 'name date location') // Add event details
      .populate('studentId', 'username') // Add student username
      .sort({ registrationDate: -1 });

    if (registrations.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'No registrations found in the specified date range',
        data: {
          registrations: []
        }
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        registrations
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error searching registrations'
    });
  }
};

// Render event registration page
export const renderRegisterEvent = async (req, res) => {
  try {
    // Lấy tất cả sự kiện
    const events = await Event.find();
    // Đếm số lượng đăng ký cho từng sự kiện
    const eventsWithCount = await Promise.all(events.map(async (event) => {
      const registeredCount = await Registration.countDocuments({ eventId: event._id });
      return {
        ...event.toObject(),
        registeredCount
      };
    }));
    res.render('registerEvent', { events: eventsWithCount });
  } catch (error) {
    res.status(500).send('Error loading events');
  }
};

// Kiểm tra trạng thái đăng ký của sinh viên cho 1 sự kiện
export const checkRegistrationStatus = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { eventId } = req.query;
    if (!eventId) {
      return res.status(400).json({ status: 'error', message: 'Missing eventId' });
    }
    const registration = await Registration.findOne({ studentId, eventId });
    if (registration) {
      return res.status(200).json({
        status: 'success',
        registered: true,
        registrationId: registration._id
      });
    } else {
      return res.status(200).json({
        status: 'success',
        registered: false
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error checking registration status' });
  }
};

// Hiển thị danh sách đăng ký cho admin (giao diện)
export const renderListRegistrations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const total = await Registration.countDocuments();
    const registrations = await Registration.find()
      .sort({ registrationDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    console.log('admin view registrations:', { registrations, page, pages: Math.ceil(total / limit) });
    res.render('listRegistrations', {
      registrations,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error loading registrations:', error);
    res.status(500).send('Error loading registrations: ' + error.message);
  }
}; 