import Badge from '../../common/Badge';
import Spinner from '../../common/Spinner';
import InlineError from './InlineError';
import { formatRelativeDate, isOverdue } from '../../../utils/format-date';

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto auto',
  alignItems: 'center',
  gap: 'var(--space-3)',
  padding: 'var(--space-3) 0',
  borderBottom: '1px solid var(--color-border-light)',
  fontSize: 'var(--font-size-sm)',
};

export function TaskLine({ task }) {
  const overdue = isOverdue(task.due_date);
  return (
    <div style={rowStyle}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{task.title}</div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          {task.project_name} · {task.status === 'in-progress' ? 'In progress' : 'To do'}
          {task.estimated_hours ? ` · ${task.estimated_hours}h` : ''}
        </div>
      </div>
      <Badge value={task.priority} />
      <span style={{
        fontSize: 'var(--font-size-xs)',
        minWidth: '80px',
        textAlign: 'right',
        color: overdue ? 'var(--color-error)' : 'var(--color-text-muted)',
        fontWeight: overdue ? 'var(--font-weight-medium)' : 'normal',
      }}>
        {formatRelativeDate(task.due_date)}
      </span>
    </div>
  );
}

export default function MemberTaskList({ tasks, loading, error, onRetry, limit }) {
  if (loading) return <Spinner />;
  if (error) return <InlineError title="Couldn't load tasks" message={error} onRetry={onRetry} />;
  if (!tasks.length) {
    return (
      <p style={{ color: 'var(--color-success)', fontSize: 'var(--font-size-sm)', padding: 'var(--space-4) 0' }}>
        No open tasks. This person has capacity.
      </p>
    );
  }

  const shown = limit ? tasks.slice(0, limit) : tasks;
  return (
    <div>
      {shown.map((task) => <TaskLine key={task.id} task={task} />)}
    </div>
  );
}
