import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthScreen } from "./components/AuthScreen";
import { Layout } from "./components/Layout";
import { DashboardScreen } from "./components/DashboardScreen";
import { ChatScreen } from "./components/ChatScreen";
import { TaxesScreen } from "./components/TaxesScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { IncomeScreen } from "./components/IncomeScreen";
import { ExpensesScreen } from "./components/ExpensesScreen";
import { DocumentsScreen } from "./components/DocumentsScreen";
import { ArchiveScreen } from "./components/ArchiveScreen";
import { FormsHubScreen } from "./components/FormsHubScreen";
import { DeclarationScreen } from "./components/DeclarationScreen";
import { InvoiceScreen } from "./components/InvoiceScreen";
import { TaxCalendarScreen } from "./components/TaxCalendarScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { KnowledgeBaseScreen } from "./components/KnowledgeBaseScreen";
import { CurrencyDashboard } from "./components/CurrencyDashboard";
import { ClientCRMScreen } from "./components/ClientCRMScreen";
import { ArticleDetailScreen } from "./components/ArticleDetailScreen";
import { LegalDigestScreen } from "./components/LegalDigestScreen";
import { ThemeProvider } from "./components/ThemeProvider";
import { isAuthenticated, logoutBackend } from "./services/authApi";
import { fetchCurrentUser, User } from "./services/userService";
import { auth } from "./lib/firebase";
import { setAccessToken } from "./services/authToken";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  const ensureTokenFromFirebase = async () => {
    // Якщо токену немає в localStorage, але є активний Firebase user — беремо idToken
    if (isAuthenticated()) return;
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true);
      setAccessToken(token);
    }
  };

  const loadProfile = async () => {
    try {
      await ensureTokenFromFirebase();
      if (!isAuthenticated()) {
        setUser(null);
      } else {
        const me = await fetchCurrentUser();
        setUser(me);
      }
    } catch (e) {
      console.error("Failed to load profile", e);
      setUser(null);
      logoutBackend();
    } finally {
      setInitialized(true);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogin = async (loggedInUser?: User) => {
    if (loggedInUser) {
      setUser(loggedInUser);
      return;
    }

    // если бэк не отдаёт пользователя в login/register, дёргаем /auth/me
    await loadProfile();
  };

  const handleLogout = () => {
    logoutBackend();
    setUser(null);
  };

  if (!initialized) {
    return <div>Завантаження…</div>;
  }

  if (!user) {
    return (
      <ThemeProvider>
        <AuthScreen onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  // Якщо онбординг не пройдено — показуємо окремий екран без лейаута
  if (!user.onboarding_completed) {
    return (
      <ThemeProvider>
        <OnboardingScreen
          defaultFullName={`${user.first_name} ${user.last_name}`.trim()}
          defaultEmail={user.email}
          defaultPhone={user.phone ?? ""}
          onComplete={(updatedUser) => setUser(updatedUser)}
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout
          onLogout={handleLogout}
          userName={user ? `${user.first_name} ${user.last_name}`.trim() : undefined}
        >
          <Routes>
            <Route
              path="/"
              element={<DashboardScreen userName={user ? `${user.first_name} ${user.last_name}` : undefined} />}
            />
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/income" element={<IncomeScreen />} />
            <Route path="/taxes" element={<TaxesScreen />} />
            <Route
              path="/profile"
              element={
                <ProfileScreen
                  user={user}
                  onUserUpdated={setUser}
                />
              }
            />
            <Route path="/expenses" element={<ExpensesScreen />} />
            <Route path="/documents" element={<DocumentsScreen />} />
            <Route path="/archive" element={<ArchiveScreen />} />
            <Route path="/forms" element={<FormsHubScreen />} />
            <Route path="/forms/declaration" element={<DeclarationScreen />} />
            <Route path="/forms/invoice" element={<InvoiceScreen />} />
            <Route path="/calendar" element={<TaxCalendarScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/knowledge-base" element={<KnowledgeBaseScreen />} />
            <Route path="/knowledge/:id" element={<ArticleDetailScreen />} />
            <Route path="/currency-dashboard" element={<CurrencyDashboard />} />
            <Route path="/client-crm" element={<ClientCRMScreen />} />
            <Route path="/legal-digest" element={<LegalDigestScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
