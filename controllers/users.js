import Transaction from '../models/Transaction.js';
import User from '../models/user.js';
import CustomError from '../utils/error.js';

export const me = async (req,res) => {
    const user = req.session.user;
    if (!user) {
        throw new CustomError('User not found', 404);
    }

    const existantUser = await User.findById(user);

    res.status(200).json({
        success: true,
        user: {
            id: existantUser.id,
            name: existantUser.name,
            email: existantUser.email,
            role: existantUser.role,
            balance: existantUser.balance,
        },
    });
}

export const deposit = async (req,res) => {
    const {id , amount} = req.body;
    if (!id || !amount) {
        throw new CustomError('Please provide all fields', 400);
    }
    const user = req.session.user;
    if (!user) {
        throw new CustomError('User not found', 404);
    }

    const existantUser = await User.findById(user);
    if (existantUser.role !== 'admin') {
        throw new CustomError('You are not authorized to perform this action', 403);
    }
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
        throw new CustomError('User not found', 404);
    }
    userToUpdate.balance += amount;
    await userToUpdate.save();
    res.status(200).json({
        success: true,
        message: 'Deposit successful',
        user: {
            id: userToUpdate.id,
            name: userToUpdate.name,
            email: userToUpdate.email,
            role: userToUpdate.role,
            balance: userToUpdate.balance,
        },
    });

}

export const transfer = async (req, res) => {
    const { id, amount, transactionType } = req.body;

    // Validate input
    if (!id || !amount || !transactionType) {
        throw new CustomError('Please provide all fields', 400);
    }

    // Check if user is logged in
    const currentUserId = req.session?.user;
    if (!currentUserId) {
        throw new CustomError('User not found', 404);
    }

    const sender = await User.findById(currentUserId);
    const receiver = await User.findById(id);

    if (!sender || !receiver) {
        throw new CustomError('User not found', 404);
    }

    if (sender.id === receiver.id) {
        throw new CustomError('You cannot transfer money to yourself', 400);
    }

    if (!['credit', 'debit'].includes(transactionType)) {
        throw new CustomError('Transaction type must be credit or debit', 400);
    }

    if (transactionType === 'credit' && sender.balance < amount) {
        throw new CustomError('You do not have enough balance', 400);
    }

    // Generate Unique Transaction ID
    const randomNumber = Math.floor(Math.random() * 100000);
    const transactionId = `EG-${sender.id}-${receiver.id}-${Date.now()}-${randomNumber}`;

    // Balance update
    if (transactionType === 'credit') {
        sender.balance -= amount;
        receiver.balance += amount;
    } else {
        sender.balance += amount;
        receiver.balance -= amount;
    }

    await sender.save();
    await receiver.save();

    const transaction = new Transaction({
        from: sender.id,
        to: receiver.id,
        amount,
        status: 'completed',
        transactionType,
        transactionId,
    });

    await transaction.save();

    res.status(200).json({
        success: true,
        message: 'Transfer successful',
        transactionId,
        user: {
            id: receiver.id,
            name: receiver.name,
            email: receiver.email,
            role: receiver.role,
            balance: receiver.balance,
        },
    });
};

export const transactions = async (req,res) => {
    const user = req.session.user;
    if (!user) {
        throw new CustomError('User not found', 404);
    }

    const existantUser = await User.findById(user);
    if (!existantUser) {
        throw new CustomError('User not found', 404);
    }
    const transactions = await Transaction.find({$or: [{from: existantUser.id}, {to: existantUser.id}]}).sort({createdAt: -1});

    if (!transactions) {
        throw new CustomError('No transactions found', 404);
    }

    res.status(200).json({
        success: true,
        transactions,
    });
}

export const balance = async (req,res) => {
    const user = req.session.user;
    if (!user) {
        throw new CustomError('User not found', 404);
    }

    const existantUser = await User.findById(user);
    if (!existantUser) {
        throw new CustomError('User not found', 404);
    }
    res.status(200).json({
        success: true,
        balance: existantUser.balance,
    });
}