// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';

// const Payment = () => {
//   const { propertyId } = useParams();
//   const navigate = useNavigate();
//   const [property, setProperty] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const user = JSON.parse(localStorage.getItem('user'));
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [newPassword, setNewPassword] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const isAdmin = user?.role === 'admin';

//   useEffect(() => {
//     fetchProperty();
//   }, [propertyId]);

//   const fetchProperty = async () => {
//     try {
//       const response = await axios.get(`/api/enter/${propertyId}`);
//       setProperty(response.data);
//       setLoading(false);
//     } catch (error) {
//       setError('Error fetching property: ' + error.message);
//       setLoading(false);
//     }
//   };

//   const handlePurchase = async () => {
//     try {
//       const response = await axios.post(`/api/enter/purchase/${propertyId}`, {
//         buyerId: user._id,
//         paymentDetails: {
//           amount: property.price,
//           date: new Date()
//         }
//       });

//       alert('Property purchased successfully!');
//       navigate('/all-properties');
//     } catch (error) {
//       setError('Error purchasing property: ' + error.message);
//     }
//   };

//   const handlePasswordChange = async () => {
//     try {
//       await axios.patch(`/api/user/${user._id}/password`, { newPassword });
//       setShowPasswordModal(false);
//       setNewPassword('');
//       setPasswordError('');
//       alert('Password changed successfully!');
//     } catch (error) {
//       setPasswordError('Error changing password: ' + error.message);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     window.location.href = '/login';
//   };

//   if (loading) {
//     return (
//       <div className="min-vh-100 d-flex justify-content-center align-items-center">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!property) {
//     return (
//       <div className="container mt-5">
//         <div className="alert alert-danger">Property not found</div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//         <div className="container">
//           <Link className="navbar-brand" to="/">Haldoor Real Estate</Link>
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//             aria-controls="navbarNav"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse" id="navbarNav">
//             <ul className="navbar-nav me-auto">
//               <li className="nav-item">
//                 <Link className="nav-link fw-bold" to="/">Home</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link fw-bold" to="/all-properties">All Properties</Link>
//               </li>
//               {isAdmin && (
//                 <>
//                   <li className="nav-item">
//                     <Link className="nav-link fw-bold" to="/properties">Manage Properties</Link>
//                   </li>
//                   <li className="nav-item">
//                     <Link className="nav-link fw-bold" to="/users">Users</Link>
//                   </li>
//                 </>
//               )}
//             </ul>
//             <ul className="navbar-nav">
//               <li className="nav-item">
//                 <button 
//                   onClick={() => setShowPasswordModal(true)}
//                   className="btn btn-link nav-link d-flex align-items-center fw-bold"
//                   style={{ border: 'none', background: 'none', cursor: 'pointer' }}
//                 >
//                   <i className="bi bi-key me-2"></i>
//                   Change Password
//                 </button>
//               </li>
//               <li className="nav-item">
//                 <button 
//                   onClick={handleLogout}
//                   className="btn btn-link nav-link d-flex align-items-center fw-bold"
//                   style={{ border: 'none', background: 'none', cursor: 'pointer' }}
//                 >
//                   <i className="bi bi-box-arrow-right me-2"></i>
//                   Logout
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       <div className="container mt-5">
//         <div className="row justify-content-center">
//           <div className="col-md-8">
//             <div className="card shadow">
//               <div className="card-header bg-primary text-white">
//                 <h4 className="mb-0">Property Purchase</h4>
//               </div>
//               <div className="card-body">
//                 {error && (
//                   <div className="alert alert-danger" role="alert">
//                     {error}
//                   </div>
//                 )}

//                 <div className="row mb-4">
//                   <div className="col-md-6">
//                     {property.image && (
//                       <img
//                         src={property.image}
//                         alt={property.title}
//                         className="img-fluid rounded"
//                       />
//                     )}
//                   </div>
//                   <div className="col-md-6">
//                     <h5>{property.title}</h5>
//                     <p className="text-muted">{property.description}</p>
//                     <p><strong>Location:</strong> {property.location}</p>
//                     <p><strong>Price:</strong> ${property.price.toLocaleString()}</p>
//                     <p><strong>Seller:</strong> {property.owner_id.name}</p>
//                   </div>
//                 </div>

//                 <div className="alert alert-info">
//                   <h5>Payment Information</h5>
//                   <p className="mb-0">This is a simplified payment process. In a real application, you would:</p>
//                   <ul className="mb-0">
//                     <li>Enter credit card details</li>
//                     <li>Verify payment through a secure gateway</li>
//                     <li>Receive a confirmation receipt</li>
//                     <li>Have buyer protection and escrow services</li>
//                   </ul>
//                 </div>

//                 <div className="row mt-4">
//                   <div className="col-md-6">
//                     <h5>Purchase Summary</h5>
//                     <table className="table">
//                       <tbody>
//                         <tr>
//                           <td>Property Price:</td>
//                           <td className="text-end">${property.price.toLocaleString()}</td>
//                         </tr>
//                         <tr>
//                           <td>Processing Fee:</td>
//                           <td className="text-end">$0</td>
//                         </tr>
//                         <tr className="table-active fw-bold">
//                           <td>Total Amount:</td>
//                           <td className="text-end">${property.price.toLocaleString()}</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 <div className="d-grid gap-2 mt-4">
//                   <button
//                     className="btn btn-primary btn-lg"
//                     onClick={handlePurchase}
//                   >
//                     Confirm Purchase
//                   </button>
//                   <Link
//                     to="/all-properties"
//                     className="btn btn-outline-secondary"
//                   >
//                     Cancel
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <footer className="bg-dark text-white text-center py-3 mt-5">
//         <p className="mb-0">© 2024 Haldoor Real Estate. All Rights Reserved.</p>
//       </footer>

//       {/* Password Change Modal */}
//       {showPasswordModal && (
//         <>
//           <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Change Password</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => {
//                       setShowPasswordModal(false);
//                       setNewPassword('');
//                       setPasswordError('');
//                     }}
//                     aria-label="Close"
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   {passwordError && (
//                     <div className="alert alert-danger" role="alert">
//                       {passwordError}
//                     </div>
//                   )}
//                   <div className="mb-3">
//                     <label htmlFor="newPassword" className="form-label">New Password</label>
//                     <input
//                       type="password"
//                       className="form-control"
//                       id="newPassword"
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       placeholder="Enter new password"
//                     />
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => {
//                       setShowPasswordModal(false);
//                       setNewPassword('');
//                       setPasswordError('');
//                     }}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     onClick={handlePasswordChange}
//                     disabled={!newPassword}
//                   >
//                     Change Password
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div 
//             className="modal-backdrop fade show" 
//             onClick={() => {
//               setShowPasswordModal(false);
//               setNewPassword('');
//               setPasswordError('');
//             }}
//           ></div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Payment; 