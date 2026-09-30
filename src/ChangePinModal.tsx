import React, { useState, useEffect } from 'react';
import { KeyRound, Check, X, ShieldCheck, AlertCircle, Database, Lock, RefreshCw } from 'lucide-react';
import { SupabaseClient } from '@supabase/supabase-js';
import { getOwnerPin, setOwnerPin, verifyOwnerPin, fetchOwnerPinFromDb } from './securityService';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supabase?: SupabaseClient | null;
};

export function ChangePinModal({ isOpen, onClose, onSuccess, supabase }: Props) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');

      // Refresh live PIN from Supabase silently
      void fetchOwnerPinFromDb(supabase);
    }
  }, [isOpen, supabase]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanCurrent = currentPin.trim();
    const cleanNew = newPin.trim();
    const cleanConfirm = confirmPin.trim();

    // Verify current PIN strictly without ever exposing it
    const actualCurrentPin = getOwnerPin();
    if (cleanCurrent !== actualCurrentPin && !verifyOwnerPin(cleanCurrent)) {
      setErrorMsg('Current PIN / Password is incorrect.');
      return;
    }

    if (cleanNew.length < 4 || cleanNew.length > 20) {
      setErrorMsg('New PIN / Password must be between 4 and 20 characters.');
      return;
    }

    if (cleanNew !== cleanConfirm) {
      setErrorMsg('New PIN and Confirm PIN do not match.');
      return;
    }

    setIsSaving(true);
    try {
      const saved = await setOwnerPin(cleanNew, supabase);
      if (saved) {
        setSuccessMsg('Security PIN / Password updated and saved to Database!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setErrorMsg('Failed to save PIN. Please try again.');
      }
    } catch (err) {
      console.error('Save PIN error:', err);
      setErrorMsg('Failed to save to database. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        zIndex: 99999,
        background: 'rgba(5, 10, 8, 0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: 'linear-gradient(155deg, #13241b 0%, #0a140f 100%)',
          border: '1px solid rgba(0, 255, 136, 0.35)',
          borderRadius: '24px',
          padding: '28px 24px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 30px rgba(0, 255, 136, 0.15)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            color: '#94a3b8',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="Cancel"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'rgba(0, 255, 136, 0.15)',
              border: '1px solid rgba(0, 255, 136, 0.4)',
              color: '#00ff88',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 0 16px rgba(0, 255, 136, 0.25)',
            }}
          >
            <KeyRound size={24} />
          </div>
          <h3 style={{ color: '#ffffff', fontSize: '19px', fontWeight: 800, margin: '0 0 6px' }}>
            Change Owner PIN / Password
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '12.5px', margin: 0 }}>
            Enter your current and new credentials. Saved securely in Supabase database.
          </p>
        </div>

        {/* Database Auto-Sync Badge */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '10px',
            padding: '8px 12px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11.5px',
            color: '#a7f3d0',
          }}
        >
          <Database size={14} style={{ color: '#34d399', flexShrink: 0 }} />
          <span>
            Database Storage: <code>public.app_security</code> (Masked & Protected)
          </span>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '14px',
            }}
          >
            <AlertCircle size={15} /> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: '#6ee7b7',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '14px',
            }}
          >
            <ShieldCheck size={15} /> {successMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          autoComplete="off"
        >
          {/* Current PIN - strictly masked */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              Current PIN / Password
            </label>
            <input
              type="password"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '16px',
                letterSpacing: '4px',
                boxSizing: 'border-box',
              }}
              autoComplete="current-password"
              required
              autoFocus
            />
          </div>

          {/* New PIN - strictly masked */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              New PIN / Password (4 - 20 characters)
            </label>
            <input
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '16px',
                letterSpacing: '4px',
                boxSizing: 'border-box',
              }}
              autoComplete="new-password"
              required
            />
          </div>

          {/* Confirm New PIN - strictly masked */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              Confirm New PIN / Password
            </label>
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '16px',
                letterSpacing: '4px',
                boxSizing: 'border-box',
              }}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            style={{
              marginTop: '6px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: '1px solid rgba(52, 211, 153, 0.5)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)',
            }}
          >
            {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
            <span>{isSaving ? 'Saving to Database...' : 'Save & Sync to Database'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
