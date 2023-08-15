const bcrypt = require('bcrypt');
const User = require('../models/user');

const UserController = {
    async insert(req, res) {
        try {
            const { user_name, user_email, user_password } = req.body;
            
            const hashedPassword = await bcrypt.hash(user_password, 10);

            const user = await User.create({
                user_name,
                user_email,
                user_password: hashedPassword,
            });

            res.json({ success: true, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error registering user' });
        }
    },

    async checkEmail(req, res) {
        try {
            const user_email = req.params.email;
            const existingUser = await User.findOne({
                where: {
                    user_email,
                },
            });

            if (existingUser) {
                res.json({ exists: true });
            } else {
                res.json({ exists: false });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error checking email' });
        }
    },

    async login(req, res) {
        try {
            const { user_email, user_password } = req.body;

            const user = await User.findOne({
                where: {
                    user_email,
                },
            });

            if (!user) {
                return res.status(400).json({ success: false, error: 'User not found' });
            }

            const validPassword = await bcrypt.compare(user_password, user.user_password);

            if (!validPassword) {
                return res.status(400).json({ success: false, error: 'Invalid password' });
            }

            res.json({ success: true, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error logging in' });
        }
    },

    async update(req, res) {
        try {
            const { user_id, user_name, user_email, user_password } = req.body;

            // user_id로 사용자 찾기
            const user = await User.findByPk(user_id);

            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            // 변경된 정보 업데이트
            user.user_name = user_name;
            user.user_email = user_email;
            user.user_password = await bcrypt.hash(user_password, 10);
            await user.save();

            res.json({ success: true, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error updating user' });
        }
    },

    async delete(req, res) {
        const user_id = req.params.id;
        try {
            // user_id로 사용자 찾기
            const user = await User.findByPk(user_id);

            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            await user.destroy();
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error deleting user' });
        }
    },

};

module.exports = UserController;
