import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', type = 'info' }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)'
            }} onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--glass-border)',
                        padding: '2rem',
                        borderRadius: '16px',
                        maxWidth: '400px',
                        width: '90%',
                        textAlign: 'center',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                    }}
                >
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>{title}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{message}</p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '0.8rem 1.5rem',
                                background: 'transparent',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--text-secondary)',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            style={{
                                padding: '0.8rem 1.5rem',
                                background: type === 'danger' ? '#ef4444' : 'var(--accent-primary)',
                                border: 'none',
                                color: 'white',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmationModal;
