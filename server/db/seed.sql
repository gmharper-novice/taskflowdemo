-- Team Members
-- ID 1 is "You" (the mock user / PM)
INSERT INTO team_members (name, role, email, avatar_color) VALUES
  ('You', 'Product Manager', 'pm@taskflow.io', '#e63f02'),
  ('David Park', 'Engineering Lead', 'david@taskflow.io', '#2563eb'),
  ('Rachel Torres', 'Senior Engineer', 'rachel@taskflow.io', '#7c3aed'),
  ('Nina Sharma', 'Designer', 'nina@taskflow.io', '#ec4899'),
  ('James Wilson', 'Junior Engineer', 'james@taskflow.io', '#10b981'),
  ('Olivia Foster', 'QA Engineer', 'olivia@taskflow.io', '#f59e0b'),
  ('Leo Martinez', 'Frontend Engineer', 'leo@taskflow.io', '#06b6d4');

-- Projects
INSERT INTO projects (name, description, status, owner_id) VALUES
  ('Dashboard Redesign', 'Modernize the analytics dashboard with new charts, filters, and real-time updates. High visibility initiative from the CPO.', 'active', 1),
  ('API V2 Migration', 'Migrate all endpoints from REST v1 to v2 with improved pagination, filtering, and error handling.', 'active', 2),
  ('Mobile App MVP', 'Build the first mobile experience — task viewing, status updates, and push notifications.', 'active', 1),
  ('Q4 Bug Bash', 'Systematic sweep of reported bugs from Q3. Fix, verify, close.', 'completed', 6);

-- Tasks for Dashboard Redesign (project_id = 1)
INSERT INTO tasks (title, description, status, priority, assignee_id, project_id, due_date, estimated_hours) VALUES
  ('Design new chart components', 'Create reusable chart components for bar, line, and pie charts', 'done', 'high', 4, 1, date('now', '-3 days'), 8),
  ('Implement filter sidebar', 'Add date range, project, and member filters to dashboard', 'in-progress', 'high', 3, 1, date('now', '+2 days'), 12),
  ('Build real-time data feed', 'WebSocket connection for live dashboard updates', 'in-progress', 'urgent', 3, 1, date('now', '+1 days'), 16),
  ('Dashboard performance audit', 'Profile and optimize render cycles, reduce bundle size', 'todo', 'high', 3, 1, date('now', '+3 days'), 6),
  ('Add export to PDF', 'Allow users to export dashboard view as PDF report', 'todo', 'medium', 7, 1, date('now', '+7 days'), 8),
  ('User acceptance testing', 'Full UAT pass on dashboard with stakeholders', 'todo', 'high', 6, 1, date('now', '+5 days'), 4),
  ('Write dashboard API docs', 'Document all new dashboard endpoints for external devs', 'todo', 'medium', 2, 1, date('now', '+10 days'), 4),
  ('Dashboard onboarding tooltip', 'First-time user experience with guided tooltips', 'todo', 'low', 4, 1, date('now', '+14 days'), 6),
  ('Migrate legacy widgets', 'Port old dashboard widgets to new component system', 'in-progress', 'high', 3, 1, date('now', '+2 days'), 10),
  ('Accessibility audit', 'WCAG 2.1 AA compliance check on all new dashboard components', 'todo', 'medium', 3, 1, date('now', '+4 days'), 8);

-- Tasks for API V2 Migration (project_id = 2)
INSERT INTO tasks (title, description, status, priority, assignee_id, project_id, due_date, estimated_hours) VALUES
  ('Design v2 endpoint schema', 'Define new response formats, pagination, error codes', 'done', 'high', 2, 2, date('now', '-5 days'), 6),
  ('Migrate /users endpoints', 'Port user CRUD from v1 to v2 with new validation', 'done', 'high', 5, 2, date('now', '-2 days'), 8),
  ('Migrate /projects endpoints', 'Port project CRUD with new filtering support', 'in-progress', 'high', 3, 2, date('now', '+3 days'), 10),
  ('Migrate /tasks endpoints', 'Port task CRUD with bulk operations support', 'todo', 'high', 3, 2, date('now', '+5 days'), 12),
  ('Add rate limiting', 'Implement per-user rate limiting on v2 endpoints', 'todo', 'medium', 2, 2, date('now', '+8 days'), 6),
  ('Write migration guide', 'External docs for v1→v2 migration for API consumers', 'todo', 'medium', 1, 2, date('now', '+12 days'), 4),
  ('Set up v1 deprecation warnings', 'Add sunset headers and console warnings to v1 endpoints', 'todo', 'low', 5, 2, date('now', '+15 days'), 3),
  ('Load test v2 endpoints', 'Stress test new endpoints to match v1 performance benchmarks', 'todo', 'urgent', 3, 2, date('now', '+4 days'), 8);

