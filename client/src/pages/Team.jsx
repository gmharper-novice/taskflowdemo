import { useState } from 'react';
import { useTeam } from '../hooks/useTeam';
import { useWorkload } from '../hooks/useWorkload';
import MemberList from '../components/team/MemberList';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import WorkloadSummary from '../components/team/workload/WorkloadSummary';
import LoadLegend from '../components/team/workload/LoadLegend';
import VariantTabs from '../components/team/workload/VariantTabs';
import InlineError from '../components/team/workload/InlineError';
import ExpandableRowsView from '../components/team/workload/ExpandableRowsView';
import SlideOutView from '../components/team/workload/SlideOutView';
import ModalDeepDiveView from '../components/team/workload/ModalDeepDiveView';

const variantViews = {
  expandable: ExpandableRowsView,
  slideout: SlideOutView,
  modal: ModalDeepDiveView,
};

function WorkloadView() {
  const [variant, setVariant] = useState('expandable');
  const { data, loading, error, refetch } = useWorkload();

  if (loading && !data) return <Spinner />;
  if (error) {
    return (
      <InlineError
        title="Couldn't load team workload"
        message={`${error}. Check the server is running, then retry.`}
        onRetry={refetch}
      />
    );
  }

  const { members, summary, thresholds } = data;
  const scaleMax = Math.max(...members.map((m) => m.open_count), 1);
  const VariantView = variantViews[variant];

  return (
    <div>
      <WorkloadSummary summary={summary} memberCount={members.length} />
      <LoadLegend thresholds={thresholds} />
      <VariantTabs value={variant} onChange={setVariant} />
      {/* key resets selection/expansion state when switching variants */}
      <VariantView key={variant} members={members} thresholds={thresholds} scaleMax={scaleMax} />
    </div>
  );
}

export default function Team() {
  const [view, setView] = useState('list');
  const { data: members, loading } = useTeam();

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h1>Team</h1>
          <p>{view === 'list' ? 'Your product team members' : 'Who has too much on their plate right now'}</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="small" onClick={() => setView('list')}>List</Button>
          <Button variant={view === 'workload' ? 'secondary' : 'ghost'} size="small" onClick={() => setView('workload')}>Workload</Button>
        </div>
      </div>

      {view === 'list' ? (loading ? <Spinner /> : <MemberList members={members} />) : <WorkloadView />}
    </div>
  );
}
