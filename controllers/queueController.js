const Queue = require('../models/Queue');
const { validateQueueData, validateIdParam } = require('../utils/validator');

// 1. הרשמה לתור
const createQueueEntry = async (req, res, next) => {
  try {
    const errors = validateQueueData(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const { name, phone } = req.body;
    const entry = new Queue({ name, phone });
    await entry.save();

    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

// 2. שליפת הבא בתור
const getNextInQueue = async (req, res, next) => {
  try {
    const next = await Queue.findOne().sort({ createdAt: 1 });
    if (!next) return res.status(404).json({ message: 'No clients in queue' });
    res.json(next);
  } catch (err) {
    next(err);
  }
};

// 3. דחיית לקוח
const deferQueueEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idErrors = validateIdParam([id]);
    if (idErrors.length > 0) return res.status(400).json({ errors: idErrors });

    const oldEntry = await Queue.findById(id);
    if (!oldEntry) return res.status(404).json({ error: 'Queue entry not found' });

    const newEntry = new Queue({
      name: oldEntry.name,
      phone: oldEntry.phone,
      status: oldEntry.status,
      assignedAgentId: oldEntry.assignedAgentId || null,
    });

    await newEntry.save();
    await oldEntry.deleteOne();

    res.json({ message: 'Entry deferred to end of queue', entry: newEntry });
  } catch (err) {
    next(err);
  }
};

// 4. שיוך לקוח לסוכן
const assignAgentToClient = async (req, res, next) => {
  try {
    const { agentId, id } = req.params;
    if (!validateIdParam(id) || !validateIdParam(agentId)) {
      return res.status(400).json({ error: 'Invalid ID(s)' });
    }

    const entry = await Queue.findById(id);
    if (!entry) {
      return res.status(404).json({ error: 'Queue entry not found' });
    }

    entry.assignedAgentId = agentId;
    entry.status = 'assigned';
    await entry.save();

    res.json({ message: 'Client assigned to agent', entry });
  } catch (err) {
    next(err);
  }
};


// 5. שליפת תור לפי סטטוס
const getQueueByStatus = async (req, res, next) => {
  try {
    const { status } = req.query;
    const allowedStatuses = ['pending', 'assigned', 'done'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid or missing status' });
    }

    const list = await Queue.find({ status }).sort({ createdAt: 1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

// 6. שיוך מחדש ללקוח שטופל
const reassignClientToAgent = async (req, res, next) => {
  try {
    const { id, agentId } = req.params;
    const errors = validateIdParam([id, agentId]);
    if (errors.length > 0) return res.status(400).json({ errors });

    const entry = await Queue.findById(id);
    if (!entry) return res.status(404).json({ error: 'Queue entry not found' });

    entry.assignedAgentId = agentId;
    entry.status = 'done';
    await entry.save();

    res.json({ message: 'Client reassigned to agent and marked as done', entry });
  } catch (err) {
    next(err);
  }
};

// עזר – שליפת כל התור
const getAllQueue = async (req, res, next) => {
  try {
    const list = await Queue.find().sort({ createdAt: 1 }).populate('assignedAgentId', 'name');
    res.json(list);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createQueueEntry,
  getNextInQueue,
  deferQueueEntry,
  assignAgentToClient,
  getQueueByStatus,
  reassignClientToAgent,
  getAllQueue,
};
