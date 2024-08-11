const express = require('express');
const campaignController = require('../controllers/campaignController');
const auth = require('../middlewares/auth')

const router = express.Router();

router.post('/createCampaign', auth,campaignController.createCampaign);
router.post('/addComment/:campaignId', auth,campaignController.addComment);
router.post('/updateCampaign/:campaignId', auth,campaignController.updateCampaign);
router.post('/deleteCampaign/:campaignId', auth,campaignController.deleteCampaign);
router.get('/getAllCampaigns', campaignController.getAllCampaigns);
router.get('/getCampaignByuser/:userId',auth, campaignController.getCampaignsByUserId);
router.get('/getCampaignByuser/:campaignId', campaignController.getCampaignsByUserId);

module.exports = router;
