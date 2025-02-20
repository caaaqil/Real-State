/**
 * User Routes
 * Handles all user-related API endpoints including:
 * - User registration
 * - User authentication (login)
 * - User management (CRUD operations)
 */

// Import required dependencies
import express from 'express';          // Express framework
import User from '../models/User.js';   // User model
import bcrypt from 'bcryptjs';         // Password hashing
import jwt from 'jsonwebtoken';        // JWT for authentication

// Create Express router instance
const RealRouters = express.Router();

// Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'your-secret-key'); // Use your actual secret key
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * GET /api/user/all
 * Retrieves all users from the database
 * @access Admin only
 * @returns {Array} List of all users
 */
RealRouters.get('/all', verifyAdmin, async (req, res) => {
  try {
    // Fetch all users from database
    const users = await User.find();
    res.send(users);
  } catch (err) {
    // Handle any errors during user retrieval
    res.status(500).send({ 
      message: 'Error retrieving users', 
      error: err.message 
    });
  }
});

/**
 * POST /api/user/register
 * Registers a new user in the system
 * @access Public
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's password (will be hashed)
 * @param {string} role - User's role (admin/user)
 * @returns {Object} Created user object
 */
RealRouters.post('/register', async (req, res) => {
  try {
    // Extract user data from request body
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).send({ 
        message: 'Please provide all required fields.' 
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user instance with hashed password
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Save user to database
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    // Handle registration errors
    res.status(400).send({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});

/**
 * POST /api/user/login
 * Authenticates a user and returns user data
 * @access Public
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Object} User data and success status
 */
RealRouters.post('/login', async (req, res) => {
  try {
    // Log login attempt for debugging
    console.log('Login attempt for email:', req.body.email);
    const { email, password } = req.body;

    // Check if user exists in database
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password against stored hash
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ message: 'Invalid password' });
    }

    console.log('Login successful for user:', email);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'your-secret-key', // Use your actual secret key
      { expiresIn: '24h' }
    );

    // Return user data and token on successful login
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    // Handle login errors
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
});

/**
 * PATCH /api/user/:id
 * Updates user details
 * @access Admin only
 * @param {string} id - User ID to update
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated user object
 */
RealRouters.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    // Validate user ID
    if (!id) {
      return res.status(400).send({ message: 'Please provide an id.' });
    }

    // Update user in database
    const user = await User.findByIdAndUpdate(
      id, 
      { name, email, password, role }, 
      { new: true } // Return updated document
    );

    // Check if user exists
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    res.send(user);
  } catch (error) {
    // Handle update errors
    res.status(500).send({ 
      message: 'Update failed.', 
      error: error.message 
    });
  }
});

/**
 * DELETE /api/user/:id
 * Deletes a user from the system
 * @access Admin only
 * @param {string} id - User ID to delete
 * @returns {Object} Deleted user object
 */
RealRouters.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate user ID
    if (!id) {
      return res.status(400).send({ message: 'Please provide an id.' });
    }

    // Delete user from database
    const user = await User.findByIdAndDelete(id);

    // Check if user exists
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    res.send(user);
  } catch (error) {
    // Handle deletion errors
    res.status(500).send({ 
      message: 'Delete failed.', 
      error: error.message 
    });
  }
});

/**
 * POST /api/user/create-test-user
 * Creates a test user for development purposes
 * @access Public
 * @returns {Object} Test user credentials
 */
RealRouters.post('/create-test-user', async (req, res) => {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      return res.json({ 
        message: 'Test user already exists',
        credentials: {
          email: 'test@example.com',
          password: 'test123'
        }
      });
    }

    // Create test user with predefined credentials
    const hashedPassword = await bcrypt.hash('test123', 10);
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user'
    });

    await testUser.save();

    // Return test user credentials
    res.json({ 
      message: 'Test user created successfully',
      credentials: {
        email: 'test@example.com',
        password: 'test123'
      }
    });
  } catch (error) {
    // Handle test user creation errors
    console.error('Error creating test user:', error);
    res.status(500).json({ 
      message: 'Error creating test user', 
      error: error.message 
    });
  }
});

/**
 * PATCH /api/user/:id/password
 * Changes a user's password
 * @access Admin or Self
 * @param {string} id - User ID
 * @param {string} newPassword - New password to set
 * @returns {Object} Success message
 */
RealRouters.patch('/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Validate inputs
    if (!id || !newPassword) {
      return res.status(400).send({ 
        message: 'Please provide user ID and new password.' 
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    const user = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    // Check if user exists
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    res.send({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).send({ 
      message: 'Password update failed.', 
      error: error.message 
    });
  }
});

/**
 * PATCH /api/user/role/:id
 * Changes a user's role
 * @access Admin only
 * @param {string} id - User ID
 * @param {string} role - New role to assign
 * @returns {Object} Updated user object
 */
RealRouters.patch('/role/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!role || !['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Update user's role
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Role change error:', error);
    res.status(500).json({ message: 'Role update failed', error: error.message });
  }
});

// Export router for use in main app
export default RealRouters;
