import { useState } from 'react';
import { Link } from 'react-router-dom';

const statCardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-6)',
  boxShadow: 'var(--shadow-sm)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'box-shadow var(--transition-fast), border-color var(--transition-fast)',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
};

const iconChipStyle = {
  width: '36px',
  height: '36px',
  borderRadius: 'var(--border-radius-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const labelStyle = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-secondary)',
  fontWeight: 'var(--font-weight-medium)',
};

const valueStyle = {
  fontSize: 'var(--font-size-3xl)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text)',
  lineHeight: 1,
};

// Line icons match the sidebar nav icons in App.jsx (24px viewBox, stroke="currentColor")
const icons = {
  tasks: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>,
  done: <><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/></>,
  progress: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  projects: <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>,
};

export default function Stats({ tasks, projects }) {
  const [hovered, setHovered] = useState(null);
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.status === 'done').length || 0;
  const inProgress = tasks?.filter((t) => t.status === 'in-progress').length || 0;
  const activeProjects = projects?.filter((p) => p.status === 'active').length || 0;

  const stats = [
    { label: 'Total Tasks', value: totalTasks, to: '/tasks', icon: 'tasks', color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
    // BUG: Typo — "Completd" instead of "Completed"
    { label: 'Completd Tasks', value: completedTasks, to: '/tasks?status=done', icon: 'done', color: 'var(--color-success)', bg: 'var(--color-success-light)' },
    { label: 'In Progress', value: inProgress, to: '/tasks?status=in-progress', icon: 'progress', color: 'var(--color-info)', bg: 'var(--color-info-light)' },
    { label: 'Active Projects', value: activeProjects, to: '/projects', icon: 'projects', color: 'var(--color-accent)', bg: 'var(--color-accent-light)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
      {stats.map((stat) => (
        <Link
          key={stat.label}
          to={stat.to}
          style={{
            ...statCardStyle,
            ...(hovered === stat.label ? { boxShadow: 'var(--shadow-md)', borderColor: stat.color } : {}),
          }}
          onMouseEnter={() => setHovered(stat.label)}
          onMouseLeave={() => setHovered(null)}
        >
          <div style={headerStyle}>
            <span style={{ ...iconChipStyle, background: stat.bg, color: stat.color }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icons[stat.icon]}</svg>
            </span>
            <span style={labelStyle}>{stat.label}</span>
          </div>
          <span style={valueStyle}>{stat.value}</span>
        </Link>
      ))}
    </div>
  );
}
