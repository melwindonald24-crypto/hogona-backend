import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  preferences: {
    district: {
      type: String,
      required: true,
    },
    dateRange: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    groupSize: {
      type: Number,
      required: true,
    },
    travelType: {
      type: String,
      enum:["budget","luxuary"],
      required: true,
    },
  },

  selectedHotels: [{
    
    placeId: {
      type: String,
     
    },
    name: {
      type: String,

    },
    description: {
      type: String,
    },

    geom: {
      lat: {
        type: Number,
     
      },
      lon: {
        type: Number,
        
      },
    },
    thumbnail:{
      type:String,
    },
    rating:{
      type:Number,
    },
    total_price:{
      amount: {
        type: Number,
      },
      beforeTaxesFees: {
        type: Number,
      },
      currency: {
        type: String,
      },
    },
    website:{
      type:String,
    },
    phone:{
      type:String,
    },
    bookingLinks: [{
      provider:{
        type: String,
      },
      url:{
        type: String,
      }
    
    }],
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  }],


});

export default mongoose.model("trip",tripSchema)