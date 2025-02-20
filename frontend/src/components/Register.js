import React, { useState } from 'react'; // Import React and useState hook
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for routing
import axios from 'axios'; // Import axios for API requests

const Register = () => { // Define Register functional component
  const [formData, setFormData] = useState({ // State for form input data
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate(); // Navigation hook for routing

  const handleChange = (e) => { // Function to handle input changes
    setFormData({
      ...formData,
      [e.target.name]: e.target.value // Update formData with input values
    });
  };

  const handleSubmit = async (e) => { // Function to handle form submission
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear error message

    // Validate that passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await axios.post('/api/user/register', { // POST request to register API
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user' // Default role for new registrations
      });

      if (response.data) { // On successful registration
        alert('Registration successful! Please login.'); // Alert user
        navigate('/login'); // Navigate to login page
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.'); // Set error message from response or default
    }
  };

  return ( // Render the component UI
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/"> {/* Navigation bar */}
            <i className="bi bi-building me-2"></i>
            Haldoor Real Estate
          </Link>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body p-5">
                <h2 className="text-center mb-4">Register</h2> {/* Registration heading */}

                {error && ( // Render error alert if error message exists
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}> {/* Registration form */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
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

                  <div className="mb-3">
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

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    Register
                  </button>

                  <div className="text-center">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none"> {/* Login link */}
                      Login here
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-dark text-white text-center py-3 mt-5"> {/* Footer */}
        <p className="mb-0">© 2025 Haldoor Real Estate. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Register; // Export the Register component