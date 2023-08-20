const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const verifyToken = require('../middleware/auth');
const sendEmail = require('../utils/mailer')

const User = require('../models/UserModel')

router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(400).json({ success: false, message: 'Không tìm thấy người dùng' });
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.post('/register', async (req, res) => {
    const { fullname, email, username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Thiếu tên đăng nhập hoặc mật khẩu' });
    }

    try {
        const userUsername = await User.findOne({ username });
        const userEmail = await User.findOne({ email });

        if (userUsername)
            return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại' });

        else if (userEmail)
            return res.status(400).json({ success: false, message: 'Email đã tồn tại' });

        const hashedPassword = await argon2.hash(password);
        const newUser = new User({
            fullname,
            email,
            username,
            password: hashedPassword,
        });
        await newUser.save();

        const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET);

        res.json({ success: true, message: 'User created successfully', accessToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Thiếu tên đăng nhập hoặc mật khẩu' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user)
            return res.status(400).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác' });

        const passwordValid = await argon2.verify(user.password, password);
        if (!passwordValid)
            return res.status(400).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác' });

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);
        res.json({ success: true, message: 'User logged in successfully', accessToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

})

router.post('/verify_email', async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ success: false, message: 'Bạn chưa nhập Email' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ success: false, message: 'Email không tồn tại' });
        const otp = otpGenerator.generate(10, { upperCaseAlphabets: true, specialChars: false });
        const otp_created_at = Date.now();
        sendEmail(email, 'Mã OTP khôi phục mật khẩu', otp);

        let updatedUser = { otp, otp_created_at };

        const userUpdateCondition = { email: email };

        updatedUser = await User.findOneAndUpdate(userUpdateCondition, updatedUser, { new: true });

        if (updatedUser)
            res.json({ success: true, message: 'Email sent' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

})

router.post('/change_password', async (req, res) => {
    const { otp, password } = req.body

    try {
        const user = await User.findOne({ otp });
        if (!user)
            return res.status(400).json({ success: false, message: 'Mã OTP không chính xác' });
        var now = Date.now();
        var otp_created_at = user.otp_created_at;
        var diff = Math.abs(now - otp_created_at);
        if (diff > 300000) {
            const otp = otpGenerator.generate(10, { upperCaseAlphabets: true, specialChars: false });
            const otp_created_at = Date.now();
            sendEmail(user.email, 'Mã OTP khôi phục mật khẩu', otp);

            let updatedUser = { otp, otp_created_at };

            const userUpdateCondition = { email: user.email };

            updatedUser = await User.findOneAndUpdate(userUpdateCondition, updatedUser, { new: true });

            if (updatedUser)
                return res.status(400).json({ success: false, message: 'Mã OTP này đã hết hạn sử dụng, một mã OTP mới đã được gửi đến email của bạn' });
        }
        const hashedPassword = await argon2.hash(password);
        let updatedUser = { password: hashedPassword };

        const userUpdateCondition = { otp: otp };

        updatedUser = await User.findOneAndUpdate(userUpdateCondition, updatedUser, { new: true });

        if (!updatedUser)
            return res.status(401).json({ success: false, message: 'Mã OTP không chính xác' });
        res.json({ success: true, message: 'Mật khẩu thay đổi thành công' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

})

module.exports = router
