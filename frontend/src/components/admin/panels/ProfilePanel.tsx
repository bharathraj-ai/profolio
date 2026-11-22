import React, { useEffect, useRef, useState } from 'react';
import { adminService } from '../../../api/adminService';
import { ProfileData } from '../../../types/api';
import { getImageUrl } from '../../../utils/imageUrl';

export function ProfilePanel() {
  const [profile, setProfile] = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    adminService.getProfile()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setMessage({ text: err.message || 'Failed to load profile', type: 'error' });
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);
    try {
      const updatedProfile = await adminService.uploadAvatar(file);
      setProfile(updatedProfile);
      setMessage({ text: 'Profile photo uploaded and saved successfully!', type: 'success' });
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      setMessage({ text: errObj.response?.data?.message || errObj.message || 'Failed to upload photo', type: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated = await adminService.updateProfile(profile);
      setProfile(updated);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setMessage({ text: errObj.message || 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="section-loading">Loading profile settings...</div>;

  return (
    <div className="admin-panel">
      <h2>Profile Information</h2>
      {message && (
        <div className={message.type === 'success' ? 'form-status form-status--success' : 'section-error'} style={{ marginBottom: '1.25rem' }}>
          {message.text}
        </div>
      )}

      {/* Dynamic Photo Upload Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '96px', height: '96px', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flexShrink: 0, background: '#e2e8f0' }}>
          <img
            src={getImageUrl(profile.avatarUrl)}
            alt={profile.fullName || 'Profile Avatar'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.1rem', color: 'var(--navy)' }}>
            Profile Photo
          </h3>
          <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
            Upload a professional photo (JPG, PNG, WEBP, GIF). Reflects immediately across your portfolio.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
            <button
              type="button"
              className="btn btn--sm btn--primary"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? 'Uploading Photo...' : '📷 Change Photo'}
            </button>
            {profile.avatarUrl && (
              <span style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', wordBreak: 'break-all' }}>
                Current: {profile.avatarUrl}
              </span>
            )}
          </div>
        </div>
      </div>

      <form className="admin-form" onSubmit={handleSave}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            required
            value={profile.fullName || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Role / Title</label>
          <input
            type="text"
            name="roleTitle"
            required
            value={profile.roleTitle || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Tagline</label>
          <input
            type="text"
            name="tagline"
            value={profile.tagline || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Professional Intro / Bio</label>
          <textarea
            name="introText"
            rows={5}
            value={profile.introText || ''}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>GitHub Profile URL</label>
            <input
              type="url"
              name="githubUrl"
              value={profile.githubUrl || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>LinkedIn Profile URL</label>
            <input
              type="url"
              name="linkedinUrl"
              value={profile.linkedinUrl || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Public Contact Email</label>
            <input
              type="email"
              name="email"
              value={profile.email || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Resume / CV Link</label>
            <input
              type="url"
              name="resumeUrl"
              placeholder="https://..."
              value={profile.resumeUrl || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="btn btn--primary" disabled={saving} style={{ alignSelf: 'flex-start' }}>
          {saving ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}
