import React, { useState } from "react";
import { createLink } from "../api/client";
import CopyButton from "../components/CopyButton";

// PUBLIC_INTERFACE
function HomePage({ toast }) {
  /** Page for creating a short link. */
  const [longUrl, setLongUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setCreated(null);

    if (!longUrl.trim()) {
      toast.show("Please enter a URL to shorten.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await createLink(longUrl.trim(), customSlug.trim());
      setCreated(data);
      toast.show("Short link created.", "success");
    } catch (err) {
      toast.show(err.message || "Failed to create short link.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="PanelGrid">
      <div className="Panel Stack">
        <div className="Stack" style={{ gap: 6 }}>
          <h2 className="Title">Shorten a URL</h2>
          <p className="Subtitle">Create a short link you can share. Custom slugs are optional.</p>
        </div>

        <form className="Stack" onSubmit={submit}>
          <div>
            <label className="Label" htmlFor="longUrl">
              Long URL
            </label>
            <input
              id="longUrl"
              className="Input"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://example.com/some/very/long/path"
              inputMode="url"
              autoComplete="off"
              required
            />
            <div className="HelpText">Tip: include https:// for best results.</div>
          </div>

          <div>
            <label className="Label" htmlFor="customSlug">
              Custom slug (optional)
            </label>
            <input
              id="customSlug"
              className="Input"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="my-campaign"
              autoComplete="off"
            />
            <div className="HelpText">Allowed: letters, numbers, "_" or "-", length 3–64.</div>
          </div>

          <div className="Row" style={{ justifyContent: "flex-start" }}>
            <button className="Button ButtonPrimary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create short link"}
            </button>
            <span className="Badge">Redirect path: /r/&lt;slug&gt;</span>
          </div>
        </form>

        {created ? (
          <div className="PanelGrid" style={{ boxShadow: "none" }}>
            <div className="Panel Stack">
              <div className="Row" style={{ justifyContent: "space-between" }}>
                <div className="Stack" style={{ gap: 4 }}>
                  <div className="Label">Your short link</div>
                  <a className="Link" href={created.short_url} target="_blank" rel="noreferrer">
                    {created.short_url}
                  </a>
                </div>
                <CopyButton value={created.short_url} toast={toast} />
              </div>

              <div>
                <div className="Label">Destination</div>
                <div className="Truncate" title={created.long_url} style={{ fontFamily: "var(--font-mono)" }}>
                  {created.long_url}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default HomePage;
