import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, ImageIcon } from 'lucide-react';
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
              <div className="timeline-node-card">
                {entry.images.length > 0 && (
                  <div className="timeline-node-img">
                    <img src={entry.images[0].url} alt="" />
                  </div>
                )}
                <div className="timeline-node-content">
                  <span className="timeline-node-date">
                    {format(new Date(entry.createdAt), 'MMM dd, yyyy')}
                  </span>
                  <h4>{entry.title}</h4>
                  <p>{entry.content.length > 80 ? entry.content.slice(0, 80) + '...' : entry.content}</p>
                  {entry.images.length > 0 && (
                    <span className="timeline-node-photos">
                      <ImageIcon size={12} /> {entry.images.length} photo{entry.images.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
