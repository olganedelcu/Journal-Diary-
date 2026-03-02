import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Trash2, Search, BookOpen,
  PenLine, LogOut, Clock, ImageIcon, Calendar,
} from 'lucide-react';
import type { JournalEntry } from '../types/journal';
import { getEntries, deleteEntry } from '../storage/journalStorage';
import { useAuth } from '../context/AuthContext';

export default function EntriesPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    getEntries().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const filtered = entries
    .filter(
      (e) =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this entry?')) return;
    await deleteEntry(id);
    const updated = await getEntries();
    setEntries(updated);
  }

  function truncate(text: string, len: number) {
    if (text.length <= len) return text;
    return text.slice(0, len) + '...';
  }

  if (loading) {
    return (
      <div className="entries-page">
        <div className="loading-screen" style={{ minHeight: 'auto', padding: 60, background: 'none' }}>
          <div className="loading-spinner" />
          <p>Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="entries-page">
      {/* Topbar: email + logout */}
      <div className="welcome-topbar">
        <span className="welcome-email">{user?.email}</span>
        <button className="btn btn-ghost btn-sm" onClick={signOut}>
          <LogOut size={16} />
        </button>
      </div>

      {/* Hero section: welcome + icon cards */}
      <div className="entries-hero">
        <h1>Welcome</h1>
        <p className="welcome-subtitle">Your personal digital journal starts here</p>

        <div className="welcome-grid">
          <button className="welcome-card" onClick={() => navigate('/entries/new')}>
            <div className="welcome-card-icon">
              <PenLine size={28} />
            </div>
            <span>Write</span>
          </button>
          <button className="welcome-card" onClick={() => document.getElementById('search-input')?.focus()}>
            <div className="welcome-card-icon">
              <BookOpen size={28} />
            </div>
            <span>Journal</span>
          </button>
          <button className="welcome-card" onClick={() => navigate('/timeline')}>
            <div className="welcome-card-icon">
              <Clock size={28} />
            </div>
            <span>Timeline</span>
          </button>
          <button className="welcome-card" onClick={() => navigate('/entries/new')}>
            <div className="welcome-card-icon">
              <ImageIcon size={28} />
            </div>
            <span>Photos</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="entries-content">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            id="search-input"
            type="text"
            placeholder="Search by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Diary page cards */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} />
            <h2>No entries yet</h2>
            <p>Start capturing your thoughts, memories, and moments.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/entries/new')}
            >
              <PenLine size={18} />
              Write Your First Entry
            </button>
          </div>
        ) : (
          <div className="diary-grid">
            {filtered.map((entry) => (
              <article
                key={entry.id}
                className="diary-card"
                onClick={() => navigate(`/entries/${entry.id}`)}
              >
                {entry.images.length > 0 && (
                  <div className="diary-card-img">
                    <img src={entry.images[0].url} alt="" />
                  </div>
                )}
                <div className="diary-card-body">
                  <h3 className="diary-card-title">{entry.title}</h3>
                  <p className="diary-card-text">{truncate(entry.content, 150)}</p>
                  <div className="diary-card-footer">
                    <span className="diary-card-date">
                      <Calendar size={14} />
                      {format(new Date(entry.createdAt), 'MMM dd, yyyy')}
                    </span>
                    {entry.images.length > 0 && (
                      <span className="diary-card-photos">
                        <ImageIcon size={14} />
                        {entry.images.length}
                      </span>
                    )}
                    <button
                      className="diary-card-delete icon-btn icon-btn-danger"
                      title="Delete"
                      onClick={(e) => handleDelete(entry.id, e)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
