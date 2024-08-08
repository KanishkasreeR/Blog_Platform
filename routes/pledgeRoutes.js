const express = require('express');
const pledgeController = require('../controllers/pledgeController');
const auth = require('../middlewares/auth')

const router = express.Router();

router.post('/createPledge', auth,pledgeController.createPledge);
router.get('/getAllPledges',auth, pledgeController.getAllPledges);
router.get('/getPledgesByCampaignId/:campaignId', auth,pledgeController.getPledgesByCampaignId);
router.get('/getPledgesByBackerId/:backerId', auth,pledgeController.getPledgesByBackerId);
router.delete('/deletePledge/:pledgeId', auth,pledgeController.deletePledge);

module.exports = router;