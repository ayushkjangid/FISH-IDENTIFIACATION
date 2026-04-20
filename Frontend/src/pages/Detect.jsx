import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt, FaFish, FaSearch, FaWater, FaUtensils, FaRuler, FaWeight, FaInfoCircle, FaThermometerHalf } from "react-icons/fa";

export default function Detect() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handlePredict = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const { data } = await axiosInstance.post("/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.error) {
        alert("ML Service Error: " + data.error);
      } else {
        setResult(data);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(to right, var(--text-primary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
          Identify Your Catch
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Upload a photo to instantly classify the fish species
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', width: '100%', maxWidth: '1200px' }}>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{ width: '100%' }}
        >
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            style={{
              border: `2px dashed ${dragActive ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
              borderRadius: '24px',
              padding: '3rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragActive ? 'rgba(6, 182, 212, 0.1)' : 'var(--glass-bg)',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.3s ease',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              style={{ display: 'none' }}
            />

            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxHeight: '250px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
                  />
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}
                      style={{ padding: '0.8rem 1.5rem', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', borderRadius: '12px' }}
                    >
                      Change Photo
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); handlePredict(); }}
                      disabled={loading}
                      style={{
                        padding: '0.8rem 2rem',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        border: 'none',
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: loading ? 0.7 : 1
                      }}
                    >
                      {loading ? 'Analyzing...' : <><FaSearch /> Identify</>}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="upload-prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <FaCloudUploadAlt size={64} color="var(--accent-primary)" style={{ marginBottom: '1.5rem' }} />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Drag & Drop Image</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>or click to browse</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scanning Overlay */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(15, 23, 42, 0.8)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                  zIndex: 10
                }}
              >
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--bg-surface)', borderTop: '4px solid var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <p style={{ marginTop: '1rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Analyzing features...</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Result Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '32px',
                  padding: '3rem',
                  maxWidth: '450px',
                  width: '100%',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }} />

                <div style={{ width: '100px', height: '100px', margin: '0 auto 2rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaFish size={48} color="var(--accent-primary)" />
                </div>

                <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Identified Species</h2>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                  {result.label || result.Predicted_Class}
                </h1>

                <div style={{ background: 'var(--bg-deep)', padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: result.fishDetails ? '1.5rem' : '0' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Confidence</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {result.confidence ? (result.confidence * 100).toFixed(1) : result["Confidence (%)"]}%
                  </span>
                </div>

                {/* Extended Details Section */}
                {result.fishDetails && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ textAlign: 'left', marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}
                  >
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaInfoCircle color="var(--accent-primary)" /> Species Details
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {result.fishDetails.scientific_name && (
                        <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '12px' }}>
                          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Scientific Name</span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{result.fishDetails.scientific_name}</span>
                        </div>
                      )}
                      {result.fishDetails.category && (
                        <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '12px' }}>
                          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Category</span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{result.fishDetails.category}</span>
                        </div>
                      )}
                      
                      {result.fishDetails.water_type && (
                        <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '12px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                            <FaWater /> Water Type
                          </span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{result.fishDetails.water_type}</span>
                        </div>
                      )}
                      {result.fishDetails.diet && (
                        <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '12px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                            <FaUtensils /> Diet
                          </span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{Array.isArray(result.fishDetails.diet) ? result.fishDetails.diet.join(', ') : result.fishDetails.diet}</span>
                        </div>
                      )}

                      {(result.fishDetails.avg_weight_g || result.fishDetails.avg_length_cm) && (
                        <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '12px', gridColumn: 'span 2', display: 'flex', justifyContent: 'space-around' }}>
                          {result.fishDetails.avg_weight_g && (
                             <div style={{ textAlign: 'center' }}>
                               <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                                 <FaWeight /> Avg Weight
                               </span>
                               <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{(result.fishDetails.avg_weight_g / 1000).toFixed(1)} kg</span>
                             </div>
                          )}
                          {result.fishDetails.avg_length_cm && (
                             <div style={{ textAlign: 'center' }}>
                               <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                                 <FaRuler /> Avg Length
                               </span>
                               <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{result.fishDetails.avg_length_cm} cm</span>
                             </div>
                          )}
                          {result.fishDetails.temperature_range_c && (
                             <div style={{ textAlign: 'center' }}>
                               <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                                 <FaThermometerHalf /> Temp Range
                               </span>
                               <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{result.fishDetails.temperature_range_c} °C</span>
                             </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}
              >
                <div style={{ fontSize: '4rem', opacity: 0.2, marginBottom: '1rem' }}>🐟</div>
                <p>Prediction results will appear here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}
