/**
 * User Model
 * Defines the schema and model for user data in the application
 * Handles user authentication and role management
 */

// Import Mongoose for MongoDB object modeling
import mongoose from "mongoose";

/**
 * User Schema Definition
 * Defines the structure and validation rules for user documents
 */
const userSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,
    required: [true, 'Name is required'],  // Name is mandatory
    trim: true                             // Remove whitespace from both ends
  },
  
  // User's email address (used for login)
  email: {
    type: String,
    required: [true, 'Email is required'], // Email is mandatory
    unique: true,                          // Ensure email addresses are unique
    trim: true,                            // Remove whitespace
    lowercase: true                        // Convert to lowercase before saving
  },
  
  // User's password (stored as hashed value)
  password: {
    type: String,
    required: [true, 'Password is required'],           // Password is mandatory
    minlength: [6, 'Password must be at least 6 characters'] // Minimum length validation
  },
  
  // User's role (determines permissions)
  role: {
    type: String,
    enum: ['user', 'admin'],              // Only allow these two roles
    default: 'user'                        // New users are regular users by default
  }
}, {
  // Schema options
  timestamps: true  // Automatically add createdAt and updatedAt fields
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// Export the model for use in other parts of the application
export default User;
