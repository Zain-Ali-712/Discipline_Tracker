import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        default: 'global_settings'
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'dark'
    },
    allTimePitches: {
        instagram: { type: Number, default: 0 },
        linkedin: { type: Number, default: 0 },
        twitter: { type: Number, default: 0 },
        facebook: { type: Number, default: 0 },
        'google-search': { type: Number, default: 0 }
    }
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
