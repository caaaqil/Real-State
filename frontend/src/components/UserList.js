import React, { useState, useEffect } from 'react'; // Import React and hooks
import { useNavigate } from 'react-router-dom'; // Import navigation hook
import axios from 'axios'; // Import axios for HTTP requests
import Layout from './Layout'; // Import custom Layout component

const UserList = () => { // Define the UserList functional component
  const [users, setUsers] = useState([]); // State to store list of users
  const [error, setError] = useState(''); // State to handle error messages
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [searchBy, setSearchBy] = useState('name'); // State for search criteria
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [showPasswordModal, setShowPasswordModal] = useState(false); // State to show/hide password modal
  const [newPassword, setNewPassword] = useState(''); // State for new password input
  const [passwordError, setPasswordError] = useState(''); // State for password error messages
  const [showRegisterModal, setShowRegisterModal] = useState(false); // State to show/hide register modal
  const [registerData, setRegisterData] = useState({ // State for register form data
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const navigate = useNavigate(); // Hook for navigation
  const user = JSON.parse(localStorage.getItem('user')); // Get current user from localStorage

  useEffect(() => { // Effect to check user role and fetch users
    if (!user || user.role !== 'admin') {
      navigate('/'); // Redirect if not admin
      return;
    }
    fetchUsers(); // Fetch users data
  }, [navigate]); // Dependency array includes navigate

  const fetchUsers = async () => { // Function to fetch all users
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) { // Check if token exists
        setError('No authorization token found'); // Set error if no token
        navigate('/login'); // Redirect to login
        return;
      }
      const response = await axios.get('/api/user/all', { // Make GET request to fetch users
        headers: {
          'Authorization': token // Include token in headers
        }
      });
      setUsers(response.data); // Set users state with response data
    } catch (error) { // Handle errors
      if (error.response?.status === 401) { // If unauthorized
        localStorage.removeItem('token'); // Remove token
        localStorage.removeItem('user'); // Remove user
        navigate('/login'); // Redirect to login
      }
      setError('Error fetching users: ' + error.message); // Set error message
    }
  };

  const handleDelete = async (userId) => { // Function to delete a user
    if (userId === user._id) { // Prevent deleting current user
      setError("You cannot delete your own account");
      return;
    }
    if (window.confirm('Are you sure you want to delete this user?')) { // Confirm deletion
      try {
        const token = localStorage.getItem('token'); // Get token
        await axios.delete(`/api/user/${userId}`, { // Make DELETE request
          headers: {
            'Authorization': token // Include token
          }
        });
        fetchUsers(); // Refetch users
        alert('User deleted successfully!'); // Show success alert
      } catch (error) { // Handle deletion error
        setError('Error deleting user: ' + error.message);
      }
    }
  };

  const handlePasswordChange = async () => { // Function to change user password
    try {
      const token = localStorage.getItem('token'); // Get token
      await axios.patch(`/api/user/${selectedUser._id}/password`, // Make PATCH request to change password
        { newPassword: newPassword },
        {
          headers: {
            'Authorization': token // Include token
          }
        }
      );
      alert('Password updated successfully'); // Show success alert
      setShowPasswordModal(false); // Hide modal
      setNewPassword(''); // Reset password input
      setPasswordError(''); // Reset password error
      setSelectedUser(null); // Reset selected user
    } catch (error) { // Handle password change error
      setPasswordError('Error updating password: ' + error.message);
    }
  };

  const handleLogout = () => { // Function to handle logout
    localStorage.removeItem('user'); // Remove user from localStorage
    localStorage.removeItem('token'); // Remove token
    navigate('/login'); // Redirect to login
  };

  const handleChangeRole = async (user) => { // Function to change user role
    if (user._id === JSON.parse(localStorage.getItem('user'))._id) { // Prevent changing current user's role
      setError("You cannot change your own role");
      return;
    }
    const newRole = user.role === 'admin' ? 'user' : 'admin'; // Toggle role
    try {
      const token = localStorage.getItem('token'); // Get token
      const response = await axios.patch(`/api/user/role/${user._id}`, // Make PATCH request to change role
        { role: newRole },
        {
          headers: {
            'Authorization': token // Include token
          }
        }
      );
      if (response.data) { // If successful
        await fetchUsers(); // Refetch users
        alert(`Role changed successfully to ${newRole}`); // Show success alert
      }
    } catch (error) { // Handle role change error
      console.error('Role change error:', error);
      setError(error.response?.data?.message || 'Error updating user role. Please try again.');
    }
  };

  const handleRegisterUser = async (e) => { // Function to handle user registration
    e.preventDefault(); // Prevent default form submission
    try {
      const token = localStorage.getItem('token'); // Get token
      const response = await axios.post('/api/user/register', registerData, { // Make POST request to register user
        headers: {
          'Authorization': token // Include token
        }
      });
      if (response.data) { // If successful
        await fetchUsers(); // Refetch users
        setShowRegisterModal(false); // Hide modal
        setRegisterData({ // Reset register form data
          name: '',
          email: '',
          password: '',
          role: 'user'
        });
        alert('User registered successfully!'); // Show success alert
      }
    } catch (error) { // Handle registration error
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const filteredUsers = users.filter(user => { // Filter users based on search criteria
    if (!searchTerm) return true; // Return true if no search term
    const searchValue = user[searchBy]?.toString().toLowerCase() || ''; // Get search value
    return searchValue.includes(searchTerm.toLowerCase()); // Check if includes search term
  });

  return ( // Return JSX for the component
    <Layout> {/* Wrap content with Layout component */}
      <div className="container mt-5"> {/* Container for content */}
        <div className="d-flex justify-content-between align-items-center mb-4"> {/* Header section */}
          <h2>User Management</h2> {/* Title */}
          <div className="d-flex gap-3"> {/* Buttons and search */}
            <button 
              className="btn btn-primary d-flex align-items-center fw-bold shadow-sm"
              onClick={() => setShowRegisterModal(true)} 
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#0d6efd',
                borderColor: '#0d6efd',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => { // Change button color on hover
                e.currentTarget.style.backgroundColor = '#0b5ed7';
                e.currentTarget.style.borderColor = '#0b5ed7';
              }}
              onMouseOut={(e) => { // Revert button color on mouse out
                e.currentTarget.style.backgroundColor = '#0d6efd';
                e.currentTarget.style.borderColor = '#0d6efd';
              }}
            >
              <i className="bi bi-person-plus-fill me-2"></i> {/* Icon */}
              Register New User {/* Button text */}
            </button>
            <div className="input-group"> {/* Search input and select */}
              <input
                type="text"
                className="form-control"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              <select
                className="form-select"
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)} 
                style={{ maxWidth: '120px' }}
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
              </select>
            </div>
          </div>
        </div>
        {error && ( // Display error alert if error exists
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="card shadow"> {/* Card for user table */}
          <div className="table-responsive"> {/* Responsive table */}
            <table className="table table-hover mb-0"> {/* Table */}
              <thead className="bg-light"> {/* Table header */}
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody> {/* Table body */}
                {filteredUsers.map(user => ( // Render rows for each user
                  <tr key={user._id}>
                    <td className="align-middle">{user.name}</td> {/* User name */}
                    <td className="align-middle">{user.email}</td> {/* User email */}
                    <td className="align-middle"> {/* User role with badge */}
                      <span className={`badge ${user.role === 'admin' ? 'bg-primary' : 'bg-success'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td> {/* Actions buttons */}
                      <div className="btn-group">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleChangeRole(user)} 
                          title="Change Role"
                        >
                          <i className="bi bi-person-gear"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => { // Toggle password modal
                            setSelectedUser(user);
                            setShowPasswordModal(true);
                          }}
                          title="Change Password"
                        >
                          <i className="bi bi-key"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(user._id)} 
                          title="Delete User"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Register User Modal */}
      {showRegisterModal && ( // Render register modal if showRegisterModal is true
        <>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header"> {/* Modal header */}
                  <h5 className="modal-title">Register New User</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => { // Close modal and reset register data
                      setShowRegisterModal(false);
                      setRegisterData({
                        name: '',
                        email: '',
                        password: '',
                        role: 'user'
                      });
                      setError('');
                    }}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body"> {/* Modal body */}
                  {error && ( // Display error alert if error exists
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleRegisterUser}> {/* Register form */}
                    <div className="mb-3"> {/* Name input */}
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({...registerData, name: e.target.value})} 
                        required
                      />
                    </div>
                    <div className="mb-3"> {/* Email input */}
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})} 
                        required
                      />
                    </div>
                    <div className="mb-3"> {/* Password input */}
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})} 
                        required
                        minLength="6"
                      />
                    </div>
                    <div className="mb-3"> {/* Role select */}
                      <label htmlFor="role" className="form-label">Role</label>
                      <select
                        className="form-select"
                        id="role"
                        value={registerData.role}
                        onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                        required
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="modal-footer px-0 pb-0"> {/* Modal footer */}
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => { // Close modal and reset register data
                          setShowRegisterModal(false);
                          setRegisterData({
                            name: '',
                            email: '',
                            password: '',
                            role: 'user'
                          });
                          setError('');
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Register User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div 
            className="modal-backdrop fade show" 
            onClick={() => { // Close modal and reset register data on backdrop click
              setShowRegisterModal(false);
              setRegisterData({
                name: '',
                email: '',
                password: '',
                role: 'user'
              });
              setError('');
            }}
          ></div>
        </>
      )}
      {/* Password Change Modal */}
      {showPasswordModal && ( // Render password modal if showPasswordModal is true
        <>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header"> {/* Modal header */}
                  <h5 className="modal-title">
                    {selectedUser ? `Change Password for ${selectedUser.name}` : 'Change Password'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => { // Close modal and reset password data
                      setShowPasswordModal(false);
                      setNewPassword('');
                      setPasswordError('');
                      setSelectedUser(null);
                    }}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body"> {/* Modal body */}
                  {passwordError && ( // Display password error alert if error exists
                    <div className="alert alert-danger" role="alert">
                      {passwordError}
                    </div>
                  )}
                  <div className="mb-3"> {/* New password input */}
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
                <div className="modal-footer"> {/* Modal footer */}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => { // Close modal and reset password data
                      setShowPasswordModal(false);
                      setNewPassword('');
                      setPasswordError('');
                      setSelectedUser(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePasswordChange} 
                    disabled={!newPassword}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div 
            className="modal-backdrop fade show" 
            onClick={() => { // Close modal and reset password data on backdrop click
              setShowPasswordModal(false);
              setNewPassword('');
              setPasswordError('');
              setSelectedUser(null);
            }}
          ></div>
        </>
      )}
    </Layout>
  );
};

export default UserList; // Export the UserList component