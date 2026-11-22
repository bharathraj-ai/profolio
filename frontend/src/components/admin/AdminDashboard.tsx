import { useState } from 'react';
import { ProfilePanel } from './panels/ProfilePanel';
import { EducationPanel } from './panels/EducationPanel';
import { SkillsPanel } from './panels/SkillsPanel';
import { ProjectsPanel } from './panels/ProjectsPanel';
import { AchievementsPanel } from './panels/AchievementsPanel';
import { CodingProfilesPanel } from './panels/CodingProfilesPanel';
import { MessagesPanel } from './panels/MessagesPanel';
import { authService } from '../../api/authService';

type Tab = 'profile' | 'education' | 'skills' | 'projects' | 'achievements' | 'profiles' | 'messages';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile Info', icon: '👤' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills & Tech', icon: '⚙' },
    { id: 'projects', label: 'Projects', icon: '💼' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'profiles', label: 'Coding Profiles', icon: '⟨/⟩' },
    { id: 'messages', label: 'Messages', icon: '✉' },
  ];

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/api/login';
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <a href="/" className="admin-sidebar__logo">
          Bharathraj S
          <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.7, fontWeight: 400 }}>
            Admin Portal
          </span>
        </a>

        <nav className="admin-sidebar__nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`admin-sidebar__link${activeTab === tab.id ? ' admin-sidebar__link--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <a
            href="/"
            style={{
              display: 'block',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.85rem',
              marginBottom: '0.75rem',
              textDecoration: 'none'
            }}
          >
            ← Back to Portfolio
          </a>
          <button
            type="button"
            className="btn btn--sm btn--danger"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--navy)', margin: 0 }}>
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
              Connected to PostgreSQL · Live updates reflect instantly on the public website
            </p>
          </div>
          <div>
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn--sm btn--outline">
              View Live Website ↗
            </a>
          </div>
        </header>

        <div>
          {activeTab === 'profile' && <ProfilePanel />}
          {activeTab === 'education' && <EducationPanel />}
          {activeTab === 'skills' && <SkillsPanel />}
          {activeTab === 'projects' && <ProjectsPanel />}
          {activeTab === 'achievements' && <AchievementsPanel />}
          {activeTab === 'profiles' && <CodingProfilesPanel />}
          {activeTab === 'messages' && <MessagesPanel />}
        </div>
      </main>
    </div>
  );
}
