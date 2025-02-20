import React, { useState } from 'react'; // Import React and useState hook
import { useNavigate, Link } from 'react-router-dom'; // Import navigation hooks
import axios from 'axios'; // Import axios for API requests

const Login = () => { // Define the Login functional component
  const navigate = useNavigate(); // Navigation hook for routing
  const [formData, setFormData] = useState({ // State for form input data
    email: '',
    password: ''
  });
  const [error, setError] = useState(''); // State for error messages

  const handleChange = (e) => { // Function to handle input changes
    setFormData({
      ...formData,
      [e.target.name]: e.target.value // Update formData with input values
    });
  };

  const handleSubmit = async (e) => { // Function to handle form submission
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear error message
    try {
      const response = await axios.post('/api/user/login', formData); // POST request to login API

      if (response.data.success) { // If login is successful
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data
        localStorage.setItem('isLoggedIn', 'true'); // Store isLoggedIn flag
        localStorage.setItem('token', response.data.token); // Store authentication token
        navigate('/home'); // Navigate to home page
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed'); // Set error message from response or default
    }
  };

  return ( // Render the component UI
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="text-center mb-4">
              <h1 className="text-primary">Haldoor Real Estate</h1> {/* Brand name */}
              <p className="text-muted">Sign in to your account</p> {/* Subheading */}
            </div>
            <div className="card shadow">
              <div className="card-body p-4">
                {error && ( // Render error alert if error message exists
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}> {/* Login form */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2 mb-3">
                    Sign In
                  </button>
                </form>
                <div className="text-center">
                  <p className="mb-0 text-muted">Don't have an account? <Link to="/register" className="text-primary">Register here</Link></p> {/* Registration link */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; // Export the Login component