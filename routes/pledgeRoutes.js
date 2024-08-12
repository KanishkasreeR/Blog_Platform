const express = require('express');
const pledgeController = require('../controllers/pledgeController');
const auth = require('../middlewares/auth')

const router = express.Router();

router.post('/createPledge', auth,pledgeController.createPledge);
router.get('/getAllPledges',auth, pledgeController.getAllPledges);
router.get('/getPledgesByCampaignId/:campaignId',pledgeController.getPledgesByCampaignId);
router.get('/getPledgesByBackerId/:backerId',pledgeController.getPledgesByBackerId);
router.delete('/deletePledge/:pledgeId',pledgeController.deletePledge);

module.exports = router;