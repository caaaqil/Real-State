import React, { useState, useEffect } from 'react'; // Import React and hooks
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios'; // Import axios for API calls
import Layout from './Layout'; // Import Layout component

const Properties = () => { // Define Properties functional component
  const [properties, setProperties] = useState([]); // State for properties list
  const [searchTerm, setSearchTerm] = useState(''); // State for search input value
  const [searchBy, setSearchBy] = useState('title'); // State for search field selection
  const [error, setError] = useState(''); // State for error messages
  const user = JSON.parse(localStorage.getItem('user')); // Get user data from localStorage
  const isAdmin = user?.role === 'admin'; // Check if user is admin

  useEffect(() => { // Use useEffect to fetch properties on component mount
    fetchProperties();
  }, []);

  const fetchProperties = async () => { // Function to fetch properties from API
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await axios.get('/api/enter/all', { // GET request to fetch all properties
        headers: {
          'Authorization': token // Include token in headers
        }
      });
      let filteredProperties = response.data; // Get all properties

      // If not admin, filter properties to show only user's properties
      if (!isAdmin) {
        filteredProperties = response.data.filter(prop => prop.owner_id._id === user._id);
      }

      setProperties(filteredProperties); // Set properties state
    } catch (error) {
      console.error('Error fetching properties:', error); // Log error
      setError('Error fetching properties: ' + error.message); // Set error message
    }
  };

  const handleDelete = async (id) => { // Function to handle property deletion
    if (window.confirm('Are you sure you want to delete this property?')) { // Confirmation dialog
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        await axios.delete(`/api/enter/${id}`, { // DELETE request to delete property by ID
          headers: {
            'Authorization': token // Include token in headers
          }
        });
        fetchProperties(); // Refetch properties after deletion
      } catch (error) {
        console.error('Error deleting property:', error); // Log error
        setError('Error deleting property: ' + error.message); // Set error message
      }
    }
  };

  const filteredProperties = properties.filter(property => { // Filter properties based on search criteria
    const searchValue = property[searchBy]?.toString().toLowerCase() || ''; // Get search field value
    return searchValue.includes(searchTerm.toLowerCase()); // Check if search term is included
  });

  return ( // Render the component UI
    <Layout>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manage Properties</h2>
          <div className="d-flex gap-3">
            <Link to="/properties/add" className="btn btn-primary d-flex align-items-center"> {/* Add property link */}
              <i className="bi bi-plus-circle me-2"></i>
              Add Property
            </Link>
            <div className="input-group" style={{ maxWidth: '400px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on change
              />
              <select
                className="form-select"
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)} // Update searchBy on change
                style={{ maxWidth: '120px' }}
              >
                <option value="title">Title</option>
                <option value="description">Description</option>
                <option value="location">Location</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
        </div>

        {error && ( // Render error alert if error message exists
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row g-4">
          {filteredProperties.map(property => ( // Render property cards
            <div key={property._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={property.image}
                  className="card-img-top"
                  alt={property.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{property.title}</h5>
                  <p className="card-text">{property.description}</p>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-primary fw-bold">${property.price.toLocaleString()}</span>
                    <span className="badge bg-info">{property.location}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <Link
                      to={`/properties/edit/${property._id}`}
                      className="btn btn-outline-primary flex-grow-1" // Edit property link
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(property._id)} // Delete property button
                      className="btn btn-outline-danger flex-grow-1"
                    >
                      <i className="bi bi-trash me-2"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Properties; // Export the Properties component