const express = require('express');
const followerController = require('../controllers/followerController');
const router = express.Router();
const auth = require('../middlewares/auth');

router.post('/follow', auth, followerController.followCampaign);
router.post('/unfollow', auth, followerController.unfollowCampaign);
router.get('/campaign/:campaignId/followers', auth, followerController.getCampaignFollowers);
router.get('/getFollowingCampaigns', auth, followerController.getUserFollowingCampaigns);
router.get('/isFollowing', auth, followerController.isUserFollowingCampaign);

module.exports = router;
