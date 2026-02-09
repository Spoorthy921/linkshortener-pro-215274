import React, { useMemo, useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import useToast from "./hooks/useToast";
import Toast from "./components/Toast";

// PUBLIC_INTERFACE
function App() {
  /** Root application component. */
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("shorten");
  const toast = useToast();

  // Avoid direct DOM manipulation: theme is applied via a top-level class.
  const appClassName = useMemo(() => `App theme-${theme}`, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className={appClassName}>
      <NavBar
        theme={theme}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      <main className="Main">
        {activeTab === "shorten" ? (
          <HomePage toast={toast} />
        ) : (
          <DashboardPage toast={toast} />
        )}
      </main>

      <footer className="Footer">
        <div className="Footer-inner">
          <span className="Footer-brand">LinkShortener Pro</span>
          <span className="Footer-meta">Retro-grade links with click tracking.</span>
        </div>
      </footer>

      <Toast toast={toast.toast} onDismiss={toast.dismiss} />
    </div>
  );
}

export default App;
