import React, { useEffect, useRef, useState } from 'react';
import { adminService } from '../../../api/adminService';
import { ProjectData } from '../../../types/api';
import { getImageUrl } from '../../../utils/imageUrl';

export function ProjectsPanel() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const projectFileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    tagline: '',
    description: '',
    githubUrl: '',
    demoUrl: '',
    imageUrl: '',
    isFeatured: false,
    sortOrder: 0,
    technologiesStr: '',
    featuresStr: '',
  });

  const loadData = () => {
    adminService.getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({
      name: '',
      tagline: '',
      description: '',
      githubUrl: '',
      demoUrl: '',
      imageUrl: '',
      isFeatured: false,
      sortOrder: projects.length,
      technologiesStr: '',
      featuresStr: '',
    });
    setEditingId(null);
  };

  const handleEdit = (p: ProjectData) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      tagline: p.tagline || '',
      description: p.description,
      githubUrl: p.githubUrl || '',
      demoUrl: p.demoUrl || '',
      imageUrl: p.imageUrl || '',
      isFeatured: p.isFeatured || false,
      sortOrder: p.sortOrder || 0,
      technologiesStr: (p.technologies || []).join(', '),
      featuresStr: (p.features || []).join('\n'),
    });
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await adminService.uploadFile(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errObj.response?.data?.message || errObj.message || 'Failed to upload project image');
    } finally {
      setUploadingImage(false);
      if (projectFileInputRef.current) {
        projectFileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      tagline: form.tagline,
      description: form.description,
      githubUrl: form.githubUrl,
      demoUrl: form.demoUrl,
      imageUrl: form.imageUrl,
      isFeatured: form.isFeatured,
      sortOrder: form.sortOrder,
      technologies: form.technologiesStr.split(',').map((s) => s.trim()).filter(Boolean),
      features: form.featuresStr.split('\n').map((s) => s.trim()).filter(Boolean),
    };

    if (editingId) {
      await adminService.updateProject(editingId, payload);
    } else {
      await adminService.createProject(payload);
    }
    resetForm();
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this project?')) {
      await adminService.deleteProject(id);
      loadData();
    }
  };

  if (loading) return <div className="section-loading">Loading projects...</div>;

  return (
    <div className="admin-panel">
      <h2>Projects Management</h2>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Existing Projects</h3>
        {projects.map((p) => (
          <div key={p.id} className="admin-item" style={{ alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {p.imageUrl && (
                <img
                  src={getImageUrl(p.imageUrl)}
                  alt={p.name}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                />
              )}
              <div>
                <div className="admin-item__name">
                  <strong>{p.name}</strong> — {p.tagline}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                  Tech: {(p.technologies || []).join(', ')}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn--sm btn--outline"
                onClick={() => handleEdit(p)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn--sm btn--danger"
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit Project' : 'Add New Project'}</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Project Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Tagline / Subtitle</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows={3}
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>GitHub Repository URL</label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Live Demo URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.demoUrl}
              onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Project Preview Image</label>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
            <input
              type="file"
              ref={projectFileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProjectImageUpload}
            />
            <button
              type="button"
              className="btn btn--sm btn--outline"
              disabled={uploadingImage}
              onClick={() => projectFileInputRef.current?.click()}
            >
              {uploadingImage ? 'Uploading Screenshot...' : '📁 Upload Image File'}
            </button>
            {form.imageUrl && (
              <span style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
                {form.imageUrl}
              </span>
            )}
          </div>
          <input
            type="text"
            placeholder="Or enter direct URL: https://... or /uploads/..."
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
          {form.imageUrl && (
            <div style={{ marginTop: '0.75rem' }}>
              <img
                src={getImageUrl(form.imageUrl)}
                alt="Preview"
                style={{ maxHeight: '120px', borderRadius: '6px', border: '1px solid var(--border)' }}
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Technologies (comma-separated)</label>
          <input
            type="text"
            placeholder="Java, Spring Boot, PostgreSQL, Docker"
            value={form.technologiesStr}
            onChange={(e) => setForm({ ...form, technologiesStr: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Key Features (one per line)</label>
          <textarea
            rows={4}
            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            value={form.featuresStr}
            onChange={(e) => setForm({ ...form, featuresStr: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button type="submit" className="btn btn--primary">
            {editingId ? 'Update Project' : 'Create Project'}
          </button>
          {editingId && (
            <button type="button" className="btn btn--outline" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