-- Tasks for Mobile App MVP (project_id = 3)
INSERT INTO tasks (title, description, status, priority, assignee_id, project_id, due_date, estimated_hours) VALUES
  ('Mobile wireframes', 'Low-fi wireframes for core screens: task list, task detail, notifications', 'done', 'high', 4, 3, date('now', '-7 days'), 6),
  ('Set up React Native project', 'Initialize RN project with navigation, state management, CI', 'in-progress', 'high', 7, 3, date('now', '+1 days'), 8),
  ('Build task list screen', 'Implement scrollable task list with pull-to-refresh', 'todo', 'high', 7, 3, date('now', '+6 days'), 10),
  ('Build task detail screen', 'Task detail view with status updates and comments', 'todo', 'medium', 7, 3, date('now', '+10 days'), 8),
  ('Push notification service', 'Set up FCM/APNs for task assignment and due date reminders', 'todo', 'medium', 5, 3, date('now', '+14 days'), 12),
  ('Mobile authentication', 'Biometric + token-based auth flow for mobile', 'todo', 'high', 5, 3, date('now', '+8 days'), 10);

-- Tasks for Q4 Bug Bash (project_id = 4) — all done
INSERT INTO tasks (title, description, status, priority, assignee_id, project_id, due_date, estimated_hours) VALUES
  ('Fix timezone display bug', 'Due dates show in UTC instead of user local time', 'done', 'high', 7, 4, date('now', '-14 days'), 3),
  ('Fix broken avatar upload', 'Large avatars crash the upload endpoint', 'done', 'medium', 5, 4, date('now', '-12 days'), 4),
  ('Fix notification double-send', 'Email notifications fire twice on task assignment', 'done', 'urgent', 2, 4, date('now', '-10 days'), 6),
  ('Fix search encoding issue', 'Special characters in search break the query', 'done', 'medium', 3, 4, date('now', '-8 days'), 2),
  ('Fix dark mode contrast', 'Several components fail contrast ratio in dark mode', 'done', 'low', 4, 4, date('now', '-6 days'), 4),
  ('Fix CSV export truncation', 'Exports cut off at 1000 rows regardless of dataset size', 'done', 'medium', 5, 4, date('now', '-4 days'), 3);

-- Additional tasks to create realistic workload imbalance
-- Rachel (3) gets overloaded — she's the one everyone depends on
INSERT INTO tasks (title, description, status, priority, assignee_id, project_id, due_date, estimated_hours) VALUES
  ('Fix pagination regression', 'Pagination broke after last deploy — users see duplicate rows', 'in-progress', 'urgent', 3, 2, date('now', '+1 days'), 4),
  ('Review PR #847: auth refactor', 'David needs Rachel to review the auth middleware rewrite', 'todo', 'high', 3, 2, date('now', '+2 days'), 3),
  ('Optimize slow SQL queries', 'Dashboard queries timing out for accounts with 10k+ tasks', 'todo', 'urgent', 3, 1, date('now', '+3 days'), 8),
  ('Investigate memory leak', 'Server memory usage climbing steadily — needs profiling', 'todo', 'high', 3, 2, date('now', '+2 days'), 6);

-- More tasks for James (5) — mostly low priority busy work
INSERT INTO tasks (title, description, status, priority, assignee_id, project_id, due_date, estimated_hours) VALUES
  ('Update README with setup instructions', 'New devs keep asking about local setup', 'todo', 'low', 5, 2, date('now', '+12 days'), 2),
  ('Add loading skeletons to task list', 'Replace spinner with skeleton loading states', 'todo', 'low', 5, 1, date('now', '+14 days'), 4),
  ('Clean up unused CSS variables', 'Audit and remove deprecated tokens from old design', 'todo', 'low', 5, 1, date('now', '+18 days'), 3);

-- More tasks for Olivia (6) — at-risk workload (4 high), QA focus
INSERT INTO tasks (title, description, status, priority, assignee_id, project_id, due_date, estimated_hours) VALUES
  ('Write E2E tests for project CRUD', 'Cover create, edit, delete flows with Playwright', 'todo', 'high', 6, 1, date('now', '+7 days'), 6),
  ('Regression test API v2 endpoints', 'Full regression pass on migrated endpoints before launch', 'todo', 'high', 6, 2, date('now', '+6 days'), 8),
  ('Test mobile auth flow', 'Verify biometric login on iOS and Android test devices', 'todo', 'high', 6, 3, date('now', '+10 days'), 4);

-- Settings
INSERT INTO settings (key, value) VALUES
  ('app_name', 'TaskFlow'),
  ('theme', 'light'),
  ('notifications_enabled', 'true'),
  ('default_view', 'board');
