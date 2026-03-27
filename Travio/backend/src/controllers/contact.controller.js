const contactService = require('../services/contact.service');
const { successResponse } = require('../utils/response.util');

const submitContactMessage = async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name?.trim(),
      email: req.body.email?.trim(),
      phone: req.body.phone?.trim(),
      company: req.body.company?.trim(),
      message: req.body.message?.trim(),
    };

    const saved = await contactService.createMessage(payload);
    return res.status(201).json(successResponse('Message sent successfully', saved));
  } catch (err) {
    next(err);
  }
};

const getAllContactMessagesAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await contactService.getMessages({ page, limit });

    return res.status(200).json(
      successResponse('Messages retrieved successfully', result.messages, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      })
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitContactMessage,
  getAllContactMessagesAdmin,
};
