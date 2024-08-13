const express = require('express');
const campaignController = require('../controllers/campaignController');
const auth = require('../middlewares/auth')

const router = express.Router();

router.post('/createCampaign', auth,campaignController.createCampaign);
router.post('/addComment/:campaignId',auth,campaignController.addComment);
router.post('/addPledge/:campaignId',auth,campaignController.addPledgeToCampaign);
router.put('/updateCampaign/:campaignId', auth,campaignController.updateCampaign);
router.delete('/deleteCampaign/:campaignId', auth,campaignController.deleteCampaign);
router.put('/updateComment/:campaignId/:commentId', auth, campaignController.editComment);
router.delete('/deleteComment/:campaignId/:commentId', auth, campaignController.deleteComment);
router.get('/getAllCampaigns', campaignController.getAllCampaigns);
router.get('/getUserCampaign',auth, campaignController.getCampaignsByUserId);
router.get('/getCampaignBycampaign/:campaignId', campaignController.getCampaignsByCampaignId);

module.exports = router;
