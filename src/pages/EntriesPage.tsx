import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Eye, Pencil, Trash2, Search, BookOpen, PenLine, LogOut } from 'lucide-react';
import type { JournalEntry } from '../types/journal';
import { getEntries, deleteEntry } from '../storage/journalStorage';
import { useAuth } from '../context/AuthContext';

export default function EntriesPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    getEntries().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const filtered = entries.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.content.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
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
        <p style={{ textAlign: 'center', padding: 60, color: '#9d9daa' }}>
          Loading your journal...
        </p>
      </div>
    );
  }

  return (
    <div className="entries-page">
      <div className="entries-header">
        <h1>
          <BookOpen size={28} />
          My Journal
        </h1>
        <div className="entries-header-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/entries/new')}
          >
            <Plus size={18} />
            Add Diary Page
          </button>
          <button className="btn btn-ghost btn-sm" onClick={signOut}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by title or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} />
          <p>No journal entries yet. Start writing!</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/entries/new')}
          >
            <PenLine size={18} />
            Add Your First Entry
          </button>
        </div>
      ) : (
        <div className="entries-table-wrapper">
          <table className="entries-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Preview</th>
                <th>Images</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id}>
                  <td className="td-date">
                    {format(new Date(entry.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="td-title">{entry.title}</td>
                  <td className="td-preview">{truncate(entry.content, 60)}</td>
                  <td className="td-images">
                    {entry.images.length > 0 ? (
                      <span className="image-badge">
                        {entry.images.length} photo
                        {entry.images.length > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="muted">-</span>
                    )}
                  </td>
                  <td className="td-date">
                    {format(new Date(entry.updatedAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="td-actions">
                    <button
                      className="icon-btn"
                      title="View"
                      onClick={() => navigate(`/entries/${entry.id}`)}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="icon-btn"
                      title="Edit"
                      onClick={() => navigate(`/entries/${entry.id}/edit`)}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="icon-btn icon-btn-danger"
                      title="Delete"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
