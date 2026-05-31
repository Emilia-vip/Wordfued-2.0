
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  const [page, setPage] = useState<'login' | 'signup'>('login');
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');

    if (savedToken) setToken(savedToken);
    if (savedUsername) setUsername(savedUsername);
  }, []);

  function handleLogin(auth: { token: string; username: string }) {
    setToken(auth.token);
    setUsername(auth.username);
    setPage('login');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    setPage('login');
  }

  if (token) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <p className="auth-kicker">Signed in</p>
          <h1>Welcome{username ? `, ${username}` : ''}</h1>
          <p className="auth-message">Du är inloggad och token finns sparad i localStorage.</p>
          <button type="button" className="logout-button" onClick={handleLogout}>
            Log out
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-switcher">
          <button type="button" className={page === 'login' ? 'active' : ''} onClick={() => setPage('login')}>
            Log in
          </button>
          <button type="button" className={page === 'signup' ? 'active' : ''} onClick={() => setPage('signup')}>
            Sign up
          </button>
        </div>

        {page === 'login' ? <LoginPage onLogin={handleLogin} /> : <SignupPage onSuccess={() => setPage('login')} />}
      </section>
    </main>
  );
}

export default App;
