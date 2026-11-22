import React, { useEffect, useState } from 'react';
import { adminService } from '../../../api/adminService';
import { EducationData } from '../../../types/api';

export function EducationPanel() {
  const [items, setItems] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<EducationData>>({
    degree: '',
    institution: '',
    fieldOfStudy: '',
    startYear: 2022,
    endYear: 2026,
    isCurrent: true,
    description: '',
    sortOrder: 0
  });

  const loadData = () => {
    adminService.getEducation().then((data) => {
      setItems(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminService.createEducation(formData);
    setFormData({
      degree: '',
      institution: '',
      fieldOfStudy: '',
      startYear: 2022,
      endYear: 2026,
      isCurrent: false,
      description: '',
      sortOrder: items.length
    });
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this education entry?')) {
      await adminService.deleteEducation(id);
      loadData();
    }
  };

  if (loading) return <div className="section-loading">Loading education records...</div>;

  return (
    <div className="admin-panel">
      <h2>Education Management</h2>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Current Education Entries</h3>
        {items.map((item) => (
          <div key={item.id} className="admin-item">
            <div>
              <div className="admin-item__name">
                <strong>{item.degree}</strong> {item.fieldOfStudy ? `in ${item.fieldOfStudy}` : ''}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                {item.institution} ({item.startYear} - {item.isCurrent ? 'Current' : item.endYear || ''})
              </div>
            </div>
            <button
              type="button"
              className="btn btn--sm btn--danger"
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>Add New Education</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Degree (e.g. B.Tech, High School)</label>
            <input
              type="text"
              required
              value={formData.degree || ''}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Institution / University</label>
            <input
              type="text"
              required
              value={formData.institution || ''}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Field of Study (e.g. AI & Data Science)</label>
          <input
            type="text"
            value={formData.fieldOfStudy || ''}
            onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
          <div className="form-group">
            <label>Start Year</label>
            <input
              type="number"
              value={formData.startYear || ''}
              onChange={(e) => setFormData({ ...formData, startYear: Number(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label>End Year</label>
            <input
              type="number"
              disabled={formData.isCurrent}
              value={formData.endYear || ''}
              onChange={(e) => setFormData({ ...formData, endYear: Number(e.target.value) })}
            />
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
            <input
              type="checkbox"
              id="isCurrent"
              checked={formData.isCurrent || false}
              onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
              style={{ width: 'auto' }}
            />
            <label htmlFor="isCurrent" style={{ margin: 0 }}>Currently Enrolled</label>
          </div>
        </div>

        <button type="submit" className="btn btn--primary" style={{ alignSelf: 'flex-start' }}>
          Add Education
        </button>
      </form>
    </div>
  );
}

