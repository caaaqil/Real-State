/**
 * Main application file for Haldoor Real Estate API
 * This file sets up the Express server, middleware, and database connection
 */

// Import required dependencies
import express from 'express';        // Web framework
import mongoose from 'mongoose';      // MongoDB ODM
import cors from 'cors';             // Cross-Origin Resource Sharing
import path from 'path';             // Path manipulation
import { fileURLToPath } from 'url'; // URL manipulation for ES modules

// Import route handlers for different API endpoints
import userRoutes from './routes/userRoutes.js';       // User management routes
import propertyRoutes from './routes/propertyRoutes.js'; // Property management routes

// Initialize Express application
const app = express();

// Set up ES modules directory name equivalent to __dirname in CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up middleware
app.use(cors());                                  // Allow cross-origin requests
app.use(express.json());                         // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Set up static file serving for uploaded files
// This makes the /uploads directory publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up MongoDB connection
// Connect to local MongoDB instance with database name 'RealState'
mongoose.connect('mongodb://127.0.0.1:27017/RealState')
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Register route handlers
app.use('/api/user', userRoutes);     // Mount user routes at /api/user
app.use('/api/enter', propertyRoutes); // Mount property routes at /api/enter

// Set up root route
// This route provides a simple welcome message to verify API is running
app.get('/', (req, res) => {
  res.send('Welcome to Haldoor Real Estate API');
});

// Global error handling middleware
// This catches any errors that weren't handled in the route handlers
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).send('Something broke! Please try again later.');
});

// Start the server
const PORT = process.env.PORT || 5000; // Use environment port or default to 5000
app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});

// Export app instance for testing purposes
export default app;
