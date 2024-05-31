const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const User = require('../Model/user-model');
const { authenticate } = require('../Helper/token');




let registration = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({ username, password: hashedPassword, email });
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

let login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error('Invalid login credentials.');
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};


const generateResetToken = () => {
  return uuidv4();
};


const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n`
          + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
          + `http://${process.env.HOST}/reset-password/${resetToken}\n\n`
          + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Failed to send password reset email');
  }
};

// Route to request password reset
let passreset =  async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Generate reset token and set expiration time
    const resetToken = generateResetToken();
    user.reset_password_token = resetToken;
    user.reset_password_expires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);

    res.send({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Route to reset password
let postpassword= async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find the user by reset token
    const user = await User.findOne({ where: { reset_password_token: token } });
    if (!user) {
      return res.status(404).send({ error: 'Invalid or expired token' });
    }

    // Check if the token has expired
    if (user.reset_password_expires < Date.now()) {
      return res.status(400).send({ error: 'Password reset token has expired' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear the reset token
    user.password = hashedPassword;
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    res.send({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Get user profile
let profile =  async (req, res) => {
  res.send(req.user);
};

module.exports = {registration,login,passreset,profile,postpassword};
