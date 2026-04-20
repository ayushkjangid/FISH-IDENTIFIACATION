import React, { useContext, useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { AuthContext } from "../context/AuthContext";
import { getUserPredictions, uploadAvatar } from "../api";
import { FaCamera, FaUser } from "react-icons/fa";
import "./Profile.css";

export default function Profile() {
  const { user, login } = useContext(AuthContext); // login needed to update user context
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getUserPredictions();
        setPredictions(data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const handleAvatarChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('avatar', e.target.files[0]);

      try {
        const res = await uploadAvatar(formData);
        // res.user contains the updated user object with new avatar URL
        // We need to update the auth context
        const token = localStorage.getItem('token');
        login({ user: res.user, token });
      } catch (err) {
        alert("Failed to upload avatar");
      }
    }
  };

  // Process predictions for charts
  // Group by date and calculate average confidence
  const chartData = React.useMemo(() => {
    if (!predictions.length) return [];

    // Sort by date ascending for the chart
    const sorted = [...predictions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Take last 10 predictions for readability
    const recent = sorted.slice(-10);

    return recent.map((p, index) => ({
      name: new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      accuracy: (p.confidence * 100).toFixed(1),
    }));
  }, [predictions]);

  return (
    <>
      <div className="profile-container">

        {/* Header Profile Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px' }}>
            <div style={{
              width: '100px', height: '100px',
              borderRadius: '50%', overflow: 'hidden',
              border: '3px solid var(--accent-primary)',
              background: 'var(--bg-surface)',
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <FaUser size={40} color="var(--text-secondary)" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current.click()}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                background: 'var(--accent-secondary)', border: 'none',
                width: '32px', height: '32px', borderRadius: '50%',
                color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center',
                cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
              }}
            >
              <FaCamera size={14} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
              accept="image/*"
            />
          </div>
          <div>
            <h1 className="profile-title" style={{ margin: 0 }}>{user?.name || user?.email}</h1>
            <p className="profile-subtitle" style={{ margin: 0 }}>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
            {user?.role === 'admin' && <span style={{ background: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', marginTop: '5px', display: 'inline-block' }}>Admin</span>}
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <h3>Total Predictions</h3>
            <p>{predictions.length}</p>
          </div>
          <div className="kpi-card">
            <h3>Average Confidence</h3>
            <p>
              {predictions.length > 0
                ? (predictions.reduce((acc, curr) => acc + (curr.confidence || 0), 0) / predictions.length * 100).toFixed(1)
                : 0}%
            </p>
          </div>
          <div className="kpi-card">
            <h3>Last Species</h3>
            <p>{predictions.length > 0 ? predictions[0].species : "N/A"}</p>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="chart-section">
          <h2>Prediction Confidence Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="#0077b6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="chart-section">
          <h2>Confidence Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#00b4d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RECENT DETECTIONS */}
        <div className="recent-detections">
          <h2>Recent Detections</h2>
          {loading ? (
            <p>Loading history...</p>
          ) : predictions.length === 0 ? (
            <p>No History Found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Species</th>
                  <th>Confidence</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((item) => (
                  <tr key={item._id}>
                    <td>
                      {item.fileUrl ? (
                        <img src={item.fileUrl} alt="Catch" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                      ) : (
                        <div style={{ width: '50px', height: '50px', background: '#334155', borderRadius: '8px' }} />
                      )}
                    </td>
                    <td>{item.species}</td>
                    <td>{item.confidence ? (item.confidence * 100).toFixed(1) + "%" : "N/A"}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
