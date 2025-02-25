const checkPregnancyProfile = async (req, res) => {
    try {
        // Get user ID from authenticated request
        const userId = req.user.id;

        // Query the database to check if profile exists
        const profile = await PregnancyProfile.findOne({ 
            where: { userId: userId }
        });

        // Return response indicating if profile exists
        return res.status(200).json({
            hasProfile: !!profile,
            profile: profile
        });

    } catch (error) {
        console.error('Error checking pregnancy profile:', error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi kiểm tra thông tin thai kỳ',
            error: error.message
        });
    }
};

module.exports = {
    checkPregnancyProfile
}; 