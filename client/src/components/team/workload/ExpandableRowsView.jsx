import { useState } from 'react';
import WorkloadCard from './WorkloadCard';
import MemberTaskList from './MemberTaskList';
import { useMemberTasks } from '../../../hooks/useWorkload';

const PREVIEW_LIMIT = 6;

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
};

const expandedStyle = {
  borderTop: '1px dashed var(--color-border)',
  paddingTop: 'var(--space-2)',
  cursor: 'default',
  animation: 'wl-rise 220ms ease both',
};

const showAllStyle = {
  background: 'none',
  border: 'none',
  padding: 'var(--space-3) 0 0',
  color: 'var(--color-primary)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
  cursor: 'pointer',
};

function ExpandedTasks({ memberId }) {
  const { tasks, loading, error, refetch } = useMemberTasks(memberId);
  const [showAll, setShowAll] = useState(false);
  const hidden = tasks.length - PREVIEW_LIMIT;

  return (
    // Clicks inside the expanded area shouldn't collapse the row
    <div data-wl-motion style={expandedStyle} onClick={(e) => e.stopPropagation()}>
      <MemberTaskList
        tasks={tasks}
        loading={loading}
        error={error}
        onRetry={refetch}
        limit={showAll ? undefined : PREVIEW_LIMIT}
      />
      {hidden > 0 && (
        <button style={showAllStyle} onClick={() => setShowAll((s) => !s)}>
          {showAll ? 'Show fewer' : `Show all ${tasks.length} open tasks (+${hidden})`}
        </button>
      )}
    </div>
  );
}

export default function ExpandableRowsView({ members, thresholds, scaleMax }) {
  const [expanded, setExpanded] = useState(() => new Set());

  const toggle = (id) => setExpanded((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  return (
    <div style={listStyle}>
      {members.map((m, i) => (
        <WorkloadCard
          key={m.id}
          member={m}
          thresholds={thresholds}
          scaleMax={scaleMax}
          index={i}
          expanded={expanded.has(m.id)}
          onClick={() => toggle(m.id)}
        >
          {expanded.has(m.id) && <ExpandedTasks memberId={m.id} />}
        </WorkloadCard>
      ))}
    </div>
  );
}
