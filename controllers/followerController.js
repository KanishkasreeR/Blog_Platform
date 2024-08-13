const Follower = require('../models/followerModel');

const followCampaign = async (req, res) => {
    try {
        const userId = req.user.toString(); 
        const { campaignId } = req.body;

        let existingFollower = await Follower.findOne({ userId });

        if (existingFollower) {
            if (existingFollower.campaignIds.includes(campaignId)) {
                return res.status(400).json({ success: false, message: 'You are already following this campaign' });
            } else {
                existingFollower.campaignIds.push(campaignId);
                await existingFollower.save();
                return res.status(200).json({ success: true, data: existingFollower });
            }
        }

        const newFollower = new Follower({ userId, campaignIds: [campaignId] });
        await newFollower.save();

        res.status(201).json({ success: true, data: newFollower });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while following the campaign' });
    }
};

const unfollowCampaign = async (req, res) => {
    try {
        const userId = req.user.toString();
        const { campaignId } = req.body;

        if (!campaignId) {
            return res.status(400).json({ success: false, message: 'Campaign ID is required' });
        }

        const existingFollower = await Follower.findOne({ userId });

        if (!existingFollower) {
            return res.status(404).json({ success: false, message: 'You are not following any campaigns' });
        }

        if (!existingFollower.campaignIds.includes(campaignId)) {
            return res.status(404).json({ success: false, message: 'You are not following this campaign' });
        }

        existingFollower.campaignIds = existingFollower.campaignIds.filter(id => id !== campaignId);

        if (existingFollower.campaignIds.length === 0) {
            await Follower.deleteOne({ userId });
        } else {
            await existingFollower.save();
        }

        res.status(200).json({ success: true, message: 'Unfollowed the campaign' });
    } catch (error) {
        console.error('Error in unfollowCampaign:', error);
        res.status(500).json({ success: false, message: 'An error occurred while unfollowing the campaign' });
    }
};


const getCampaignFollowers = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const followers = await Follower.find({ campaignIds: campaignId });

        res.status(200).json({ success: true, data: followers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while retrieving followers' });
    }
};

const getUserFollowingCampaigns = async (req, res) => {
    try {
        const userId  = req.user.toString();
        const following = await Follower.findOne({ userId });

        res.status(200).json({ success: true, data: following });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while retrieving following campaigns' });
    }
};

const isUserFollowingCampaign = async (req, res) => {
    try {
        const  userId  = req.user.toString();
        const { campaignId } = req.params;

        const follower = await Follower.findOne( {userId} );
        console.log(follower);
        const isFollowing = follower ? follower.campaignIds.includes(campaignId) : false;
        console.log(isFollowing);

        res.status(200).json({ success: true, data: { isFollowing } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while checking if the user follows the campaign' });
    }
};

module.exports = {followCampaign,unfollowCampaign,getCampaignFollowers,getUserFollowingCampaigns,isUserFollowingCampaign};
