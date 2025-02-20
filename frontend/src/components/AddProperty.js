import React, { useState } from 'react'; // Import React and useState for state management
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import axios from 'axios'; // Import axios for making HTTP requests
import Layout from './Layout'; // Import the Layout component for page structure

const AddProperty = () => { // Define the AddProperty functional component
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [property, setProperty] = useState({ // State to hold property details
    title: '',
    description: '',
    location: '',
    price: '',
    status: 'available'
  });
  const [image, setImage] = useState(null); // State to hold the selected image file
  const [previewUrl, setPreviewUrl] = useState(''); // State to hold the image preview URL
  const [error, setError] = useState(''); // State to hold error messages
  const [loading, setLoading] = useState(false); // State to track loading status

  const handleSubmit = async (e) => { // Async function to handle form submission
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading state to true
    try {
      const token = localStorage.getItem('token'); // Retrieve the authentication token from localStorage
      const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user data from localStorage

      // Create form data for multipart/form-data submission
      const formData = new FormData(); // Initialize FormData object
      formData.append('title', property.title); // Append title to formData
      formData.append('description', property.description); // Append description to formData
      formData.append('location', property.location); // Append location to formData
      formData.append('price', property.price); // Append price to formData
      formData.append('status', property.status); // Append status to formData
      formData.append('owner_id', user._id); // Append owner_id to formData
      if (image) { // If an image is selected
        formData.append('image', image); // Append the image to formData
      }

      await axios.post('/api/enter/add', formData, { // Send POST request to add property
        headers: {
          'Authorization': token, // Include token in headers for authentication
          'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data
        }
      });
      navigate('/properties'); // Navigate to the properties page upon successful submission
    } catch (error) { // Catch any errors during the request
      console.error('Error adding property:', error); // Log the error to the console
      setError('Error adding property: ' + error.message); // Set error message in state
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const handleChange = (e) => { // Function to handle input changes
    const { name, value } = e.target; // Extract name and value from the target element
    setProperty(prev => ({ // Update the property state
      ...prev, // Spread previous state
      [name]: value // Update the specific field
    }));
  };

  const handleImageChange = (e) => { // Function to handle image input change
    const file = e.target.files[0]; // Get the selected file
    if (file) { // If a file is selected
      // Validate file type
      if (!file.type.startsWith('image/')) { // Check if the file is an image
        setError('Please select an image file'); // Set error message if not an image
        return; // Exit the function
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) { // Check if the file size exceeds 5MB
        setError('Image size should be less than 5MB'); // Set error message if too large
        return; // Exit the function
      }

      setImage(file); // Set the selected image file in state
      // Create preview URL
      const reader = new FileReader(); // Create a new FileReader instance
      reader.onloadend = () => { // Set the onloadend callback
        setPreviewUrl(reader.result); // Set the preview URL in state
      };
      reader.readAsDataURL(file); // Read the file as a data URL
      setError(''); // Clear any previous error messages
    }
  };

  return ( // Render the component's JSX
    <Layout> {/* Render the Layout component */}
      <div className="container mt-5"> {/* Container for the main content */}
        <div className="row justify-content-center"> {/* Row for centering content */}
          <div className="col-md-8"> {/* Column for the form */}
            <div className="card shadow"> {/* Card container for the form */}
              <div className="card-body"> {/* Card body containing the form */}
                <h2 className="card-title text-center mb-4">Add New Property</h2> {/* Title of the form */}

                {error && ( // Render an error alert if there's an error
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}> {/* Form that submits to handleSubmit */}
                  <div className="mb-3"> {/* Form group for title */}
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={property.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3"> {/* Form group for description */}
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={property.description}
                      onChange={handleChange}
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3"> {/* Form group for location */}
                    <label htmlFor="location" className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      name="location"
                      value={property.location}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3"> {/* Form group for price */}
                    <label htmlFor="price" className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={property.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3"> {/* Form group for image upload */}
                    <label htmlFor="image" className="form-label">Property Image</label>
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                    <small className="text-muted"> {/* Small text for file size and format */}
                      Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                    </small>
                  </div>

                  {previewUrl && ( // Render image preview if previewUrl exists
                    <div className="mb-3"> {/* Form group for image preview */}
                      <label className="form-label">Image Preview</label>
                      <img
                        src={previewUrl}
                        alt="Property Preview"
                        className="img-fluid rounded"
                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <div className="mb-3"> {/* Form group for status */}
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={property.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>

                  <div className="d-grid gap-2"> {/* Grid for buttons */}
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading} // Disable button if loading
                    >
                      {loading ? ( // Show loading spinner if loading
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Adding Property...
                        </>
                      ) : (
                        'Add Property' // Show 'Add Property' text otherwise
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate('/properties')} // Navigate to properties list on click
                      disabled={loading} // Disable button if loading
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddProperty; // Export the AddProperty component