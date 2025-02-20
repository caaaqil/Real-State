import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';

const EditProperty = () => {
  const { id } = useParams(); // Get 'id' from URL parameters
  const navigate = useNavigate(); // Navigation hook
  const [property, setProperty] = useState({ // State for property data
    title: '',
    description: '',
    location: '',
    price: '',
    status: 'available'
  });
  const [image, setImage] = useState(null); // State for selected image file
  const [currentImage, setCurrentImage] = useState(''); // State for current image URL
  const [previewUrl, setPreviewUrl] = useState(''); // State for image preview URL
  const [error, setError] = useState(''); // State for error messages
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [saving, setSaving] = useState(false); // State for saving process

  useEffect(() => {
    fetchProperty(); // Fetch property data when 'id' changes
  }, [id]);

  const fetchProperty = async () => { // Function to fetch property data
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await axios.get(`/api/enter/${id}`, { // GET request to fetch property
        headers: {
          'Authorization': token // Include token in headers
        }
      });
      setProperty(response.data); // Set property state with fetched data
      setCurrentImage(response.data.image); // Set currentImage state
      setLoading(false); // Set loading to false
    } catch (error) {
      console.error('Error fetching property:', error); // Log error
      setError('Error fetching property: ' + error.message); // Set error message
      setLoading(false); // Set loading to false
    }
  };

  const handleSubmit = async (e) => { // Function to handle form submission
    e.preventDefault(); // Prevent default form submission
    setSaving(true); // Set saving state to true
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const user = JSON.parse(localStorage.getItem('user')); // Get user data

      // Create FormData object to send data and image
      const formData = new FormData();
      formData.append('title', property.title);
      formData.append('description', property.description);
      formData.append('location', property.location);
      formData.append('price', property.price);
      formData.append('status', property.status);
      formData.append('owner_id', user._id);
      if (image) {
        formData.append('image', image); // Append image if selected
      }

      await axios.patch(`/api/enter/update/${id}`, formData, { // PATCH request to update property
        headers: {
          'Authorization': token, // Include token in headers
          'Content-Type': 'multipart/form-data' // Set content type
        }
      });
      navigate('/properties'); // Navigate to properties list on success
    } catch (error) {
      console.error('Error updating property:', error); // Log error
      setError('Error updating property: ' + error.message); // Set error message
    } finally {
      setSaving(false); // Set saving state to false
    }
  };

  const handleChange = (e) => { // Function to handle input changes
    const { name, value } = e.target;
    setProperty(prev => ({ // Update property state
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => { // Function to handle image file selection
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file'); // Set error message
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB'); // Set error message
        return;
      }

      setImage(file); // Set image state
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Set previewUrl state
      };
      reader.readAsDataURL(file);
      setError(''); // Clear error message
    }
  };

  if (loading) { // Render loading spinner if loading is true
    return (
      <Layout>
        <div className="min-vh-100 d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return ( // Render form and UI elements
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Edit Property</h2>

                {error && ( // Render error alert if error message exists
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}> 
                  <div className="mb-3">
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

                  <div className="mb-3">
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

                  <div className="mb-3">
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

                  <div className="mb-3">
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

                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">Property Image</label>
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <small className="text-muted">
                      Maximum file size: 5MB. Supported formats: JPG, PNG, GIF. Leave empty to keep current image.
                    </small>
                  </div>

                  {(previewUrl || currentImage) && ( // Render image preview or current image
                    <div className="mb-3">
                      <label className="form-label">
                        {previewUrl ? 'New Image Preview' : 'Current Image'}
                      </label>
                      <img
                        src={previewUrl || currentImage}
                        alt={property.title}
                        className="img-fluid rounded"
                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <div className="mb-3">
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
                      <option value="sold">Not Available</option>
                    </select>
                  </div>

                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? ( // Render loading spinner if saving
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating Property...
                        </>
                      ) : (
                        'Update Property'
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate('/properties')}
                      disabled={saving}
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

export default EditProperty; // Export the EditProperty component