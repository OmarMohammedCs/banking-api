import User from "../models/user.js"
import CustomError from "../utils/error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import session from "express-session";

export const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new CustomError('Please provide email and password', 400);
    }
    const user = await User.findOne({email}).select('+password');
    if (!user) {
        throw new CustomError('Invalid credentials', 401);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new CustomError('Invalid credentials', 401);
    }
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

    req.session.user = user.id; // Store user in session
    req.session.save((err) => {
        if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });

    res.status(200).json({
        success: true,
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            balance: user.balance,
        },
    });
}

export const reqister = async (req, res) => {
    const {userName, email, password} = req.body;
    if (!userName || !email || !password) {
        throw new CustomError('Please provide all fields', 400);
    }
    const userExists = await User.findOne({email}).select('+password');
    if (userExists) {
        throw new CustomError('User already exists', 400);
    }
    const userNameExists = await User.findOne({userName});
    if (userNameExists) {
        throw new CustomError('User name already exists', 400);
    }
    const user = await User.create({
        userName,
        email,
        password,
    });
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    req.session.user = user.id; // Store user in session
    req.session.save((err) => {
        if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
    res.status(201).json({
        success: true,
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            balance: user.balance,
        },
    });
}

export const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ message: 'Logged out successfully' });
    });

}
