import userPreferencesService from "../services/userPreferencesService.js";

const userPreferencesController = {
    async setUserPreferences(req, res) {
        const user = req.user;
        const { preferences } = req.body;
        try {
            const result = await userPreferencesService.setUserPreferences(user, preferences);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(422).json({ error: error.message });
        }
    }
};

export default userPreferencesController;
