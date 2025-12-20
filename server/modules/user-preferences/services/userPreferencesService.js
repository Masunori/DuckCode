import db from '../../../models/index.js';
import { Op } from 'sequelize';

const userPreferencesService = {
    async setUserPreferences(user, preferences) {
        if(!user || !preferences) {
            throw new Error('User and preferences are required');
        }
        user.userPreferences = preferences;
        await user.save();
        return {
            message: 'User preferences updated successfully',
        }
    }
};

export default userPreferencesService;
