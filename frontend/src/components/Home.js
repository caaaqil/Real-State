import React, { useState, useEffect } from 'react'; // Import React and hooks
import axios from 'axios'; // Import axios for API calls
import Layout from './Layout'; // Import Layout component

const Home = () => { // Define Home functional component
  const [stats, setStats] = useState({ // State for statistics
    totalProperties: 0,
    totalValue: 0,
    averagePrice: 0,
    propertiesByLocation: {}
  });

  const user = JSON.parse(localStorage.getItem('user')); // Get user data from localStorage
  const isAdmin = user?.role === 'admin'; // Check if user is admin

  useEffect(() => { // Use useEffect to fetch stats on component mount
    fetchStats();
  }, []);

  const fetchStats = async () => { // Function to fetch and process stats
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await axios.get('/api/enter/all', { // GET request to fetch all properties
        headers: {
          'Authorization': token // Include token in headers
        }
      });

      let properties = response.data; // Get properties data

      // If not admin, filter properties to show only user's properties
      if (!isAdmin) {
        properties = properties.filter(prop => prop.owner_id._id === user._id);
      }

      const totalProperties = properties.length; // Calculate total properties
      const totalValue = properties.reduce((sum, prop) => sum + Number(prop.price), 0); // Calculate total value
      const averagePrice = totalProperties > 0 ? totalValue / totalProperties : 0; // Calculate average price

      const propertiesByLocation = properties.reduce((acc, prop) => { // Count properties per location
        acc[prop.location] = (acc[prop.location] || 0) + 1;
        return acc;
      }, {});

      setStats({ // Update stats state
        totalProperties,
        totalValue,
        averagePrice,
        propertiesByLocation
      });
    } catch (error) {
      console.error('Error fetching stats:', error); // Log error
    }
  };

  return ( // Render the component UI
    <Layout>
      <div className="container mt-5">
        <h2 className="mb-4">{isAdmin ? 'Dashboard' : 'My Properties Dashboard'}</h2>

        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-primary">
                  <i className="bi bi-house-door me-2"></i>
                  {isAdmin ? 'Total Properties' : 'My Properties'} 
                </h5>
                <p className="card-text display-6">{stats.totalProperties}</p> 
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-success">
                  <i className="bi bi-cash me-2"></i>
                  {isAdmin ? 'Total Value' : 'Total Value of My Properties'} 
                </h5>
                <p className="card-text display-6">
                  ${stats.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-info">
                  <i className="bi bi-graph-up me-2"></i>
                  Average Price 
                </h5>
                <p className="card-text display-6">
                  ${stats.averagePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} 
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-warning">
                  <i className="bi bi-geo-alt me-2"></i>
                  {isAdmin ? 'Locations' : 'My Property Locations'} 
                </h5>
                <p className="card-text display-6">
                  {Object.keys(stats.propertiesByLocation).length} 
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="mb-4">{isAdmin ? 'Properties by Location' : 'My Properties by Location'}</h3> 
          <div className="row g-4">
            {Object.entries(stats.propertiesByLocation).map(([location, count]) => ( // Map through propertiesByLocation
              <div key={location} className="col-md-6 col-lg-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0 text-primary">
                        <i className="bi bi-geo-alt me-2"></i>
                        {location} 
                      </h5>
                      <span className="badge bg-primary rounded-pill fs-5">
                        {count} 
                      </span>
                    </div>
                    <p className="card-text mt-3 text-muted">
                      {count === 1 ? 'Property' : 'Properties'} in this location 
                    </p> 
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home; // Export the Home component