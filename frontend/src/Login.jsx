import React, { useState } from "react";
// import "./autopost.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
function Login() {
  const [username, setUserName] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isUpdateRegister, setIsUpdateRegister] = useState(null);
  const [password,setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      setIsUpdateRegister("Username and password are required");
      alert("Username and password are required")
      return;
    }
 setLoading(true); 
    e.preventDefault();
    axios.post("http://localhost:7800/login", {
      username,
      password
    })
    .then((res) => {
      setLoading(false);
       
        if (res.data.message === 'OTP sent to your registered email') {
          alert("OTP has been sent to your registered email.");
          setIsOtpSent(true);
        } else {
          setIsUpdateRegister("Invalid username/password");
        }
    })
    .catch((error) => {
      setLoading(false); 
      console.error("Error during login:", error);
      setIsUpdateRegister("Internal Server Error");
      alert("this user is not valid please have a account and login")
    });
  }

    // Handle OTP verification
    function handleOtpVerification(e) {
      e.preventDefault();
      if (!otp) {
        alert("Please enter the OTP sent to your email.");
        return;
      }
  
      setLoading(true);
      axios.post("http://localhost:7800/verify-otp", { username, otp })
        .then((res) => {
          setLoading(false);
          if (res.data.message === 'OTP verified. Login successful') {
            alert("Login successful!");
            setIsOtpVerified(true);
            window.location.href = "/home"; // Redirect to home after successful login
          } else {
            alert("Invalid OTP. Please try again.");
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error verifying OTP:", error);
          alert("Failed to verify OTP. Please try again.");
        });
    }
  
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
          fontSize: "24px", 
        }}
      >
        WELCOME TO login
      </div>

      <div className="SIGN-UP">
        <h2>lOGIN</h2>
        {!isOtpSent ? (
        <form  onSubmit={handleSubmit}>
          <div className="formlogin">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        
          <div className="formlogin">
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="formlogin">
        
        <button type='submit' disabled={loading}>
          {loading ? 'Logging in...' : 'Submit'}
        </button>
          </div>
        </form>   

) : (
  // OTP verification form
  <form onSubmit={handleOtpVerification}>
    <div className="formlogin">
      <input
        type="text"
        id="otp"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
    </div>
    <div className="formlogin">
      <button type="submit" disabled={loading}>
        {loading ? 'Verifying OTP...' : 'Verify OTP'}
      </button>
    </div>
  </form>
)}
      {isUpdateRegister && <p>{isUpdateRegister}</p>}
        <div className="creatNew">
            <NavLink to="/signin">
        <button className="newAccount">Create New Account</button>
        </NavLink>
      </div>
      </div>


    </>
  );
}

export default Login;
