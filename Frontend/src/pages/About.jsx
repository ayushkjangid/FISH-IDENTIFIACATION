import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance";
import { FaFish, FaUsers, FaCamera } from "react-icons/fa";

const StatCard = ({ icon, title, value, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!value || value === 0) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '24px',
        padding: '2rem',
        textAlign: 'center',
        flex: 1,
        minWidth: '250px'
      }}
    >
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '1rem', borderRadius: '50%' }}>
          {icon}
        </div>
      </div>
      <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.5rem 0' }}>
        {count.toLocaleString()}{suffix}
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {title}
      </p>
    </motion.div>
  );
};

export default function About() {
  const [stats, setStats] = useState({ totalPredictions: 0, totalUsers: 0, totalSpecies: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get('/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ padding: '6rem 2rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '5rem' }}
        >
          <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-primary)', borderRadius: '100px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            Our Mission
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 800, background: 'linear-gradient(to right, var(--text-primary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Empowering Marine Research with AI
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: 1.8 }}>
            AAIDES (Animal Identification and Detection of Species) bridges the gap between traditional marine biology and cutting-edge artificial intelligence. We process thousands of dynamic features to accurately classify marine life instantly.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', width: '100%', maxWidth: '1000px', justifyContent: 'center' }}
        >
          <StatCard 
            icon={<FaCamera size={36} color="var(--accent-primary)" />} 
            title="Catches Identified" 
            value={stats.totalPredictions > 0 ? stats.totalPredictions : 0} 
            suffix="+" 
          />
          <StatCard 
            icon={<FaFish size={36} color="var(--accent-primary)" />} 
            title="Species Supported" 
            value={stats.totalSpecies > 0 ? stats.totalSpecies : 0} 
          />
          <StatCard 
            icon={<FaUsers size={36} color="var(--accent-primary)" />} 
            title="Active Researchers" 
            value={stats.totalUsers > 0 ? stats.totalUsers : 0} 
          />
        </motion.div>
      </div>
    </div>
  );
}
