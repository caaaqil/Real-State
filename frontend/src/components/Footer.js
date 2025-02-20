import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <p className="mb-0" style={{ fontSize: '0.95rem', letterSpacing: '0.3px' }}>
              © {new Date().getFullYear()} Haldoor Real Estate. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 