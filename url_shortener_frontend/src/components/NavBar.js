import React from "react";

// PUBLIC_INTERFACE
function NavBar({ theme, onToggleTheme, activeTab, onSelectTab }) {
  /** Top navigation with tab selection and theme toggle. */

  return (
    <header className="PanelGrid" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0 }}>
      <div className="Panel" style={{ padding: "16px 18px" }}>
        <div className="Row" style={{ justifyContent: "space-between" }}>
          <div className="Stack" style={{ gap: 6 }}>
            <h1 className="Title" style={{ fontSize: 20, margin: 0, fontFamily: "var(--font-mono)" }}>
              LinkShortener Pro
            </h1>
            <p className="Subtitle" style={{ margin: 0 }}>
              A tiny retro URL shortener with a dashboard and click tracking.
            </p>
          </div>

          <div className="Row" style={{ gap: 10 }}>
            <nav className="Row" aria-label="Primary navigation">
              <button
                className={`Button ${activeTab === "shorten" ? "ButtonPrimary" : ""}`}
                onClick={() => onSelectTab("shorten")}
                type="button"
              >
                Shorten
              </button>
              <button
                className={`Button ${activeTab === "dashboard" ? "ButtonPrimary" : ""}`}
                onClick={() => onSelectTab("dashboard")}
                type="button"
              >
                Dashboard
              </button>
            </nav>

            <button className="Button" onClick={onToggleTheme} type="button" aria-label="Toggle theme">
              Theme: {theme}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
