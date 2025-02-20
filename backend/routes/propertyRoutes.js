/**
 * Property Routes
 * Handles all property-related API endpoints including:
 * - Property creation
 * - Property listing
 * - Property updates
 * - Property deletion
 * - Image upload handling
 */

// Import required dependencies
import express from 'express';          // Express framework
import multer from 'multer';           // File upload handling
import path from 'path';               // Path manipulation
import fs from 'fs';                   // File system operations
import Property from '../models/Property.js'; // Property model
import User from '../models/User.js';   // User model for owner references

// Create Express router instance
const router = express.Router();

/**
 * Multer Configuration
 * Sets up file upload handling for property images
 */
const storage = multer.diskStorage({
    // Configure upload destination
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    // Configure filename generation
    filename: function (req, file, cb) {
        // Generate unique filename using timestamp
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer with configured storage
const upload = multer({ storage: storage });

/**
 * POST /api/enter/add
 * Creates a new property listing
 * @access Authenticated users
 * @param {string} title - Property title
 * @param {string} description - Property description
 * @param {string} location - Property location
 * @param {number} price - Property price
 * @param {string} owner_id - ID of property owner
 * @param {file} image - Property image file (optional)
 * @returns {Object} Created property object
 */
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        // Extract property data from request
        const { title, description, location, price, owner_id } = req.body;
        
        // Create new property instance
        const property = new Property({
            title,
            description,
            location,
            price,
            owner_id,
            // Save image path if file was uploaded
            image: req.file ? '/uploads/' + req.file.filename : png
        });

        // Save property to database
        const savedProperty = await property.save();
        res.status(201).json(savedProperty);
    } catch (error) {
        // Handle property creation errors
        console.error('Error adding property:', error);
        res.status(400).json({ message: error.message });
    }
});

/**
 * GET /api/enter/all
 * Retrieves all properties
 * @access Public
 * @returns {Array} List of all properties with owner details
 */
router.get('/all', async (req, res) => {
    try {
        // Fetch all properties and populate owner details
        const properties = await Property.find().populate('owner_id', 'name email');
        res.json(properties);
    } catch (error) {
        // Handle fetch errors
        res.status(500).json({ message: error.message });
    }
});

/**
 * GET /api/enter/:id
 * Retrieves a specific property by ID
 * @access Public
 * @param {string} id - Property ID
 * @returns {Object} Property details with owner information
 */
router.get('/:id', async (req, res) => {
    try {
        // Find property by ID and populate owner details
        const property = await Property.findById(req.params.id)
            .populate('owner_id', 'name email');
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        
        res.json(property);
    } catch (error) {
        // Handle fetch errors
        res.status(500).json({ message: error.message });
    }
});

/**
 * PATCH /api/enter/update/:id
 * Updates a property's details
 * @access Property owner or Admin
 * @param {string} id - Property ID
 * @param {Object} updates - Fields to update
 * @param {file} image - New property image (optional)
 * @returns {Object} Updated property object
 */
router.patch('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Handle image upload if provided
        if (req.file) {
            updates.image = '/uploads/' + req.file.filename;

            // Delete old image if it exists
            const oldProperty = await Property.findById(id);
            if (oldProperty && oldProperty.image) {
                const oldImagePath = path.join('uploads', path.basename(oldProperty.image));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        // Update property in database
        const property = await Property.findByIdAndUpdate(id, updates, { new: true });
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        
        res.json(property);
    } catch (error) {
        // Handle update errors
        res.status(400).json({ message: error.message });
    }
});

/**
 * DELETE /api/enter/:id
 * Deletes a property
 * @access Property owner or Admin
 * @param {string} id - Property ID
 * @returns {Object} Success message
 */
router.delete('/:id', async (req, res) => {
    try {
        // Find property by ID
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Delete associated image file if it exists
        if (property.image) {
            const imagePath = path.join('uploads', path.basename(property.image));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Remove property from database
        await property.deleteOne();
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        // Handle deletion errors
        res.status(500).json({ message: error.message });
    }
});

/**
 * POST /api/enter/purchase/:id
 * Processes property purchase and transfers ownership
 * @access Authenticated users
 * @param {string} id - Property ID
 * @param {Object} paymentDetails - Payment information
 * @returns {Object} Updated property object
 */
router.post('/purchase/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { buyerId, paymentDetails } = req.body;

    // Find the property and check if it's available
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.status === 'sold') {
      return res.status(400).json({ message: 'Property is already sold' });
    }

    if (property.owner_id.toString() === buyerId) {
      return res.status(400).json({ message: 'You already own this property' });
    }

    // Process payment (this is a simplified version)
    const transactionId = 'TXN' + Date.now();
    const paymentDate = new Date();

    // Update property with payment info and new owner
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      {
        owner_id: buyerId,
        status: 'sold',
        payment: {
          transactionId,
          amount: property.price,
          date: paymentDate,
          buyerId
        }
      },
      { new: true }
    ).populate('owner_id', 'name email');

    res.json({
      message: 'Property purchased successfully',
      property: updatedProperty
    });
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ message: error.message });
  }
});

// Export router for use in main app
export default router;
