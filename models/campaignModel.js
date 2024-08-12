const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
   userId:{
      type: String,
     required: true
   },
   userName:{
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
   },description: {
      type: String, // Ensure this is a String type
      required: true,
    }, // Array of rich text content
   image: {
      type: String,
      required: true
   },
   video:{
      type:String
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
