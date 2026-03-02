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
        <div className="view-meta-row">
          <span className="view-meta-item">
            <Calendar size={14} />
            {format(new Date(entry.createdAt), 'MMMM dd, yyyy')}
          </span>
          <span className="view-meta-item">
            <Clock size={14} />
            Updated {format(new Date(entry.updatedAt), 'MMM dd, yyyy')}
          </span>
          <span className="view-meta-item">
            <FileText size={14} />
            {entry.content.split(/\s+/).filter(Boolean).length} words
          </span>
          {entry.images.length > 0 && (
            <span className="view-meta-item">
              <ImageIcon size={14} />
              {entry.images.length} photo{entry.images.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="view-body">
        <div className="card">
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
    </div>
  );
}
