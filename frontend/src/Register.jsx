import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [role, setRole] = useState("");
  const [isUpdateRegister, setIsUpdateRegister] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setPasswordError(null);
    setIsUpdateRegister(null);

    if (password !== cpassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setLoading(true);

    axios.post("http://localhost:7800/register", {
      name,
      username,
      email,
      password,
      role,
    })
      .then((res) => {
        setLoading(false);
        if (res.status === 200 && res.data === true) {
          navigate("/"); // Redirect to home page on success
          setIsUpdateRegister("Registration successful. Now open the login page.");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        if (err.response?.status === 400 && err.response?.data?.message === 'Email already exists. Please use a different one.') {
          alert('This email is already registered. Please use a different email address.');
        } else {
          const message = err.response?.data?.message || "Registration failed. Please try again.";
          setIsUpdateRegister(message);
        }
      });
  }

  return (
    <div id="wrapper">
      {isUpdateRegister && <p className="alert">{isUpdateRegister}</p>}
      <h2>Form Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="formregister">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="formregister">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="formregister">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="formregister">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="formregister">
          <label htmlFor="cpassword">Confirm Password</label>
          <input
            type="password"
            name="cpassword"
            placeholder="Confirm password"
            value={cpassword}
            onChange={(e) => setCPassword(e.target.value)}
            required
          />
          {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        </div>
        <div className="formregister">
          <label htmlFor="role">Role</label>
          <select name="role" id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="superAdmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Submit'}
        </button>
      </form>
      <br />
      <div className="formregister">
        <NavLink to="/">
          <a href="">Already Have an Account</a>
        </NavLink>
      </div>
    </div>
  );
}

export default Register;
