const Pledge = require('../models/pledgeModel');
const Campaign = require('../models/campaignModel');

const createPledge = async (req, res) => {
   try {
      const { campaignId, backerId, amount } = req.body;

      const campaign = await Campaign.findOne({ campaignId });
      if (!campaign) {
         return res.status(404).json({ success: false, message: 'Campaign not found' });
      }

      const newPledge = new Pledge({
         campaignId,
         backerId,
         amount
      });

      const savedPledge = await newPledge.save();
      
      campaign.currentAmount += amount;
      await campaign.save();

      res.status(201).json({ success: true, data: savedPledge });
   } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while creating the pledge', error: error.message });
   }
};

const getAllPledges = async (req, res) => {
   try {
      const pledges = await Pledge.find();
      res.status(200).json({ success: true, data: pledges });
   } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while retrieving pledges', error: error.message });
   }
};

const getPledgesByCampaignId = async (req, res) => {
   try {
      const { campaignId } = req.params;
      const pledges = await Pledge.find({ campaignId });

      if (pledges.length === 0) {
         return res.status(404).json({ success: false, message: 'No pledges found for this campaign' });
      }

      res.status(200).json({ success: true, data: pledges });
   } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while retrieving pledges for the campaign', error: error.message });
   }
};

const getPledgesByBackerId = async (req, res) => {
   try {
      const { backerId } = req.params;
      const pledges = await Pledge.find({ backerId });

      if (pledges.length === 0) {
         return res.status(404).json({ success: false, message: 'No pledges found for this backer' });
      }

      res.status(200).json({ success: true, data: pledges });
   } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while retrieving pledges for the backer', error: error.message });
   }
};

const deletePledge = async (req, res) => {
   try {
      const { pledgeId } = req.params;
      const pledge = await Pledge.findById(pledgeId);

      if (!pledge) {
         return res.status(404).json({ success: false, message: 'Pledge not found' });
      }

      const campaign = await Campaign.findOne({ campaignId: pledge.campaignId });
      if (campaign) {
         campaign.currentAmount -= pledge.amount;
         await campaign.save();
      }

      await Pledge.findByIdAndDelete(pledgeId);

      res.status(200).json({ success: true, message: 'Pledge deleted successfully' });
   } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while deleting the pledge', error: error.message });
   }
};

module.exports = { createPledge, getAllPledges, getPledgesByCampaignId, getPledgesByBackerId, deletePledge };
