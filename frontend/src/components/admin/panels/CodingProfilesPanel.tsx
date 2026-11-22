import React, { useEffect, useState } from 'react';
import { adminService } from '../../../api/adminService';
import { CodingProfileData } from '../../../types/api';

export function CodingProfilesPanel() {
  const [profiles, setProfiles] = useState<CodingProfileData[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    platformName: '',
    iconText: '',
    description: '',
    profileUrl: '',
  });

  const loadData = () => {
    adminService.getCodingProfiles().then((data) => {
      setProfiles(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminService.createCodingProfile({
      ...form,
      sortOrder: profiles.length,
    });
    setForm({ platformName: '', iconText: '', description: '', profileUrl: '' });
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this coding profile?')) {
      await adminService.deleteCodingProfile(id);
      loadData();
    }
  };

  if (loading) return <div className="section-loading">Loading coding profiles...</div>;

  return (
    <div className="admin-panel">
      <h2>Coding Profiles Management</h2>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Current Coding Profiles</h3>
        {profiles.map((p) => (
          <div key={p.id} className="admin-item">
            <div>
              <strong>{p.iconText} {p.platformName}</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                <a href={p.profileUrl} target="_blank" rel="noopener noreferrer">{p.profileUrl}</a>
              </div>
            </div>
            <button
              type="button"
              className="btn btn--sm btn--danger"
              onClick={() => handleDelete(p.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>Add Coding Profile</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Platform Name (e.g. LeetCode, CodeForces)</label>
            <input
              type="text"
              required
              value={form.platformName}
              onChange={(e) => setForm({ ...form, platformName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Icon / Symbol (e.g. ⟨/⟩, ★, ⌥)</label>
            <input
              type="text"
              value={form.iconText}
              onChange={(e) => setForm({ ...form, iconText: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Profile URL</label>
          <input
            type="url"
            required
            placeholder="https://..."
            value={form.profileUrl}
            onChange={(e) => setForm({ ...form, profileUrl: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Short Description (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Problem solving and contest ranking"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn--primary" style={{ alignSelf: 'flex-start' }}>
          Add Profile
        </button>
      </form>
    </div>
  );
}

