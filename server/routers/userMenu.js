const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const UserMenu = require('../models/UserMenuModel');

router.get('/get_my_menus', verifyToken, async (req, res) => {
    try {
        const userMenus = await UserMenu.find({ user: req.userId }).populate('user', ['username']).sort({createdAt: -1});
        res.json({ success: true, menuLists: userMenus });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const userMenu = await UserMenu.find({ _id: req.params.id }).populate('menus');
		var userMenuList = [];
		var menus = userMenu[0].menus;
		for (let i=0; i<menus.length; i+=3) {
			const dayMenus = [
				menus[i],
				menus[i+1],
				menus[i+2],
			];
			userMenuList.push(dayMenus)
		}
        res.json({ success: true, menuList: userMenuList});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})


router.post('/add', verifyToken, async (req, res) => {
    const { title, menus } = req.body;

    try {
        const newUserMenu = new UserMenu({
            title,
            menus,
            user: req.userId
        });

        await newUserMenu.save();

        res.json({ success: true, message: 'Thực đơn này đã được thêm vào danh sách của bạn', userMenu: newUserMenu });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.put('/:id', verifyToken, async (req, res) => {
	const { title, inUse } = req.body
	try {
		let updatedMenuList = {
			title,
			inUse
		}
		console.log(inUse);
		const menuListUpdateCondition = { _id: req.params.id, user: req.userId }

		updatedMenuList = await UserMenu.findOneAndUpdate(
			menuListUpdateCondition,
			updatedMenuList,
			{ new: true }
		)

		if (!updatedMenuList)
			return res.status(401).json({
				success: false,
				message: 'Không tìm thấy danh sách thực đơn'
			})

		res.json({
			success: true,
			message: 'Cập nhật thành công',
			menuList: updatedMenuList
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.delete('/:id', verifyToken, async (req, res) => {
	try {
		const menuListDeleteCondition = { _id: req.params.id, user: req.userId }
		const deletedMenuList = await UserMenu.findOneAndDelete(menuListDeleteCondition)

		if (!deletedMenuList)
			return res.status(401).json({
				success: false,
				message: 'Không tìm thấy danh sách thực đơn'
			})

		res.json({ success: true, menuList: deletedMenuList })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

module.exports = router