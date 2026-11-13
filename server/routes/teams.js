import { Router } from 'express';
import getDb from '../db/connection.js';

const router = Router();

// GET /api/team — all team members
router.get('/', (req, res) => {
  const db = getDb();
  const members = db.prepare('SELECT * FROM team_members ORDER BY id').all();
  res.json(members);
});

// Overload rule: open (todo + in-progress) high + urgent tasks per member
export const AT_RISK_MIN = 4;
export const OVERLOAD_MIN = 7;

const LEVEL_ORDER = { overloaded: 0, 'at-risk': 1, normal: 2 };

function loadLevel(highUrgent) {
  if (highUrgent >= OVERLOAD_MIN) return 'overloaded';
  if (highUrgent >= AT_RISK_MIN) return 'at-risk';
  return 'normal';
}

// GET /api/team/workload — open task load per member, sorted heaviest first
router.get('/workload', (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT m.*,
      COUNT(t.id) as open_count,
      COALESCE(SUM(CASE WHEN t.priority = 'urgent' THEN 1 ELSE 0 END), 0) as urgent,
      COALESCE(SUM(CASE WHEN t.priority = 'high' THEN 1 ELSE 0 END), 0) as high,
      COALESCE(SUM(CASE WHEN t.priority = 'medium' THEN 1 ELSE 0 END), 0) as medium,
      COALESCE(SUM(CASE WHEN t.priority = 'low' THEN 1 ELSE 0 END), 0) as low,
      COALESCE(SUM(t.estimated_hours), 0) as open_hours
    FROM team_members m
    LEFT JOIN tasks t ON t.assignee_id = m.id AND t.status IN ('todo', 'in-progress')
    GROUP BY m.id
  `).all();

  const members = rows
    .map((m) => {
      const high_urgent = m.urgent + m.high;
      return { ...m, high_urgent, load_level: loadLevel(high_urgent) };
    })
    .sort((a, b) =>
      LEVEL_ORDER[a.load_level] - LEVEL_ORDER[b.load_level]
      || b.high_urgent - a.high_urgent
      || a.name.localeCompare(b.name)
    );

  res.json({
    members,
    summary: {
      total_open: members.reduce((sum, m) => sum + m.open_count, 0),
      overloaded: members.filter((m) => m.load_level === 'overloaded').length,
      at_risk: members.filter((m) => m.load_level === 'at-risk').length,
    },
    thresholds: { at_risk: AT_RISK_MIN, overloaded: OVERLOAD_MIN },
  });
});

// GET /api/team/:id — single team member
router.get('/:id', (req, res) => {
  const db = getDb();
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Team member not found' });
  }
  res.json(member);
});

// GET /api/team/:id/tasks — tasks assigned to a team member
router.get('/:id/tasks', (req, res) => {
  const db = getDb();
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Team member not found' });
  }
  const tasks = db.prepare(`
    SELECT t.*, p.name as project_name
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.assignee_id = ?
    ORDER BY t.due_date ASC
  `).all(req.params.id);
  res.json(tasks);
});

export default router;
