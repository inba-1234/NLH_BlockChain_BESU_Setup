import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import registerservice from "./FireStore/services/registerservice";

function Register() {
  
  const navigate = useNavigate();
  
  // Register form state
  const [username, setUsername] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [regId, setRegId] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerRole, setRegisterRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Register form references to maintain focus
  const usernameRef = useRef(null);
  const companyNameRef = useRef(null);
  const regIdRef = useRef(null);
  const aadharRef = useRef(null);
  const registerRoleRef = useRef(null);
  const registerPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleRegister = async(e) => {
    e.preventDefault();
    console.log("Register with:", registerRole === '1' ? username : companyName);
    
    // Check password match before proceeding
    if (registerPassword !== confirmPassword) {
      alert("Passwords do not match!");
      confirmPasswordRef.current?.focus();
      return;
    }

    // Validate role-specific fields
    if (registerRole === '1') {
      if (!username.trim()) {
        alert("Username is required for Civilian role!");
        usernameRef.current?.focus();
        return;
      }
      if (!aadhar.trim()) {
        alert("Aadhar number is required for Civilian role!");
        aadharRef.current?.focus();
        return;
      }
    }

    if (registerRole === '2' && (!companyName.trim() || !regId.trim())) {
      alert("Company Name and Registration ID are required for Company role!");
      if (!companyName.trim()) companyNameRef.current?.focus();
      else regIdRef.current?.focus();
      return;
    }
    
    try {
      await registerservice.addUser({
        name: registerRole === '1' ? username : companyName,
        regID: registerRole === '1' ? aadhar : regId,
        password: registerPassword,
        role: registerRole,
        key: "",
        address: "",
        generate: 0,
      });
      const user = await registerservice.getUsers();
      console.log(user);

      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration failed. Please try again.");
      return; 
    }
  };

  const getRoleIcon = (role) => {
    return role === '1' ? 'bi-person-circle' : 'bi-building-fill';
  };

  const getRoleColor = (role) => {
    return role === '1' ? 'primary' : 'success';
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-sm border-0 rounded-3">
              
              {/* Header */}
              <div className={`card-header text-white text-center py-4 border-0 rounded-top-3`}
                   style={{
                     background: registerRole ? 
                       (registerRole === '1' ? '#0d6efd' : '#198754') :
                       '#6c757d'
                   }}>
                <div className="mb-2">
                  <i className={`bi ${registerRole ? getRoleIcon(registerRole) : 'bi-person-plus'} fs-1`}></i>
                </div>
                <h3 className="fw-bold mb-1">Create Account</h3>
                <p className="mb-0 opacity-90">
                  {registerRole === '1' ? 'Join as a Civilian' : 
                   registerRole === '2' ? 'Register your Company' : 
                   'Choose your registration type'}
                </p>
              </div>

              <div className="card-body p-5">
                <form onSubmit={handleRegister}>
                  
                  {/* Role Selection */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-3">
                      <i className="bi bi-person-badge me-2"></i>Select Your Role
                    </label>
                    <div className="row g-3">
                      <div className="col-6">
                        <input 
                          type="radio" 
                          className="btn-check" 
                          name="role" 
                          id="civilian" 
                          value="1"
                          onChange={(e) => setRegisterRole(e.target.value)}
                        />
                        <label className="btn btn-outline-primary w-100 py-3 h-100 d-flex flex-column justify-content-center" 
                               htmlFor="civilian">
                          <i className="bi bi-person-circle fs-2 mb-2"></i>
                          <div className="fw-bold">Civilian</div>
                          <small className="text-muted">Individual User</small>
                        </label>
                      </div>
                      <div className="col-6">
                        <input 
                          type="radio" 
                          className="btn-check" 
                          name="role" 
                          id="company" 
                          value="2"
                          onChange={(e) => setRegisterRole(e.target.value)}
                        />
                        <label className="btn btn-outline-success w-100 py-3 h-100 d-flex flex-column justify-content-center" 
                               htmlFor="company">
                          <i className="bi bi-building-fill fs-2 mb-2"></i>
                          <div className="fw-bold">Company</div>
                          <small className="text-muted">Organization</small>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Form Fields */}
                  {registerRole && (
                    <div className="border-top pt-4">
                      
                      {registerRole === '1' && (
                        <>
                          <div className="mb-3">
                            <label htmlFor="username" className="form-label fw-semibold text-primary">
                              <i className="bi bi-person me-2"></i>Username
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-primary text-white border-primary">
                                <i className="bi bi-person-fill"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control border-primary"
                                id="username"
                                ref={usernameRef}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label htmlFor="aadhar" className="form-label fw-semibold text-primary">
                              <i className="bi bi-credit-card me-2"></i>Aadhar Number
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-primary text-white border-primary">
                                <i className="bi bi-credit-card"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control border-primary"
                                id="aadhar"
                                ref={aadharRef}
                                value={aadhar}
                                onChange={(e) => setAadhar(e.target.value)}
                                placeholder="Enter your Aadhar number"
                                maxLength="12"
                                pattern="[0-9]{12}"
                                required
                              />
                            </div>
                            <div className="form-text">Enter 12-digit Aadhar number</div>
                          </div>
                        </>
                      )}

                      {registerRole === '2' && (
                        <>
                          <div className="mb-3">
                            <label htmlFor="companyName" className="form-label fw-semibold text-success">
                              <i className="bi bi-building me-2"></i>Company Name
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-success text-white border-success">
                                <i className="bi bi-building-fill"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control border-success"
                                id="companyName"
                                ref={companyNameRef}
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Enter your company name"
                                required
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label htmlFor="regId" className="form-label fw-semibold text-success">
                              <i className="bi bi-card-heading me-2"></i>Registration ID
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-success text-white border-success">
                                <i className="bi bi-hash"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control border-success"
                                id="regId"
                                ref={regIdRef}
                                value={regId}
                                onChange={(e) => setRegId(e.target.value)}
                                placeholder="Enter company registration ID"
                                required
                              />
                            </div>
                            <div className="form-text">Enter your official company registration number</div>
                          </div>
                        </>
                      )}

                      {/* Password Fields */}
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="registerPassword" className={`form-label fw-semibold text-${getRoleColor(registerRole)}`}>
                            <i className="bi bi-lock me-2"></i>Password
                          </label>
                          <div className="input-group">
                            <span className={`input-group-text bg-${getRoleColor(registerRole)} text-white border-${getRoleColor(registerRole)}`}>
                              <i className="bi bi-lock-fill"></i>
                            </span>
                            <input
                              type={showPassword ? "text" : "password"}
                              className={`form-control border-${getRoleColor(registerRole)}`}
                              id="registerPassword"
                              ref={registerPasswordRef}
                              value={registerPassword}
                              onChange={(e) => setRegisterPassword(e.target.value)}
                              placeholder="Create password"
                              minLength="6"
                              required
                            />
                            <button
                              type="button"
                              className={`btn btn-outline-${getRoleColor(registerRole)}`}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                          </div>
                          <div className="form-text">Minimum 6 characters</div>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label htmlFor="confirmPassword" className={`form-label fw-semibold text-${getRoleColor(registerRole)}`}>
                            <i className="bi bi-shield-lock me-2"></i>Confirm Password
                          </label>
                          <div className="input-group">
                            <span className={`input-group-text bg-${getRoleColor(registerRole)} text-white border-${getRoleColor(registerRole)}`}>
                              <i className="bi bi-shield-lock-fill"></i>
                            </span>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className={`form-control border-${getRoleColor(registerRole)}`}
                              id="confirmPassword"
                              ref={confirmPasswordRef}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm password"
                              required
                            />
                            <button
                              type="button"
                              className={`btn btn-outline-${getRoleColor(registerRole)}`}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-grid gap-2 mt-4">
                        <button 
                          type="submit" 
                          className={`btn btn-${getRoleColor(registerRole)} btn-lg py-2 fw-bold`}>
                          <i className="bi bi-person-plus-fill me-2"></i>
                          Create {registerRole === '1' ? 'Civilian' : 'Company'} Account
                        </button>
                      </div>
                    </div>
                  )}
                  
                </form>
              </div>
              
              <div className="card-footer bg-white border-top text-center py-3">
                <p className="mb-2 text-muted">
                  Already have an account?
                  <Link to="/login" className="text-decoration-none fw-semibold ms-1">
                    Login here
                  </Link>
                </p>
                <button className="btn btn-outline-primary btn-sm mt-2" onClick={() => navigate('/login')}>
                  Go to Login Page
                </button>
                <small className="text-muted d-block mt-2">
                  <i className="bi bi-shield-check me-1"></i>
                  Secured by Blockchain Technology
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-check:checked + label {
          transform: none;
          box-shadow: 0 0 0 0.125rem rgba(var(--bs-primary-rgb), 0.25);
        }
        
        .input-group-text {
          min-width: 45px;
          justify-content: center;
        }
        
        .form-control:focus {
          box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
        }
        
        .card {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .role-card {
          transition: all 0.2s ease-in-out;
        }
        
        .role-card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

export default Register;