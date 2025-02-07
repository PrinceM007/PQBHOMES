import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useUser } from "../../contexts/UserContext";

const Login = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const url = isSignUp
      ? "http://localhost:5000/api/auth/signup"
      : "http://localhost:5000/api/auth/login";

    try {
      const payload = isSignUp
        ? {
            fullName: formData.fullName,
            email: formData.email,
            username: formData.username,
            password: formData.password,
          }
        : {
            username: formData.username,
            password: formData.password,
          };

      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (isSignUp) {
        alert("Sign Up successful! Please log in.");
        setIsSignUp(false);
        setShowAuthModal(false);
      } else {
        const { user } = response.data;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          login(user);
          navigate("/home");
        }
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "An error occurred. Please try again.";
      setErrorMessage(errMsg);
    }
  };

  return (
    <div className="landing-page">
      {/* Landing Page Content */}
      <header className="landing-header">
        <nav>
         
          <button className="auth-trigger" onClick={() => setShowAuthModal(true)}>
            Get Started
          </button>
        </nav>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <h1>Welcome to PQB Homes</h1>
          <p>Experience luxury living at its finest</p>
          <button className="cta-button" onClick={() => setShowAuthModal(true)}>
            Start Your Journey
          </button>
        </div>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-modal">
          <div className="modal-backdrop" onClick={() => setShowAuthModal(false)}></div>
          
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowAuthModal(false)}>
              &times;
            </button>

            <h2>{isSignUp ? "Create Account" : "Welcome Back"}</h2>
            
            <form onSubmit={handleFormSubmit}>
              {isSignUp && (
                <>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </>
              )}
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              
              <button type="submit" className="auth-submit">
                {isSignUp ? "Sign Up" : "Login"}
              </button>
            </form>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="auth-switch">
              {isSignUp ? "Already have an account?" : "Need an account?"}
              <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Login" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;