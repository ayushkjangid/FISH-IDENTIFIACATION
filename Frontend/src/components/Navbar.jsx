import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { FaFish, FaUser, FaSignOutAlt, FaBars, FaTimes, FaHome, FaCamera, FaInfoCircle } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext); // Destructure user here
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Detect", path: "/detect", icon: <FaCamera /> },
    { name: "About", path: "/about", icon: <FaInfoCircle /> },
    { name: "Profile", path: "/profile", icon: <FaUser /> },
  ];

  if (user && user.role === 'admin') {
    navLinks.push({ name: "Admin", path: "/admin", icon: <FaUser /> });
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      backdropFilter: 'blur(12px)',
      backgroundColor: 'var(--glass-bg)',
      borderBottom: '1px solid var(--glass-border)',
      padding: '1rem 2rem'
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.div
            whileHover={{ rotate: 15 }}
            style={{ fontSize: '2rem', color: 'var(--accent-primary)' }}
          >
            <FaFish />
          </motion.div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            AAIDES
          </h2>
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} style={{ position: 'relative' }}>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                color: location.pathname === link.path ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: 500
              }}>
                {link.name === "Profile" && user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-primary)' }}
                  />
                ) : link.icon}
                {link.name}
              </span>
              {location.pathname === link.path && (
                <motion.div
                  layoutId="underline"
                  style={{
                    position: 'absolute', bottom: '-4px', left: 0, right: 0,
                    height: '2px', background: 'var(--accent-primary)', borderRadius: '1px'
                  }}
                />
              )}
            </Link>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              border: 'none', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-md)',
              color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <FaSignOutAlt /> Logout
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', background: 'var(--bg-surface)', marginTop: '1rem', borderRadius: 'var(--radius-md)' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', color: 'var(--text-primary)' }}
                >
                  {link.icon} {link.name}
                </Link>
              ))}
              <hr style={{ borderColor: 'var(--glass-border)' }} />
              <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', color: '#ef4444', cursor: 'pointer' }}>
                <FaSignOutAlt /> Logout
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav >
  );
}
