import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, CheckCircle2, AlertCircle, Phone, MapPin, Mail, ShieldCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import ProfilePhotoUploader from '../../components/common/ProfilePhotoUploader';

const AdminProfile = () => {
  const { user, updateProfile, changePassword } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    address: user?.address || '',
    profileImage: user?.profileImage || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      setProfileError('');
      setProfileSuccess('');
      await updateProfile(profileData);
      setProfileSuccess('Admin profile saved successfully!');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      setChangingPass(true);
      setPasswordError('');
      setPasswordSuccess('');
      await changePassword(passwordData);
      setPasswordSuccess('Admin credentials updated securely!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '1050px' }} className="profile-grid">
      {/* Profile Details Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Administrator Profile
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', margin: '2px 0 0' }}>
              Manage your personal identity and platform contact details
            </p>
          </div>
          <span className="badge badge-primary">Platform Admin</span>
        </div>

        {profileSuccess && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#34d399', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} /> {profileSuccess}
          </div>
        )}

        {profileError && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {profileError}
          </div>
        )}

        {/* Dedicated Computer Photo Uploader */}
        <ProfilePhotoUploader
          currentImage={profileData.profileImage}
          userName={profileData.name}
          onImageChange={(newImage) => setProfileData({ ...profileData, profileImage: newImage })}
        />

        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Full Legal Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone Number</label>
            <input
              type="tel"
              required
              className="form-input"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Headquarters / Office Address</label>
            <input
              type="text"
              className="form-input"
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bio / Operational Summary</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            loading={updatingProfile}
            loadingText="Saving..."
            variant="primary"
            style={{ marginTop: '0.5rem' }}
          >
            Save Admin Profile
          </Button>
        </form>
      </div>

      {/* Security & Password Form */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Admin Authentication & Security
        </h3>

        {passwordSuccess && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#34d399', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} /> {passwordSuccess}
          </div>
        )}

        {passwordError && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Current Master Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="form-input"
              placeholder="Min 6 characters"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="form-input"
              placeholder="Re-enter new password"
              value={passwordData.confirmNewPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            loading={changingPass}
            loadingText="Updating Password..."
            variant="secondary"
            style={{ marginTop: '0.5rem' }}
          >
            Update Credentials
          </Button>
        </form>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminProfile;
