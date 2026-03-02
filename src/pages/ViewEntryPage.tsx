import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Pencil,
  Calendar,
  Clock,
  ImageIcon,
  FileText,
} from 'lucide-react';
import type { JournalEntry } from '../types/journal';
import { getEntry } from '../storage/journalStorage';

export default function ViewEntryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    if (!id) return;
    getEntry(id).then((found) => {
      if (found) {
        setEntry(found);
      } else {
        navigate('/entries');
      }
    });
  }, [id, navigate]);

  if (!entry) {
    return (
      <div className="view-page">
        <p style={{ textAlign: 'center', padding: 60, color: '#9d9daa' }}>
          Loading entry...
        </p>
      </div>
    );
  }

  return (
    <div className="view-page">
      <div className="view-topbar">
        <button className="btn btn-ghost" onClick={() => navigate('/entries')}>
          <ArrowLeft size={18} />
          Back to Journal
        </button>
        <div className="view-topbar-actions">
          <span className="status-badge">
            {entry.images.length > 0 ? 'With Photos' : 'Text Only'}
          </span>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/entries/${entry.id}/edit`)}
          >
            <Pencil size={16} />
            Edit
          </button>
        </div>
      </div>

      <div className="view-header">
        <h1>{entry.title}</h1>
      </div>

      <div className="view-grid">
        <div className="view-main">
          <div className="card">
            <h2 className="card-title">
              <FileText size={20} />
              Entry Details
            </h2>
            <div className="card-meta">
              <div className="meta-item">
                <Calendar size={16} />
                <span>Date Written:</span>
                <strong>
                  {format(new Date(entry.createdAt), 'MMMM dd, yyyy')}
                </strong>
              </div>
              <div className="meta-item">
                <span>Status:</span>
                <span className="status-badge">
                  {entry.images.length > 0 ? 'With Photos' : 'Text Only'}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">My Writing</h2>
            <div className="entry-content">
              {entry.content ? (
                entry.content.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <p className="empty-note">No writing added yet.</p>
              )}
            </div>
          </div>

          {entry.images.length > 0 && (
            <div className="card">
              <h2 className="card-title">
                <ImageIcon size={20} />
                Photos
              </h2>
              <div className="image-gallery">
                {entry.images.map((img) => (
                  <div key={img.id} className="gallery-item">
                    <img src={img.url} alt={img.name} />
                    <span className="gallery-label">{img.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="view-sidebar">
          <div className="card card-accent">
            <h2 className="card-title">Timeline</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot blue" />
                <div>
                  <strong>Entry Created</strong>
                  <span>
                    {format(new Date(entry.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot green" />
                <div>
                  <strong>Last Updated</strong>
                  <span>
                    {format(new Date(entry.updatedAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">
              <Clock size={20} />
              Quick Stats
            </h2>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-value">
                  {entry.content.split(/\s+/).filter(Boolean).length}
                </span>
                <span className="stat-label">Words</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{entry.images.length}</span>
                <span className="stat-label">Photos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
