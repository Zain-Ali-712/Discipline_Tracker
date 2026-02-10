import mongoose from 'mongoose';

const DailyRecordSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        unique: true,
    },
    dayOfWeek: String,
    progress: Number,
    tasks: [{
        id: String,
        name: String,
        completed: Boolean,
        weight: Number,
        description: String
    }],
    isStreakDay: Boolean,
    isSaved: Boolean,
    outreachPitches: {
        instagram: Number,
        linkedin: Number,
        twitter: Number,
        facebook: Number,
        'google-search': Number
    },
    projectHours: Number,
    advanceProjectHours: Number,
    customProjectHours: {
        type: Map,
        of: Number
    }
});

export default mongoose.models.DailyRecord || mongoose.model('DailyRecord', DailyRecordSchema);
