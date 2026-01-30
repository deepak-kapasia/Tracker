const mongoose = require('mongoose');

const DailyLogSchema = new mongoose.Schema({
    date: String,
    log: String,
    sentiment: String,
}, { _id: false }); // subdocument, keeping structure simple

const SubjectSchema = new mongoose.Schema({
    id: Number, // Keeping existing ID structure
    name: String,
    attendance: Number,
    totalClasses: Number,
}, { _id: false });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subjects: [SubjectSchema],
    dailylogs: [DailyLogSchema]
});

module.exports = mongoose.model('User', UserSchema);
