import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    },
    progress: Number,
    estimatedHours: Number,
    hoursLog: [{
        date: String,
        hours: Number,
        notes: String
    }],
    startDate: String,
    totalHours: Number,
    completed: Boolean
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
