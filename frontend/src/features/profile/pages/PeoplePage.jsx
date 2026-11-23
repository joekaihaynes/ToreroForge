import { useState } from 'react';
import { useProfileSearch } from '../useProfile.js';
import ProfileCard from '../components/ProfileCard.jsx';
import { SCHOOLS, SKILLS, ROLES } from '../../../shared/taxonomy.js';

// Search profiles by name/major, skill and school (spec 2B search interface;
// user story 6: faculty search students by skill).
export default function PeoplePage() {
  const [filters, setFilters] = useState({ q: '', skill: '', school: '', role: '' });
  const { results, loading, error } = useProfileSearch(filters);

  const set = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <h1>People</h1>
      <div className="filters">
        <input aria-label="Search by name or major" placeholder="Search by name or major" value={filters.q} onChange={set('q')} />
        <select aria-label="School" value={filters.school} onChange={set('school')}>
          <option value="">All schools</option>
          {SCHOOLS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select aria-label="Skill" value={filters.skill} onChange={set('skill')}>
          <option value="">All skills</option>
          {SKILLS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select aria-label="Role" value={filters.role} onChange={set('role')}>
          <option value="">All roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>)}
        </select>
      </div>

      {error ? (
        <p className="error">{error}</p>
      ) : loading ? (
        <p className="muted">Searching…</p>
      ) : results.length === 0 ? (
        <p className="muted">No one matches those filters yet.</p>
      ) : (
        <div className="card-grid">
          {results.map((p) => <ProfileCard key={p.id} profile={p} />)}
        </div>
      )}
    </div>
  );
}