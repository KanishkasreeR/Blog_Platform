const Campaign = require('../models/campaignModel');

const { v4: uuidv4 } = require('uuid');

// const createCampaign = async (req, res) => {
//   try {
//     const {
//       cause,
//       goalAmount,
//       title,
//       aim,
//       description,
//       image,
//       startDate,
//       endDate
//     } = req.body;

//     const userId = req.user; 
//     const campaignId = uuidv4(); 

//     const newCampaign = new Campaign({
//       userId,
//       campaignId,
//       cause,
//       goalAmount,
//       currentAmount: 0,
//       title,
//       aim,
//       description,
//       image,
//       startDate,
//       endDate
//     });

//     const savedCampaign = await newCampaign.save();

//     res.status(201).json({
//       success: true,
//       data: savedCampaign
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while creating the campaign',
//       error: error.message
//     });
//   }
// };

const createCampaign = async (req, res) => {
   try {
     const {
       cause,
       goalAmount,
       title,
       aim,
       description,
       image,
       video,       // New field for video
       startDate,
       endDate
     } = req.body;
 
     const userId = req.user; 
     const campaignId = uuidv4(); 
 
     const newCampaign = new Campaign({
       userId,
       campaignId,
       cause,
       goalAmount,
       currentAmount: 0, // Initialize the current amount to 0
       title,
       aim,
       description,
       image,
       video,           // Include the video field
       startDate,
       endDate
     });
 
     const savedCampaign = await newCampaign.save();
 
     res.status(201).json({
       success: true,
       data: savedCampaign
     });
   } catch (error) {
     console.error(error);
     res.status(500).json({
       success: false,
       message: 'An error occurred while creating the campaign',
       error: error.message
     });
   }
 };


const addComment = async (req, res) => {
  try {
     const { campaignId } = req.params; 
     const { userId, text } = req.body; 

     const campaign = await Campaign.findOne({ campaignId });
     
     if (!campaign) {
        return res.status(404).json({
           success: false,
           message: 'Campaign not found'
        });
     }

     campaign.comments.push({
        userId,
        text,
        createdAt: new Date() 
     });

     const updatedCampaign = await campaign.save();

     res.status(200).json({
        success: true,
        data: updatedCampaign
     });
  } catch (error) {
     console.error(error);
     res.status(500).json({
        success: false,
        message: 'An error occurred while adding the comment',
        error: error.message
     });
  }
};

const updateCampaign = async (req, res) => {
  try {
     const { campaignId } = req.params; 
     const updates = req.body; 

     const updatedCampaign = await Campaign.findOneAndUpdate(
        { campaignId },
        { $set: updates },
        { new: true, runValidators: true }
     );

     if (!updatedCampaign) {
        return res.status(404).json({
           success: false,
           message: 'Campaign not found'
        });
     }

     res.status(200).json({
        success: true,
        data: updatedCampaign
     });
  } catch (error) {
     console.error(error);
     res.status(500).json({
        success: false,
        message: 'An error occurred while updating the campaign',
        error: error.message
     });
  }
};

const deleteCampaign = async (req, res) => {
  try {
     const { campaignId } = req.params;

     const deletedCampaign = await Campaign.findOneAndDelete({ campaignId });

     if (!deletedCampaign) {
        return res.status(404).json({
           success: false,
           message: 'Campaign not found'
        });
     }

     res.status(200).json({
        success: true,
        message: 'Campaign successfully deleted',
        data: deletedCampaign
     });
  } catch (error) {
     console.error(error);
     res.status(500).json({
        success: false,
        message: 'An error occurred while deleting the campaign',
        error: error.message
     });
  }
};

// const getAllCampaigns = async (req, res) => {
//   try {
//      const campaigns = await Campaign.find();

//      res.status(200).json({
//         success: true,
//         data: campaigns
//      });
//   } catch (error) {
//      console.error(error);
//      res.status(500).json({
//         success: false,
//         message: 'An error occurred while retrieving the campaigns',
//         error: error.message
//      });
//   }
// };

const getAllCampaigns = async (req, res) => {
  try {
     const campaigns = await Campaign.find();

     const now = new Date();

     const updatedCampaigns = campaigns.map(campaign => {
  
       const endDate = new Date(campaign.endDate);
       const remainingDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)); // Days remaining
       const percentageRaised = campaign.goalAmount > 0 ? (campaign.currentAmount / campaign.goalAmount) * 100 : 0;

       return {
         ...campaign.toObject(),
         remainingDays,
         percentageRaised: percentageRaised.toFixed(2) 
       };
     });

     res.status(200).json({
        success: true,
        data: updatedCampaigns
     });
  } catch (error) {
     console.error(error);
     res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving the campaigns',
        error: error.message
     });
  }
};

const getCampaignsByUserId = async (req, res) => {
  try {
     const { userId } = req.user; 
     const campaigns = await Campaign.find({ userId });

     if (campaigns.length === 0) {
        return res.status(404).json({
           success: false,
           message: 'No campaigns found for this user'
        });
     }

     res.status(200).json({
        success: true,
        data: campaigns
     });
  } catch (error) {
     console.error(error);
     res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving campaigns for the user',
        error: error.message
     });
  }
};

module.exports = { createCampaign, addComment, updateCampaign, deleteCampaign, getAllCampaigns, getCampaignsByUserId };
