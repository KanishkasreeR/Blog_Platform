const Follower = require('../models/followerModel');

// Follow a campaign
// const followCampaign = async (req, res) => {
//     try {
//         const  userId  = req.user;
//         const { campaignId } = req.body; 
//         const user = userId.toString();

//         // Check if the user already follows this campaign
//         const existingFollower = await Follower.findOne({user});

//         if (existingFollower) {
//             if (existingFollower.campaignIds.includes(campaignId)) {
//                 return res.status(400).json({ success: false, message: 'You are already following this campaign' });
//             } else {
//                 existingFollower.campaignIds.push(campaignId);
//                 await existingFollower.save();
//                 return res.status(200).json({ success: true, data: existingFollower });
//             }
//         }

//         // If the user is not following any campaigns yet
//         const newFollower = new Follower({ userId, campaignIds: [campaignId] });
//         await newFollower.save();

//         res.status(201).json({ success: true, data: newFollower });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'An error occurred while following the campaign' });
//     }
// };

const followCampaign = async (req, res) => {
    try {
        const userId = req.user.toString(); // Ensure userId is a string
        const { campaignId } = req.body;

        // Check if the user already follows this campaign
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

        // If the user is not following any campaigns yet
        const newFollower = new Follower({ userId, campaignIds: [campaignId] });
        await newFollower.save();

        res.status(201).json({ success: true, data: newFollower });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while following the campaign' });
    }
};


// Unfollow a campaign
// const unfollowCampaign = async (req, res) => {
//     try {
//         const userId = req.user.toString();
//         const { campaignId } = req.body.toString();
//         const existingFollower = await Follower.findOne({ userId });

//         console.log(existingFollower.campaignIds.includes(campaignId));
//         if (!existingFollower || !existingFollower.campaignIds.includes(campaignId)) {
//             return res.status(404).json({ success: false, message: 'You are not following this campaign' });
//         }
//         existingFollower.campaignIds = existingFollower.campaignIds.filter(id => id !== campaignId);

//         if (existingFollower.campaignIds.length === 0) {
//             await Follower.deleteOne({ userId });
//         } else {
//             await existingFollower.save();
//         }

//         res.status(200).json({ success: true, message: 'Unfollowed the campaign' });
//     } catch (error) {
//         console.error('Error in unfollowCampaign:', error);
//         res.status(500).json({ success: false, message: 'An error occurred while unfollowing the campaign' });
//     }
// };

const unfollowCampaign = async (req, res) => {
    try {
        const userId = req.user.toString();
        const { campaignId } = req.body;

        if (!campaignId) {
            return res.status(400).json({ success: false, message: 'Campaign ID is required' });
        }

        // Find the existing follower document
        const existingFollower = await Follower.findOne({ userId });

        if (!existingFollower) {
            return res.status(404).json({ success: false, message: 'You are not following any campaigns' });
        }

        // Check if the campaign ID exists in the follower's campaign list
        if (!existingFollower.campaignIds.includes(campaignId)) {
            return res.status(404).json({ success: false, message: 'You are not following this campaign' });
        }

        // Remove the campaign ID from the list
        existingFollower.campaignIds = existingFollower.campaignIds.filter(id => id !== campaignId);

        // If no campaigns are left, delete the follower document
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


// Get all followers of a campaign
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

// Get all campaigns a user is following
const getUserFollowingCampaigns = async (req, res) => {
    try {
        const userId  = req.user.toString();
        const following = await Follower.findOne({ userId });
        // const campaignIds = following.campaignIds;
        // console.log(campaignIds)

        res.status(200).json({ success: true, data: following });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while retrieving following campaigns' });
    }
};

// Check if the user follows a specific campaign
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

module.exports = {
    followCampaign,
    unfollowCampaign,
    getCampaignFollowers,
    getUserFollowingCampaigns,
    isUserFollowingCampaign
};
