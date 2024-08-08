const mongoose = require('mongoose');

const pledgeSchema = new mongoose.Schema({
   campaignId: {
      type: String,
      required: true
   },
   backerId: {
      type: String,
      required: true
   },
   amount: {
      type: Number,
      required: true
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
});

const Pledge = mongoose.model('Pledge', pledgeSchema);
module.exports = Pledge;
