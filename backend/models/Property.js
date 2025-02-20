/**
 * Property Model
 * Defines the schema and model for real estate properties in the application
 * Handles property listings, including details and ownership information
 */

// Import Mongoose for MongoDB object modeling
import mongoose from "mongoose";

/**
 * Property Schema Definition
 * Defines the structure and validation rules for property documents
 */
const propertySchema = new mongoose.Schema({
  // Property title/name
  title: {
    type: String,
    required: [true, 'Title is required'],  // Title is mandatory
    trim: true                              // Remove whitespace from both ends
  },
  
  // Detailed description of the property
  description: {
    type: String,
    required: [true, 'Description is required'], // Description is mandatory
    trim: true                                  // Remove whitespace
  },
  
  // Property location/address
  location: {
    type: String,
    required: [true, 'Location is required'], // Location is mandatory
    trim: true                               // Remove whitespace
  },
  
  // Property price in currency units
  price: {
    type: Number,
    required: [true, 'Price is required'],   // Price is mandatory
    min: [0, 'Price cannot be negative']     // Ensure price is non-negative
  },
  
  // Path to property image file
  image: {
    type: String,
    default: null                            // No image by default
  },
  
  // Reference to the property owner (User model)
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,    // MongoDB ObjectId reference
    ref: 'User',                            // References the User model
    required: [true, 'Owner ID is required'] // Owner is mandatory
  },

  // Property status
  status: {
    type: String,
    enum: ['available', 'sold'],
    default: 'available'
  },

  // Payment information
  payment: {
    transactionId: String,
    amount: Number,
    date: Date,
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  // Schema options
  timestamps: true  // Automatically add createdAt and updatedAt fields
});

// Create the Property model from the schema
const Property = mongoose.model('Property', propertySchema);

// Export the model for use in other parts of the application
export default Property;
