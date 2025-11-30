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
import { FormsHubScreen } from "./components/FormsHubScreen";
import { DeclarationScreen } from "./components/DeclarationScreen";
import { InvoiceScreen } from "./components/InvoiceScreen";
import { TaxCalendarScreen } from "./components/TaxCalendarScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { KnowledgeBaseScreen } from "./components/KnowledgeBaseScreen";
import { CurrencyDashboard } from "./components/CurrencyDashboard";
import { ClientCRMScreen } from "./components/ClientCRMScreen";
import { ArticleDetailScreen } from "./components/ArticleDetailScreen";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user was previously logged in
    const wasLoggedIn = localStorage.getItem("fopilot-authenticated");
    const hasCompletedOnboarding = localStorage.getItem("fopilot-onboarding-completed");
    
    if (wasLoggedIn === "true") {
      setIsAuthenticated(true);
      if (hasCompletedOnboarding !== "true") {
        setShowOnboarding(true);
      }
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("fopilot-authenticated", "true");
    // Show onboarding for new users
    const hasCompletedOnboarding = localStorage.getItem("fopilot-onboarding-completed");
    if (hasCompletedOnboarding !== "true") {
      setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("fopilot-authenticated");
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem("fopilot-onboarding-completed", "true");
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <AuthScreen onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  if (showOnboarding) {
    return (
      <ThemeProvider>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<DashboardScreen />} />
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/income" element={<IncomeScreen />} />
            <Route path="/taxes" element={<TaxesScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/expenses" element={<ExpensesScreen />} />
            <Route path="/documents" element={<DocumentsScreen />} />
            <Route path="/forms" element={<FormsHubScreen />} />
            <Route path="/forms/declaration" element={<DeclarationScreen />} />
            <Route path="/forms/invoice" element={<InvoiceScreen />} />
            <Route path="/calendar" element={<TaxCalendarScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/knowledge-base" element={<KnowledgeBaseScreen />} />
            <Route path="/knowledge/:id" element={<ArticleDetailScreen />} />
            <Route path="/currency-dashboard" element={<CurrencyDashboard />} />
            <Route path="/client-crm" element={<ClientCRMScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}