const mongoose = require('mongoose');

const descriptionSchema = new mongoose.Schema({
   type: {
      type: String,
      default: 'text', // Default to 'text' for rich text/HTML
   },
   content: {
      type: String,
      required: true
   }
});

const commentSchema = new mongoose.Schema({
   userId: {
      type: String,
      required: true
   },
   text: {
      type: String,
      required: true
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
});

const campaignSchema = new mongoose.Schema({
   userId: {
      type: String,
      required: true
   },
   campaignId: {
      type: String,
      required: true
   },
   cause: {
      type: String,
      required: true
   },
   goalAmount: {
      type: Number,
      required: true
   },
   currentAmount: {
      type: Number,
      default: 0
   },
   title: {
      type: String,
      required: true
   },
   aim: {
      type: String,
      required: true
   },
   description: [descriptionSchema], // Array of rich text content
   image: {
      type: String,
      required: true
   },
   comments: [commentSchema],
   startDate: {
      type: Date,
      required: true
   },
   endDate: {
      type: Date,
      required: true
   }
});

const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports = Campaign;
