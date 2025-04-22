import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    from : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount : {
        type: Number,
        required: true
    },
    status : {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    transactionType : {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    transactionId : {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true });

const Transaction = mongoose.model('transaction',transactionSchema);

export default Transaction