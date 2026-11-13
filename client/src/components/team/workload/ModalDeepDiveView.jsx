import { useState } from 'react';
import Modal from '../../common/Modal';
import Spinner from '../../common/Spinner';
import WorkloadCard from './WorkloadCard';
import InlineError from './InlineError';
import { TaskLine } from './MemberTaskList';
import { MemberHeader, MemberStats, PriorityMix, sectionLabelStyle } from './MemberDetail';
import { PRIORITIES, priorityColor } from './load';
import { useMemberTasks } from '../../../hooks/useWorkload';

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: 'var(--space-4)',
};

const groupHeadingStyle = (p) => ({
  ...sectionLabelStyle,
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
  marginTop: 'var(--space-5)',
  paddingBottom: 'var(--space-1)',
  borderBottom: `2px solid ${priorityColor[p]}`,
  color: 'var(--color-text)',
});

function DeepDive({ member, thresholds }) {
  const { tasks, loading, error, refetch } = useMemberTasks(member.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <MemberHeader member={member} thresholds={thresholds} size={64} />
      <MemberStats member={member} />
      <PriorityMix member={member} />

      <div>
        {loading && <Spinner />}
        {error && <InlineError title="Couldn't load tasks" message={error} onRetry={refetch} />}
        {!loading && !error && tasks.length === 0 && (
          <p style={{ color: 'var(--color-success)', fontSize: 'var(--font-size-sm)' }}>No open tasks. This person has capacity.</p>
        )}
        {!loading && !error && PRIORITIES.map((p) => {
          const group = tasks.filter((t) => t.priority === p);
          if (!group.length) return null;
          return (
            <section key={p}>
              <div style={groupHeadingStyle(p)}>
                <span style={{ textTransform: 'capitalize' }}>{p}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>{group.length}</span>
              </div>
              {group.map((t) => <TaskLine key={t.id} task={t} />)}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default function ModalDeepDiveView({ members, thresholds, scaleMax }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = members.find((m) => m.id === selectedId);

  return (
    <>
      <div style={gridStyle}>
        {members.map((m, i) => (
          <WorkloadCard
            key={m.id}
            member={m}
            thresholds={thresholds}
            scaleMax={scaleMax}
            index={i}
            onClick={() => setSelectedId(m.id)}
          />
        ))}
      </div>
      <Modal isOpen={!!selected} onClose={() => setSelectedId(null)} title="Workload deep-dive" maxWidth="680px">
        {selected && <DeepDive member={selected} thresholds={thresholds} />}
      </Modal>
    </>
  );
}
