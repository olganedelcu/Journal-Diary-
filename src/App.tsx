import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import EntriesPage from './pages/EntriesPage';
import ViewEntryPage from './pages/ViewEntryPage';
import EditEntryPage from './pages/EditEntryPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/entries" element={<EntriesPage />} />
          <Route path="/entries/new" element={<EditEntryPage />} />
          <Route path="/entries/:id" element={<ViewEntryPage />} />
          <Route path="/entries/:id/edit" element={<EditEntryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
