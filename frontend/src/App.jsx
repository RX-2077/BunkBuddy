// src/App.jsx
import { AuthProvider } from "./auth/AuthContext";
import AppRouter from "./routes/AppRouter";
import { firebaseConfigured } from "./lib/firebase";

function FirebaseSetupNotice() {
  return (
    <main className="page setup-notice">
      <p className="eyebrow">Attendance Planner</p>
      <h1>Firebase setup required</h1>
      <p>Add your Firebase web configuration to <strong>.env.local</strong>, then restart the development server.</p>
      <p className="muted">Use <strong>.env.local.example</strong> as the template. The app cannot log in or persist data until Firebase is configured.</p>
    </main>
  );
}

export default function App() {
  if (!firebaseConfigured) return <FirebaseSetupNotice />;

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
