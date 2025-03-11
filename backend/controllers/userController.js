const UserService = require('../services/userService');


class UserController {
    static async register(req, res) {
        try {
            const { user, token } = await UserService.registerUser(req.body);
            res.status(201).json({ user, token });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await UserService.loginUser(email, password);
            res.json({ user, token });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async restrictUser(req, res) {
        try {
            const { userId } = req.params;
            const { isRestricted } = req.body;
            const user = await UserService.restrictUser(userId, isRestricted);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = UserController;