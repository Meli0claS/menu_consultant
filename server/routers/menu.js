const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const Menu = require('../models/MenuModel');
const MenuRating = require('../models/MenuRatingModel');

router.get('/get_my_menus', verifyToken, async (req, res) => {
    try {
        const menus = await Menu.find({ user: req.userId }).populate('user', ['username']).sort({ createdAt: -1 });
        res.json({ success: true, menus });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.get('/get_all_menus', verifyToken, async (req, res) => {
    try {
        const menus = await Menu.find({ isPublic: true }).populate('user', ['username']).sort({ createdAt: -1 });
        res.json({ success: true, menus });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.get('/get_tags', verifyToken, async (req, res) => {
    try {
        const tags = await Menu.distinct('tags');
        res.json({ success: true, tags });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.get('/user/:id', verifyToken, async (req, res) => {
    try {
        const menus = await Menu.find({ user: req.params.id }).sort({ createdAt: -1 });
        res.json({ success: true, menus });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.post('/add', verifyToken, async (req, res) => {
    const { items, selectedTags, isPublic } = req.body;

    try {
        const newMenu = new Menu({
            items,
            tags: selectedTags,
            user: req.userId,
            isPublic
        });

        await newMenu.save();

        res.json({ success: true, message: 'Thực đơn mới đã được tạo thành công', menu: newMenu });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

router.put('/:id', verifyToken, async (req, res) => {
    const { items, selectedTags, isPublic } = req.body
    try {
        let updatedMenu = {
            items,
            tags: selectedTags,
            isPublic
        }

        const menuUpdateCondition = { _id: req.params.id }

        updatedMenu = await Menu.findOneAndUpdate(
            menuUpdateCondition,
            updatedMenu,
            { new: true }
        )

        if (!updatedMenu)
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy thực đơn'
            })

        res.json({
            success: true,
            message: 'Cập nhật thành công',
            menu: updatedMenu
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const menuDeleteCondition = { _id: req.params.id, user: req.userId }
        const deletedMenu = await Menu.findOneAndDelete(menuDeleteCondition)

        if (!deletedMenu)
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy thực đơn'
            })

        res.json({ success: true, menu: deletedMenu })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

router.post('/rating_menu', verifyToken, async (req, res) => {
    const { menuId, rating } = req.body
    try {
        const isUserRated = await MenuRating.findOne({ menu: menuId, user: req.userId })
        if (isUserRated == undefined) {
            const newMenuRating = new MenuRating({
                user: req.userId,
                menu: menuId,
                rating
            });

            await newMenuRating.save();

            const menuRatings = await MenuRating.find({ menu: menuId });
            const count = await MenuRating.find({ menu: menuId }).count();
            var avgRating = 0;

            menuRatings.map((menu) => avgRating += parseInt(menu.rating))
            avgRating = avgRating / count;

            let updatedMenu = {
                rating: avgRating.toFixed(),
                ratedCount: count,
            }

            const menuUpdateCondition = { _id: menuId }

            updatedMenu = await Menu.findOneAndUpdate(
                menuUpdateCondition,
                updatedMenu,
                { new: true }
            )

            if (!updatedMenu)
                return res.status(401).json({
                    success: false,
                    message: 'Không tìm thấy thực đơn'
                })

            res.json({
                success: true,
                message: 'Cập nhật thành công',
                menu: updatedMenu
            })

        } else {
            let updatedMenuRating = {
                rating
            }

            const menuRatingUpdateCondition = { menu: menuId, user: req.userId }

            updatedMenuRating = await MenuRating.findOneAndUpdate(
                menuRatingUpdateCondition,
                updatedMenuRating,
                { new: true }
            )

            const menuRatings = await MenuRating.find({ menu: menuId });
            const count = await MenuRating.find({ menu: menuId }).count();
            var avgRating = 0;

            menuRatings.map((menu) => avgRating += parseInt(menu.rating))
            avgRating = avgRating / count;

            let updatedMenu = {
                rating: avgRating.toFixed()
            }

            const menuUpdateCondition = { _id: menuId }

            updatedMenu = await Menu.findOneAndUpdate(
                menuUpdateCondition,
                updatedMenu,
                { new: true }
            )

            if (!updatedMenu)
                return res.status(401).json({
                    success: false,
                    message: 'Không tìm thấy thực đơn'
                })

            res.json({
                success: true,
                message: 'Cập nhật thành công',
                menu: updatedMenu
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

router.post('/search', verifyToken, async (req, res) => {
    const { days, selectedTags } = req.body;

    try {
        const menus = await Menu.find({ tags: { $all: selectedTags }, isPublic: 'true' });

        const breakfastTag = 'buổi sáng';
        const lunchTag = 'buổi trưa';
        const dinnerTag = 'buổi tối';
        const numberOfDays = days;

        const breakfastMenus = menus.filter((menu) => menu.tags.includes(breakfastTag));
        const lunchMenus = menus.filter((menu) => menu.tags.includes(lunchTag));
        const dinnerMenus = menus.filter((menu) => menu.tags.includes(dinnerTag));

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        };

        shuffleArray(breakfastMenus);
        shuffleArray(lunchMenus);
        shuffleArray(dinnerMenus);

        const combinedMenus = [];
        for (let i = 0; i < numberOfDays; i++) {
            const dayMenus = [
                breakfastMenus[i % breakfastMenus.length],
                lunchMenus[i % lunchMenus.length],
                dinnerMenus[i % dinnerMenus.length]
            ];
            combinedMenus.push(dayMenus);
        }

        res.json({ success: true, message: 'Đây là thực đơn mà tôi tư vấn cho bạn! Mong bạn hài lòng', menus: combinedMenus });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

module.exports = router