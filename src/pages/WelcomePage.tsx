import { useNavigate } from 'react-router-dom';
import { PenLine, BookOpen, Clock, ImageIcon } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <h1>Welcome</h1>
        <p className="welcome-subtitle">
          Your personal digital journal starts here
        </p>

        <div className="welcome-grid">
          <button
            className="welcome-card"
            onClick={() => navigate('/entries/new')}
          >
            <div className="welcome-card-icon">
              <PenLine size={28} />
            </div>
            <span>Write</span>
          </button>

          <button
            className="welcome-card"
            onClick={() => navigate('/entries')}
          >
            <div className="welcome-card-icon">
              <BookOpen size={28} />
            </div>
            <span>Journal</span>
          </button>

          <button
            className="welcome-card"
            onClick={() => navigate('/entries')}
          >
            <div className="welcome-card-icon">
              <Clock size={28} />
            </div>
            <span>Timeline</span>
          </button>

          <button
            className="welcome-card"
            onClick={() => navigate('/entries/new')}
          >
            <div className="welcome-card-icon">
              <ImageIcon size={28} />
            </div>
            <span>Photos</span>
          </button>
        </div>
      </div>
    </div>
  );
}
