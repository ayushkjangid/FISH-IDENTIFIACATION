import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaFish } from "react-icons/fa";
import FishBackground from "../components/FishBackground";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser({ name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed");
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', position: 'relative' }}>
      <FishBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--glass-border)',
          padding: '3rem',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: 'var(--glass-shadow)',
          textAlign: 'center'
        }}
      >
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            background: 'var(--accent-primary)',
            padding: '1rem',
            borderRadius: '50%',
            display: 'flex',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'
          }}>
            <FaFish size={32} color="white" />
          </div>
        </div>

        <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: 700 }}>Join Us</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Create your account today</p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ position: 'relative' }}>
            <FaUser style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.9rem 1rem 0.9rem 3rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <FaEnvelope style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.9rem 1rem 0.9rem 3rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <FaLock style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.9rem 1rem 0.9rem 3rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={{
              padding: '1rem',
              background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              marginTop: '0.5rem',
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
            }}
          >
            Sign Up
          </motion.button>
        </form>

        <p style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
