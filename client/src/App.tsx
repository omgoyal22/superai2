import { useState } from 'react';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import App1 from './App1';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  if (isAuthenticated && userProfile) {
    return <App1 userProfile={userProfile} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">y
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-white mb-6">Welcome to CSVvv Analytics</h1>
        {error && (
          <div className="mb-4 text-red-400 text-sm">
            {error}
          </div>
        )}
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const decoded = jwtDecode(credentialResponse.credential);
            setUserProfile(decoded);
            setIsAuthenticated(true);
          }}
          onError={() => {
            setError("Login failed. Please try again.");
          }}
        />
      </div>
    </div>
  );
}

export default App;