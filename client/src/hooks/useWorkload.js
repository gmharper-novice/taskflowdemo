import { useMemo } from 'react';
import { useApi } from './useApi';

const PRIORITY_RANK = { urgent: 0, high: 1, medium: 2, low: 3 };
const OPEN_STATUSES = ['todo', 'in-progress'];

export function useWorkload() {
  return useApi('/team/workload');
}

// Open tasks for one member, most urgent first
export function useMemberTasks(memberId) {
  const { data, loading, error, refetch } = useApi(`/team/${memberId}/tasks`, { skip: !memberId });

  const tasks = useMemo(() => (data || [])
    .filter((t) => OPEN_STATUSES.includes(t.status))
    .sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
      || (a.due_date || '').localeCompare(b.due_date || '')), [data]);

  return { tasks, loading, error, refetch };
}
