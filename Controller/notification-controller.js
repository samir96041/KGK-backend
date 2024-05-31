const express = require('express');
const Notification = require('../Model/notification-model');




let getnotify = async (req, res) => {
  const notifications = await Notification.findAll({ where: { user_id: req.user.id } });
  res.send(notifications);
};

let postnotify = async (req, res) => {
  const { ids } = req.body;
  try {
    await Notification.update({ is_read: true }, { where: { id: ids, user_id: req.user.id } });
    res.send({ message: 'Notifications marked as read' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = {getnotify,postnotify};
