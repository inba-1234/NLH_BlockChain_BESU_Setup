import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import registerservice from "./FireStore/services/registerservice";

function Login() {
  const navigate = useNavigate();

  const [regID, setRegID] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const regIDRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError("Please select your role.");
      return;
    }

    try {
  const user = await registerservice.loginUser(regID, password, role);
  console.log("Logged in user:", user);

  // Store user details in localStorage
  localStorage.setItem("user", JSON.stringify(user));

  console.log(`Welcome ${user.name}!`);
  navigate("/dashboard");  // redirect after login
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-header bg-dark text-white text-center py-3 rounded-top-3">
                <i className="bi bi-box-arrow-in-right fs-1"></i>
                <h3 className="fw-bold mt-2 mb-0">Login</h3>
              </div>

              <div className="card-body p-4">
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleLogin}>
                  
                  {/* Role Selection */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Select Role</label>
                    <div className="d-flex gap-3">
                      <div>
                        <input
                          type="radio"
                          className="btn-check"
                          name="role"
                          id="civilian"
                          value="1"
                          onChange={(e) => setRole(e.target.value)}
                        />
                        <label className="btn btn-outline-primary" htmlFor="civilian">
                          <i className="bi bi-person-circle me-1"></i> Civilian
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          className="btn-check"
                          name="role"
                          id="company"
                          value="2"
                          onChange={(e) => setRole(e.target.value)}
                        />
                        <label className="btn btn-outline-success" htmlFor="company">
                          <i className="bi bi-building-fill me-1"></i> Company
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* regID field */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      {role === '1' ? "Aadhar Number" : role === '2' ? "Company Registration ID" : "User ID"}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      ref={regIDRef}
                      value={regID}
                      onChange={(e) => setRegID(e.target.value)}
                      placeholder={role === '1' ? "Enter your Aadhar Number" : "Enter your Registration ID"}
                      required
                    />
                  </div>

                  {/* Password field */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        ref={passwordRef}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Login button */}
                  <div className="d-grid">
                    <button type="submit" className="btn btn-dark btn-lg fw-bold">
                      <i className="bi bi-box-arrow-in-right me-2"></i> Login
                    </button>
                  </div>
                </form>
              </div>

              <div className="card-footer bg-white text-center py-3">
                <p className="mb-0">
                  Don’t have an account?{" "}
                  <a href="/register" className="fw-semibold text-decoration-none">
                    Register here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
