const mongoose = require('mongoose');

// DailyLog Structure
// Frontend sends: { id: String, date: String, logs: [String], createdAt: String }
const DailyLogSchema = new mongoose.Schema({
    id: String,
    date: String,
    logs: [String], // Array of strings for 24 hours
    createdAt: String
}, { _id: false });

// Subject Entry Structure
// Frontend sends: { id: String, status: String, date: String, ... }
// We'll use strict: false for entries to allow flexibility as we don't fully see Entry content
const SubjectEntrySchema = new mongoose.Schema({}, { _id: false, strict: false });

// Subject Structure
// Frontend sends: { id: String, name: String, currentAttendance: Number, totalClasses: Number, entries: [Object], createdAt: String }
const SubjectSchema = new mongoose.Schema({
    id: String,
    name: String,
    // These seem to be used in frontend, though derived from entries? 
    // Code in SubjectTracker sends "...subjectData" which typically includes just name/goal?
    // Let's make it flexible to store whatever the frontend sends.
    currentAttendance: Number,
    totalClasses: Number,
    goal: Number, // often used in trackers
    entries: [SubjectEntrySchema],
    createdAt: String
}, { _id: false, strict: false }); // strict: false allows saving other fields passed by frontend

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subjects: [SubjectSchema],
    dailylogs: [DailyLogSchema]
});

module.exports = mongoose.model('User', UserSchema);
