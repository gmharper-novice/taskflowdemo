import { useEffect, useState } from 'react';
import WorkloadCard from './WorkloadCard';
import MemberTaskList from './MemberTaskList';
import { MemberHeader, MemberStats, PriorityMix, sectionLabelStyle } from './MemberDetail';
import { useMemberTasks } from '../../../hooks/useWorkload';

const PANEL_WIDTH = 420;

const gridStyle = (open) => ({
  display: 'grid',
  gridTemplateColumns: open ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: 'var(--space-4)',
  marginRight: open ? `${PANEL_WIDTH}px` : 0,
  transition: 'margin-right var(--transition-base)',
});

const panelStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: `${PANEL_WIDTH}px`,
  background: 'var(--color-surface)',
  borderLeft: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-lg)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 50,
  animation: 'wl-slide-in 240ms ease-out both',
};

const panelHeaderStyle = {
  padding: 'var(--space-6)',
  borderBottom: '1px solid var(--color-border-light)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-5)',
};

const closeBtnStyle = {
  position: 'absolute',
  top: 'var(--space-4)',
  right: 'var(--space-4)',
  background: 'none',
  border: 'none',
  fontSize: 'var(--font-size-xl)',
  color: 'var(--color-text-muted)',
  cursor: 'pointer',
  padding: 'var(--space-1)',
  lineHeight: 1,
};

function Panel({ member, thresholds, onClose }) {
  const { tasks, loading, error, refetch } = useMemberTasks(member.id);

  return (
    <aside data-wl-motion style={panelStyle} aria-label={`${member.name} workload`}>
      <button style={closeBtnStyle} onClick={onClose} aria-label="Close panel">&times;</button>
      <div style={panelHeaderStyle}>
        <MemberHeader member={member} thresholds={thresholds} />
        <MemberStats member={member} />
        <PriorityMix member={member} />
      </div>
      <div style={{ padding: 'var(--space-4) var(--space-6)', overflowY: 'auto', flex: 1 }}>
        <div style={sectionLabelStyle}>Open tasks, most urgent first</div>
        <MemberTaskList tasks={tasks} loading={loading} error={error} onRetry={refetch} />
      </div>
    </aside>
  );
}

export default function SlideOutView({ members, thresholds, scaleMax }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = members.find((m) => m.id === selectedId);

  useEffect(() => {
    if (!selected) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setSelectedId(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return (
    <>
      <div style={gridStyle(!!selected)}>
        {members.map((m, i) => (
          <WorkloadCard
            key={m.id}
            member={m}
            thresholds={thresholds}
            scaleMax={scaleMax}
            index={i}
            selected={m.id === selectedId}
            onClick={() => setSelectedId((id) => (id === m.id ? null : m.id))}
          />
        ))}
      </div>
      {/* No key: the panel stays put and swaps content when another card is clicked */}
      {selected && <Panel member={selected} thresholds={thresholds} onClose={() => setSelectedId(null)} />}
    </>
  );
}
