import React, { useState, useEffect } from 'react'; // Import React and hooks
import axios from 'axios'; // Import axios for HTTP requests
import Layout from './Layout'; // Import the Layout component

const AllProperties = () => { // Define the AllProperties functional component
  const [properties, setProperties] = useState([]); // State to hold the list of properties
  const [searchTerm, setSearchTerm] = useState(''); // State for the search input value
  const [searchBy, setSearchBy] = useState('title'); // State for the search field (title, description, etc.)
  const [selectedProperty, setSelectedProperty] = useState(null); // State for the selected property for purchase
  const [showPurchaseModal, setShowPurchaseModal] = useState(false); // State to show/hide the purchase modal
  const [error, setError] = useState(''); // State to hold any error messages

  useEffect(() => { // Fetch properties when the component mounts
    fetchProperties();
  }, []);

  const fetchProperties = async () => { // Function to fetch properties from the API
    try {
      const token = localStorage.getItem('token'); // Retrieve the authentication token from localStorage
      const response = await axios.get('/api/enter/all', { // Make a GET request to fetch properties
        headers: {
          'Authorization': token // Include the token in the headers for authentication
        }
      });
      setProperties(response.data); // Update the properties state with the fetched data
    } catch (error) { // Handle any errors during the fetch
      console.error('Error fetching properties:', error); // Log the error to the console
      setError('Error fetching properties: ' + error.message); // Set an error message in state
    }
  };

  const handlePurchase = async (property) => { // Function to handle property purchase
    try {
      const token = localStorage.getItem('token'); // Retrieve the authentication token
      await axios.post(`/api/enter/purchase/${property._id}`, {}, { // Make a POST request to purchase the property
        headers: {
          'Authorization': token // Include the token in the headers
        }
      });
      alert('Property purchased successfully!'); // Show a success alert to the user
      setShowPurchaseModal(false); // Hide the purchase modal
      fetchProperties(); // Refetch properties to update the list
    } catch (error) { // Handle any errors during purchase
      console.error('Error purchasing property:', error); // Log the error to the console
      setError('Error purchasing property: ' + error.message); // Set an error message in state
    }
  };

  const filteredProperties = properties.filter(property => { // Filter properties based on search criteria
    const searchValue = property[searchBy]?.toString().toLowerCase() || ''; // Get the search field value in lowercase
    return searchValue.includes(searchTerm.toLowerCase()); // Check if it includes the search term in lowercase
  });

  return ( // Render the component's JSX
    <Layout> {/* Render the Layout component */}
      <div className="container mt-5"> {/* Container for the main content */}
        <div className="d-flex justify-content-between align-items-center mb-4"> {/* Header section */}
          <h2>All Properties</h2> {/* Title of the page */}
          <div className="input-group" style={{ maxWidth: '400px' }}> {/* Search input and select field */}
            <input
              type="text"
              className="form-control"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
            />
            <select
              className="form-select"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)} // Update searchBy on select change
              style={{ maxWidth: '120px' }}
            >
              <option value="title">Title</option> {/* Option to search by title */}
              <option value="description">Description</option> {/* Option to search by description */}
              <option value="location">Location</option> {/* Option to search by location */}
              <option value="price">Price</option> {/* Option to search by price */}
            </select>
          </div>
        </div>

        {error && ( // Display an error alert if there's an error
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row g-4"> {/* Render the list of properties in a grid */}
          {filteredProperties.map(property => ( // Map over filteredProperties to render each property
            <div key={property._id} className="col-md-6 col-lg-4"> {/* Container for each property card */}
              <div className="card h-100 shadow-sm"> {/* Property card */}
                <img
                  src={property.image}
                  className="card-img-top"
                  alt={property.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body"> {/* Card body containing property details */}
                  <h5 className="card-title">{property.title}</h5> {/* Property title */}
                  <p className="card-text">{property.description}</p> {/* Property description */}
                  <div className="d-flex justify-content-between align-items-center"> {/* Price and location info */}
                    <span className="text-primary fw-bold">${property.price.toLocaleString()}</span> {/* Property price */}
                    <span className="badge bg-info">{property.location}</span> {/* Property location */}
                  </div>
                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={() => { // Button to select property for purchase
                      setSelectedProperty(property); // Set the selected property
                      setShowPurchaseModal(true); // Show the purchase modal
                    }}
                    disabled={property.status === 'sold'} // Disable button if property is sold
                  >
                    {property.status === 'sold' ? 'Sold' : 'Buy Property'} {/* Display 'Sold' or 'Buy Property' based on status */}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPurchaseModal && selectedProperty && ( // Render the purchase confirmation modal if visible and a property is selected
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}> {/* Modal backdrop */}
          <div className="modal-dialog"> {/* Modal dialog container */}
            <div className="modal-content"> {/* Modal content */}
              <div className="modal-header"> {/* Modal header */}
                <h5 className="modal-title">Confirm Purchase</h5> {/* Modal title */}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => { // Button to close the modal
                    setShowPurchaseModal(false); // Hide the modal
                    setSelectedProperty(null); // Unset the selected property
                    setError(''); // Clear any error messages
                  }}
                ></button>
              </div>
              <div className="modal-body"> {/* Modal body content */}
                <p>Are you sure you want to purchase this property?</p> {/* Confirmation message */}
                <div className="card mb-3"> {/* Card showing property details */}
                  <div className="card-body">
                    <h6 className="card-title">{selectedProperty.title}</h6> {/* Property title */}
                    <p className="card-text">{selectedProperty.description}</p> {/* Property description */}
                    <p className="card-text"> {/* Property price */}
                      <strong>Price:</strong> ${selectedProperty.price.toLocaleString()}
                    </p>
                    <p className="card-text"> {/* Property location */}
                      <strong>Location:</strong> {selectedProperty.location}
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer"> {/* Modal footer with buttons */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { // Button to cancel purchase
                    setShowPurchaseModal(false); // Hide the modal
                    setSelectedProperty(null); // Unset the selected property
                    setError(''); // Clear any error messages
                  }}
                >
                  Cancel {/* Cancel button label */}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handlePurchase(selectedProperty)} // Button to confirm purchase
                >
                  Confirm Purchase {/* Confirm purchase button label */}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AllProperties; // Export the AllProperties component