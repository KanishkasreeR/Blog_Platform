const Campaign = require('../models/campaignModel');
const User = require('../models/userModel');
const Followe = require('../models/followerModel');
const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid');

const createCampaign = async (req, res) => {
   try {
     const {
       cause,
       goalAmount,
       title,
       aim,
       description,
       image,
       video,      
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
       currentAmount: 0,
       title,
       aim,
       description,
       image,
       video,        
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
     const { text } = req.body;
     const userId = req.user; 
 
     const objectId = new mongoose.Types.ObjectId(userId);
 
     const campaign = await Campaign.findOne({ campaignId });
     if (!campaign) {
       return res.status(404).json({
         success: false,
         message: 'Campaign not found'
       });
     }
 
     const user = await User.findById(objectId);
     if (!user) {
       return res.status(404).json({
         success: false,
         message: 'User not found'
       });
     }
     const userName = user.name;
     campaign.comments.push({
       userId: user._id.toString(), 
       userName, 
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
 

 const editComment = async (req, res) => {
  try {
    const { campaignId} = req.params;
    const { text,commentId } = req.body;
    
    // Find the campaign
    const campaign = await Campaign.findOne({ campaignId });
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Find the comment and update it
    const comment = campaign.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    comment.text = text;
    comment.createdAt = new Date(); // Optionally update the createdAt timestamp

    const updatedCampaign = await campaign.save();

    res.status(200).json({
      success: true,
      data: updatedCampaign
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while editing the comment',
      error: error.message
    });
  }
};


const deleteComment = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { commentId } = req.body;

    // Find the campaign
    const campaign = await Campaign.findOne({ _id: campaignId });
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Remove the comment from the campaign's comments array
    const result = await Campaign.updateOne(
      { _id: campaignId },
      { $pull: { comments: { _id: commentId } } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment successfully deleted'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the comment',
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

     await Follower.updateMany(
      { campaignIds: campaignId },
      { $pull: { campaignIds: campaignId } }
    );

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

const getCampaignsByCampaignId = async (req, res) => {
   try {
     const { campaignId } = req.params; 
     const campaign = await Campaign.findOne({ campaignId }); 
 
     if (!campaign) {
       return res.status(404).json({ success: false, message: 'Campaign not found' });
     }
 
     res.json({ success: true, data: campaign });
   } catch (err) {
     console.error(err);
     res.status(500).json({ success: false, message: 'Server error' });
   }
 };
 

const getCampaignsByUserId = async (req, res) => {
  try {
     if (!req.user) {
        return res.status(400).json({
           success: false,
           message: 'User not authenticated or userId is missing'
        });
     }

     const  user  = req.user; 
     console.log(user);
     const userId = user.toString();
     console.log(typeof(userId));

     const campaigns = await Campaign.find( {userId} );
     console.log(campaigns);

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


const addPledgeToCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { amount } = req.body;

    if (typeof amount !== 'number') {
      return res.status(400).json({ message: 'Amount must be a number' });
    }
    const backerId = req.user;
    const user = await User.findById(backerId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const backerName = user.name; 

    const newPledge = {
      backerId,
      backerName,
      amount,
      createdAt: new Date(),
    };

    const campaign = await Campaign.findOne({campaignId});
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    campaign.pledges.push(newPledge);
    campaign.currentAmount += amount;
    await campaign.save();

    res.status(200).json({
      success: true,
      data: {
        newPledge,
        updatedAmount: campaign.currentAmount,
        pledges: campaign.pledges
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};


module.exports = { createCampaign, addComment, updateCampaign, deleteCampaign, getAllCampaigns, getCampaignsByUserId, getCampaignsByCampaignId,addPledgeToCampaign,deleteComment,editComment};
