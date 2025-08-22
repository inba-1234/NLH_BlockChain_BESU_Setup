import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import registerservice from "./FireStore/services/registerservice";

const UserAccount = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [privateKey, setPrivateKey] = useState("");
  const [loading, setLoading] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login"); // if no user, redirect back
    }
  }, [navigate]);

  // Generate account for user
  const generateAccount = async () => {
    try {
      setLoading(true);
      const web3 = new Web3();
      const account = web3.eth.accounts.create();

      // Save private key locally (do not send to backend for security)
      setPrivateKey(account.privateKey);

      // Update Firestore
      await registerservice.updateUser(user.id, {
        address: account.address,
        generate: 1,
      });

      // Update local user
      const updatedUser = { ...user, address: account.address, generate: 1 };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setLoading(false);
    } catch (err) {
      console.error("Error generating account:", err);
      setLoading(false);
    }
  };

  if (!user) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "500px", borderRadius: "15px" }}>
        <h3 className="text-center mb-3">User Account</h3>

        <p><strong>Email:</strong> {user.regID}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Account Address:</strong> {user.address || "Not generated yet"}</p>

        {privateKey && (
          <div className="alert alert-warning mt-3">
            <strong>Private Key:</strong> {privateKey}  
            <br />
            ⚠️ Save this securely! You won’t see it again.
          </div>
        )}

        {user.generate !== 1 ? (
          <button 
            className="btn btn-success w-100 mt-3"
            onClick={generateAccount}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Blockchain Account"}
          </button>
        ) : (
          <div className="alert alert-info mt-3">
            Account already generated ✅
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount;
