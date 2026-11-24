import React, { useEffect, useState } from 'react';
import { adminService } from '../../../api/adminService';
import { EducationData } from '../../../types/api';

function formatEduPeriod(startYear?: number, endYear?: number, isCurrent?: boolean, yearOfStudy?: string) {
  const parts: string[] = [];
  if (startYear && endYear) {
    parts.push(`${startYear} - ${endYear}`);
  } else if (startYear) {
    parts.push(`${startYear}`);
  } else if (endYear) {
    parts.push(`${endYear}`);
  }

  if (yearOfStudy && yearOfStudy.trim()) {
    parts.push(yearOfStudy.trim());
  }

  if (isCurrent) {
    parts.push('Current');
  }

  return parts.join(' • ');
}

export function EducationPanel() {
  const [items, setItems] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<EducationData>>({
    degree: '',
    institution: '',
    fieldOfStudy: '',
    startYear: 2022,
    endYear: 2026,
    isCurrent: true,
    description: '4th Year',
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

  const handleEdit = (item: EducationData) => {
    setEditingId(item.id);
    setFormData({
      degree: item.degree,
      institution: item.institution,
      fieldOfStudy: item.fieldOfStudy || '',
      startYear: item.startYear,
      endYear: item.endYear,
      isCurrent: item.isCurrent,
      description: item.description || '',
      sortOrder: item.sortOrder || 0
    });
  };

  const handleCancel = () => {
    setEditingId(null);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await adminService.updateEducation(editingId, formData);
    } else {
      await adminService.createEducation(formData);
    }
    handleCancel();
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
          <div key={item.id} className="admin-item" style={{ alignItems: 'center' }}>
            <div>
              <div className="admin-item__name">
                <strong>{item.degree}</strong> {item.fieldOfStudy ? `in ${item.fieldOfStudy}` : ''}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                {item.institution} ({formatEduPeriod(item.startYear, item.endYear, item.isCurrent, item.description)})
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn--sm btn--secondary"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn--sm btn--danger"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit Education Entry' : 'Add New Education'}</h3>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Field of Study (e.g. AI & Data Science)</label>
            <input
              type="text"
              value={formData.fieldOfStudy || ''}
              onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Academic Year / Standing (e.g. 4th Year)</label>
            <input
              type="text"
              placeholder="e.g. 4th Year, 3rd Year, Final Year"
              value={formData.description || ''}
              list="academic-year-options"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <datalist id="academic-year-options">
              <option value="1st Year" />
              <option value="2nd Year" />
              <option value="3rd Year" />
              <option value="4th Year" />
              <option value="Final Year" />
            </datalist>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
          <div className="form-group">
            <label>Start Year</label>
            <input
              type="number"
              value={formData.startYear || ''}
              onChange={(e) => setFormData({ ...formData, startYear: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
          <div className="form-group">
            <label>End Year {formData.isCurrent ? '(Expected Graduation)' : ''}</label>
            <input
              type="number"
              placeholder={formData.isCurrent ? 'e.g. 2026' : 'e.g. 2026'}
              value={formData.endYear || ''}
              onChange={(e) => setFormData({ ...formData, endYear: e.target.value ? Number(e.target.value) : undefined })}
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

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="submit" className="btn btn--primary" style={{ alignSelf: 'flex-start' }}>
            {editingId ? 'Update Education' : 'Add Education'}
          </button>
          {editingId && (
            <button type="button" className="btn btn--secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
