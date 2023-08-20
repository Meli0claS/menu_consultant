const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const User = require('../models/UserModel');

router.get('/all_users', verifyToken, async (req, res) => {
    try {
        const users = await User.find().sort({createdAt: -1});
        res.json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.put('/:id', verifyToken, async (req, res) => {
	const { username, email, fullname } = req.body
	try {
		let updatedUser = {
			username,
            email,
			fullname
		}

		const userUpdateCondition = { _id: req.params.id }

		updatedUser = await User.findOneAndUpdate(
			userUpdateCondition,
			updatedUser,
			{ new: true }
		)

		if (!updatedUser)
			return res.status(401).json({
				success: false,
				message: 'Không tìm thấy người dùng'
			})

		res.json({
			success: true,
			message: 'Cập nhật thành công',
			user: updatedUser
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

module.exports = router