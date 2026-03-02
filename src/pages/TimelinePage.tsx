import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import type { JournalEntry } from '../types/journal';
import { getEntries } from '../storage/journalStorage';

export default function TimelinePage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getEntries().then((data) => {
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setEntries(sorted);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="timeline-page">
        <div className="loading-screen" style={{ minHeight: 'auto', padding: 60, background: 'none' }}>
          <div className="loading-spinner" />
          <p>Loading timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-page">
      <div className="timeline-topbar">
        <button className="btn btn-ghost" onClick={() => navigate('/entries')}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2>Your Timeline</h2>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <p>No entries yet. Write your first entry to see your timeline.</p>
        </div>
      ) : (
        <div className="timeline-map">
          <div className="timeline-line" />
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              className={`timeline-node ${i % 2 === 0 ? 'left' : 'right'}`}
              onClick={() => navigate(`/entries/${entry.id}`)}
            >
              <div className="timeline-node-dot" />
              <div className="timeline-node-strike" />
              <div className="timeline-node-card">
                <div className="timeline-node-content">
                  <span className="timeline-node-date">
                    {format(new Date(entry.createdAt), 'MMM dd, yyyy')}
                  </span>
                  <p>{entry.content.length > 80 ? entry.content.slice(0, 80) + '...' : entry.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
