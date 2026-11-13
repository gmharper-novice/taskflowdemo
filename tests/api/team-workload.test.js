import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../server/index.js';
import { AT_RISK_MIN, OVERLOAD_MIN } from '../../server/routes/teams.js';

let server;
let baseUrl;

beforeAll(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}/api`;
      resolve();
    });
  });
});

afterAll(() => {
  server?.close();
});

describe('Team workload API', () => {
  it('GET /api/team/workload returns members, summary and thresholds', async () => {
    const res = await fetch(`${baseUrl}/team/workload`);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.thresholds).toEqual({ at_risk: AT_RISK_MIN, overloaded: OVERLOAD_MIN });
    expect(body.members.length).toBeGreaterThan(0);
    expect(body.members[0]).toHaveProperty('high_urgent');
    expect(body.members[0]).toHaveProperty('load_level');
  });

  it('applies the overload rule to open high + urgent tasks', async () => {
    const { members } = await (await fetch(`${baseUrl}/team/workload`)).json();

    for (const m of members) {
      expect(m.high_urgent).toBe(m.high + m.urgent);
      expect(m.open_count).toBe(m.urgent + m.high + m.medium + m.low);
      const expected = m.high_urgent >= OVERLOAD_MIN ? 'overloaded'
        : m.high_urgent >= AT_RISK_MIN ? 'at-risk' : 'normal';
      expect(m.load_level).toBe(expected);
    }
  });

  it('only counts todo and in-progress tasks', async () => {
    const { members } = await (await fetch(`${baseUrl}/team/workload`)).json();
    const first = members[0];
    const tasks = await (await fetch(`${baseUrl}/team/${first.id}/tasks`)).json();
    const open = tasks.filter((t) => t.status === 'todo' || t.status === 'in-progress');

    expect(first.open_count).toBe(open.length);
  });

  it('sorts overloaded first, then at-risk, then everyone else', async () => {
    const { members, summary } = await (await fetch(`${baseUrl}/team/workload`)).json();
    const rank = { overloaded: 0, 'at-risk': 1, normal: 2 };
    const ranks = members.map((m) => rank[m.load_level]);

    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    expect(summary.overloaded).toBe(members.filter((m) => m.load_level === 'overloaded').length);
    expect(summary.at_risk).toBe(members.filter((m) => m.load_level === 'at-risk').length);
  });

  it('is not shadowed by GET /api/team/:id', async () => {
    const res = await fetch(`${baseUrl}/team/workload`);
    const body = await res.json();
    expect(body).not.toHaveProperty('error');
  });
});
