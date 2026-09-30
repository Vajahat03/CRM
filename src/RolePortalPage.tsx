import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Sparkles, ArrowRight, Lock, KeyRound, CheckCircle2, ChevronRight, BarChart3, Users, Receipt, Database } from 'lucide-react';
import './RolePortalPage.css';
import { SecureVaultLock, SecureReportGateModal } from './SecureVaultLock';
import { ChangePinModal } from './ChangePinModal';
import { SupabaseClient } from '@supabase/supabase-js';

interface RolePortalPageProps {
  onSelectEmployee: () => void;
  onSelectOwner: () => void;
  onOpenChangePin?: () => void;
  customerCount: number;
  supabase?: SupabaseClient | null;
}

export function RolePortalPage({
  onSelectEmployee,
  onSelectOwner,
  onOpenChangePin,
  customerCount,
  supabase,
}: RolePortalPageProps) {
  const [showOwnerVaultModal, setShowOwnerVaultModal] = useState(false);
  const [showChangePin, setShowChangePin] = useState(false);

  const handleOpenPinModal = () => {
    if (onOpenChangePin) {
      onOpenChangePin();
    } else {
      setShowChangePin(true);
    }
  };

  return (
    <div className="role-portal-container">
      {/* Ambient background glow orbs */}
      <div className="portal-glow-orb orb-1" />
      <div className="portal-glow-orb orb-2" />

      <header className="portal-header">
        <div className="portal-brand">
          <div className="portal-brand-mark">
            <Sparkles size={24} />
          </div>
          <div>
            <h1>Al Uzer</h1>
            <span>COMMON SERVICES • CRM SUITE</span>
          </div>
        </div>
        <p className="portal-tagline">
          Select your role to access the workspace. Owner data is protected with cryptographic database security.
        </p>
      </header>

      <div className="portal-cards-grid">
        {/* EMPLOYEE PORTAL CARD */}
        <div className="portal-card employee-card">
          <div className="card-badge employee-badge">
            <UserCheck size={14} />
            <span>OPERATIONAL DESK</span>
          </div>

          <div className="card-icon-wrapper employee-icon">
            <UserCheck size={32} />
          </div>

          <h2>Employee Portal</h2>
          <p className="card-desc">
            Quick counter operations. Add new customer jobs, mark work status done, generate bills, and log daily counter collections.
          </p>

          <ul className="card-features-list">
            <li>
              <CheckCircle2 size={16} className="feature-icon check" />
              <span><strong>Add Customer Records</strong> & update work status</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="feature-icon check" />
              <span><strong>Log Kirkol & Spendings</strong> in real-time</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="feature-icon check" />
              <span><strong>Mark Payments & Settle Balance</strong> on the fly</span>
            </li>
            <li className="restricted-feature">
              <Lock size={15} className="feature-icon lock" />
              <span>Financial reports, profits & record deletion locked</span>
            </li>
          </ul>

          <button
            className="portal-action-btn employee-btn"
            onClick={onSelectEmployee}
          >
            <span>Enter as Employee</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* OWNER PORTAL CARD */}
        <div className="portal-card owner-card">
          <div className="card-badge owner-badge">
            <ShieldCheck size={14} />
            <span>EXECUTIVE ACCESS</span>
          </div>

          <div className="card-icon-wrapper owner-icon">
            <ShieldCheck size={32} />
          </div>

          <h2>Owner & Admin Vault</h2>
          <p className="card-desc">
            Full administrative authority. View real profit margins, delete/edit records, analytics, and change database password/PIN.
          </p>

          <ul className="card-features-list">
            <li>
              <CheckCircle2 size={16} className="feature-icon emerald" />
              <span><strong>Complete Unrestricted Access</strong> to all pages</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="feature-icon emerald" />
              <span><strong>Financial Profit Margins</strong> & Monthly PDF Reports</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="feature-icon emerald" />
              <span><strong>Edit & Delete Records</strong> with 1-click controls</span>
            </li>
            <li
              style={{ cursor: 'pointer' }}
              onClick={handleOpenPinModal}
              title="Click to change your Owner Security PIN / Password"
            >
              <KeyRound size={16} className="feature-icon emerald" />
              <span>
                <strong style={{ color: '#00ff88', textDecoration: 'underline' }}>
                  Change Security PIN / Password
                </strong>{' '}
                (Saved in Database)
              </span>
            </li>
          </ul>

          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <button
              className="portal-action-btn owner-btn"
              onClick={() => setShowOwnerVaultModal(true)}
              style={{ flex: 1 }}
            >
              <KeyRound size={18} />
              <span>Unlock Owner Portal</span>
              <ChevronRight size={18} />
            </button>
            <button
              type="button"
              onClick={handleOpenPinModal}
              className="portal-action-btn"
              style={{
                background: 'rgba(0, 255, 136, 0.12)',
                border: '1px solid rgba(0, 255, 136, 0.4)',
                color: '#00ff88',
                padding: '0 14px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
              title="Change Password / PIN stored in database"
            >
              <KeyRound size={15} />
              <span>Change PIN</span>
            </button>
          </div>
        </div>
      </div>

      <footer className="portal-footer">
        <div className="footer-stats">
          <span>💼 Active Records: <strong>{customerCount} Customers</strong></span>
          <span>•</span>
          <span>🛡️ Database Synced Security</span>
          <span>•</span>
          <button
            onClick={handleOpenPinModal}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#38bdf8',
              cursor: 'pointer',
              fontSize: '12px',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            🔑 Change Security PIN
          </button>
        </div>
      </footer>

      {/* Owner PIN Unlock Modal with Neon Emerald Lock & Eruption */}
      {showOwnerVaultModal && (
        <SecureReportGateModal
          isOpen={showOwnerVaultModal}
          onClose={() => setShowOwnerVaultModal(false)}
          onSuccess={() => {
            setShowOwnerVaultModal(false);
            onSelectOwner();
          }}
        />
      )}

      {showChangePin && (
        <ChangePinModal
          isOpen={showChangePin}
          onClose={() => setShowChangePin(false)}
          onSuccess={() => {
            setShowChangePin(false);
          }}
          supabase={supabase}
        />
      )}
    </div>
  );
}
