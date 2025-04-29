import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PiDogLight } from "react-icons/pi";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      setError("Please enter both name and email.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
          credentials: "include",
        }
      );

      if (response.ok) {
        login({ name, email });
        setEmail("");
        setName("");
        navigate("/search");
      } else {
        setError("Invalid login credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <div className={styles.formHeading}>
          <h5 className="text-shadow-xs">
            Every Hero Needs a Sidekick – Adopt!
          </h5>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="name">
            Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your name"
            value={name}
            name="name"
            id="name"
            type="text"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            name="email"
            id="email"
            type="email"
          />
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <button disabled={isLoading} className={styles.submit} type="submit">
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
