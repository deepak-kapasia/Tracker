import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('subjects'); // 'subjects' or 'dailylog'

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', currentUser);
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const handleUserSelect = (userName) => {
    setCurrentUser(userName);
    setCurrentView('subjects'); // Reset to subjects view when switching users
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('subjects');
  };

  return (
    <div className="min-h-screen">
      {!currentUser ? (
        <LandingPage onUserSelect={handleUserSelect} />
      ) : (
        <Dashboard
          currentUser={currentUser}
          currentView={currentView}
          setCurrentView={setCurrentView}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
