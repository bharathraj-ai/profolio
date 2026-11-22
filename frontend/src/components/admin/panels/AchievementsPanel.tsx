import React, { useEffect, useState } from 'react';
import { adminService } from '../../../api/adminService';
import { AchievementData, CertificationData } from '../../../types/api';

export function AchievementsPanel() {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [certifications, setCertifications] = useState<CertificationData[]>([]);
  const [loading, setLoading] = useState(true);

  // New achievement form
  const [achForm, setAchForm] = useState({
    placeLabel: '',
    medalType: 'gold' as 'gold' | 'silver' | 'other',
    title: '',
    eventName: '',
  });

  // New certification form
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');

  const loadData = () => {
    Promise.all([adminService.getAchievements(), adminService.getCertifications()]).then(
      ([achs, certs]) => {
        setAchievements(achs);
        setCertifications(certs);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminService.createAchievement({
      ...achForm,
      sortOrder: achievements.length,
    });
    setAchForm({ placeLabel: '', medalType: 'gold', title: '', eventName: '' });
    loadData();
  };

  const handleDeleteAchievement = async (id: number) => {
    if (confirm('Delete this achievement?')) {
      await adminService.deleteAchievement(id);
      loadData();
    }
  };

  const handleAddCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim()) return;
    await adminService.createCertification({
      name: certName.trim(),
      issuer: certIssuer.trim() || undefined,
      sortOrder: certifications.length,
    });
    setCertName('');
    setCertIssuer('');
    loadData();
  };

  const handleDeleteCertification = async (id: number) => {
    if (confirm('Delete this certification?')) {
      await adminService.deleteCertification(id);
      loadData();
    }
  };

  if (loading) return <div className="section-loading">Loading achievements &amp; certifications...</div>;

  return (
    <div className="admin-panel">
      <h2>Achievements &amp; Certifications</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <form className="admin-form" onSubmit={handleAddAchievement}>
          <h3>Add Achievement</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Place Label (e.g. 1st, 2nd, R-up)</label>
              <input
                type="text"
                required
                value={achForm.placeLabel}
                onChange={(e) => setAchForm({ ...achForm, placeLabel: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Medal Type</label>
              <select
                value={achForm.medalType}
                onChange={(e) => setAchForm({ ...achForm, medalType: e.target.value as 'gold' | 'silver' | 'other' })}
              >
                <option value="gold">Gold (Yellow)</option>
                <option value="silver">Silver (Slate)</option>
                <option value="other">Other / Bronze</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Title (e.g. 1st Place, Runner-up)</label>
            <input
              type="text"
              required
              value={achForm.title}
              onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              required
              value={achForm.eventName}
              onChange={(e) => setAchForm({ ...achForm, eventName: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn--primary btn--sm">Add Achievement</button>
        </form>

        <form className="admin-form" onSubmit={handleAddCertification}>
          <h3>Add Certification / Experience</h3>
          <div className="form-group">
            <label>Title / Description</label>
            <input
              type="text"
              required
              placeholder="e.g. AWS Certified Developer"
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Issuer / Organization (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Amazon Web Services"
              value={certIssuer}
              onChange={(e) => setCertIssuer(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn--primary btn--sm">Add Certification</button>
        </form>
      </div>

      <h3>Current Achievements</h3>
      <div style={{ marginBottom: '2rem' }}>
        {achievements.map((a) => (
          <div key={a.id} className="admin-item">
            <div>
              <strong>{a.placeLabel} — {a.title}</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>{a.eventName}</div>
            </div>
            <button
              type="button"
              className="btn btn--sm btn--danger"
              onClick={() => handleDeleteAchievement(a.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <h3>Current Certifications &amp; Experiences</h3>
      <div>
        {certifications.map((c) => (
          <div key={c.id} className="admin-item">
            <div>
              <strong>{c.name}</strong> {c.issuer ? `(${c.issuer})` : ''}
            </div>
            <button
              type="button"
              className="btn btn--sm btn--danger"
              onClick={() => handleDeleteCertification(c.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

