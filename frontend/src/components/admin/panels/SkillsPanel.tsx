import React, { useEffect, useState } from 'react';
import { adminService } from '../../../api/adminService';
import { SkillCategoryData } from '../../../types/api';

export function SkillsPanel() {
  const [categories, setCategories] = useState<SkillCategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  // New category state
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('');

  // New skill state
  const [selectedCatId, setSelectedCatId] = useState<number | ''>('');
  const [newSkillName, setNewSkillName] = useState('');

  const loadData = () => {
    adminService.getSkills().then((data) => {
      setCategories(data);
      if (data.length > 0 && selectedCatId === '') {
        setSelectedCatId(data[0].id);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await adminService.createSkillCategory({
      name: newCatName.trim(),
      iconText: newCatIcon.trim() || '⚙',
      sortOrder: categories.length
    });
    setNewCatName('');
    setNewCatIcon('');
    loadData();
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm('Delete this category and all its skills?')) {
      await adminService.deleteSkillCategory(id);
      loadData();
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim() || !selectedCatId) return;
    await adminService.createSkill({
      name: newSkillName.trim(),
      categoryId: Number(selectedCatId),
      sortOrder: 0
    });
    setNewSkillName('');
    loadData();
  };

  const handleDeleteSkill = async (id: number) => {
    await adminService.deleteSkill(id);
    loadData();
  };

  if (loading) return <div className="section-loading">Loading skills...</div>;

  return (
    <div className="admin-panel">
      <h2>Skills &amp; Categories Management</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <form className="admin-form" onSubmit={handleAddCategory}>
          <h3>Add Category</h3>
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Cloud, Mobile"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Icon / Symbol</label>
            <input
              type="text"
              placeholder="e.g. ☁, 📱, ⌘"
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn--primary btn--sm">Add Category</button>
        </form>

        <form className="admin-form" onSubmit={handleAddSkill}>
          <h3>Add Skill to Category</h3>
          <div className="form-group">
            <label>Select Category</label>
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(Number(e.target.value))}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Skill Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Kotlin, Redis, GraphQL"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn--primary btn--sm">Add Skill</button>
        </form>
      </div>

      <h3>Current Categories &amp; Skills</h3>
      {categories.map((cat) => (
        <div key={cat.id} className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'var(--navy)' }}>
              <span>{cat.iconText}</span> {cat.name}
            </h4>
            <button
              type="button"
              className="btn btn--sm btn--danger"
              onClick={() => handleDeleteCategory(cat.id)}
            >
              Delete Category
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {cat.skills && cat.skills.map((s) => (
              <span
                key={s.id}
                className="skill-tag"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', paddingRight: '0.4rem' }}
              >
                {s.name}
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(s.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    padding: '0 2px'
                  }}
                  title="Remove skill"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

