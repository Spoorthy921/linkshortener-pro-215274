import React, { useEffect, useMemo, useState } from "react";
import { deleteLink, getAnalytics, listLinks, updateLink } from "../api/client";
import CopyButton from "../components/CopyButton";

// PUBLIC_INTERFACE
function DashboardPage({ toast }) {
  /** Page for managing existing links and viewing basic analytics. */
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const [editingSlug, setEditingSlug] = useState(null);
  const [editLongUrl, setEditLongUrl] = useState("");

  const refresh = async () => {
    setIsLoading(true);
    try {
      const data = await listLinks();
      setItems(data.items || []);
    } catch (err) {
      toast.show(err.message || "Failed to load links.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = useMemo(
    () => items.find((x) => x.slug === selectedSlug) || null,
    [items, selectedSlug]
  );

  const loadAnalytics = async (slug) => {
    setSelectedSlug(slug);
    setAnalytics(null);
    try {
      const data = await getAnalytics(slug);
      setAnalytics(data);
    } catch (err) {
      toast.show(err.message || "Failed to load analytics.", "error");
    }
  };

  const startEdit = (row) => {
    setEditingSlug(row.slug);
    setEditLongUrl(row.long_url);
  };

  const cancelEdit = () => {
    setEditingSlug(null);
    setEditLongUrl("");
  };

  const saveEdit = async (slug) => {
    if (!editLongUrl.trim()) {
      toast.show("Destination URL cannot be empty.", "error");
      return;
    }
    try {
      await updateLink(slug, editLongUrl.trim());
      toast.show("Link updated.", "success");
      cancelEdit();
      await refresh();
      if (selectedSlug === slug) {
        await loadAnalytics(slug);
      }
    } catch (err) {
      toast.show(err.message || "Failed to update link.", "error");
    }
  };

  const remove = async (slug) => {
    try {
      await deleteLink(slug);
      toast.show("Link deleted.", "success");
      if (selectedSlug === slug) {
        setSelectedSlug(null);
        setAnalytics(null);
      }
      await refresh();
    } catch (err) {
      toast.show(err.message || "Failed to delete link.", "error");
    }
  };

  return (
    <section className="Stack">
      <div className="PanelGrid">
        <div className="Panel Row" style={{ justifyContent: "space-between" }}>
          <div className="Stack" style={{ gap: 6 }}>
            <h2 className="Title">Dashboard</h2>
            <p className="Subtitle">Manage, edit, delete, and inspect click counts.</p>
          </div>
          <button className="Button" onClick={refresh} type="button" disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="PanelGrid">
        <div className="Panel">
          <table className="Table" aria-label="Short links table">
            <thead>
              <tr>
                <th>Slug</th>
                <th>Short link</th>
                <th>Destination</th>
                <th>Clicks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                    {isLoading ? "Loading..." : "No links yet. Create one in the Shorten tab."}
                  </td>
                </tr>
              ) : (
                items.map((row) => {
                  const isEditing = editingSlug === row.slug;
                  return (
                    <tr key={row.slug}>
                      <td style={{ fontFamily: "var(--font-mono)", fontWeight: 800 }}>{row.slug}</td>

                      <td>
                        <a className="Link" href={row.short_url} target="_blank" rel="noreferrer">
                          {row.short_url}
                        </a>
                        <div style={{ marginTop: 8 }}>
                          <CopyButton value={row.short_url} toast={toast} />
                        </div>
                      </td>

                      <td>
                        {isEditing ? (
                          <div className="Stack">
                            <input
                              className="Input"
                              value={editLongUrl}
                              onChange={(e) => setEditLongUrl(e.target.value)}
                              aria-label={`Edit destination for ${row.slug}`}
                            />
                            <div className="Row" style={{ justifyContent: "flex-start" }}>
                              <button
                                className="Button ButtonPrimary"
                                type="button"
                                onClick={() => saveEdit(row.slug)}
                              >
                                Save
                              </button>
                              <button className="Button" type="button" onClick={cancelEdit}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="Truncate" title={row.long_url} style={{ fontFamily: "var(--font-mono)" }}>
                            {row.long_url}
                          </div>
                        )}
                      </td>

                      <td style={{ fontFamily: "var(--font-mono)" }}>{row.click_count}</td>

                      <td>
                        <div className="Row" style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                          <button className="Button" type="button" onClick={() => loadAnalytics(row.slug)}>
                            Analytics
                          </button>
                          <button className="Button" type="button" onClick={() => startEdit(row)} disabled={isEditing}>
                            Edit
                          </button>
                          <button className="Button ButtonDanger" type="button" onClick={() => remove(row.slug)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="PanelGrid">
        <div className="Panel Stack">
          <div className="Row" style={{ justifyContent: "space-between" }}>
            <div className="Stack" style={{ gap: 6 }}>
              <h3 className="Title" style={{ fontSize: 18 }}>
                Analytics
              </h3>
              <p className="Subtitle">Select a link to view basic stats.</p>
            </div>
            {selected ? <span className="Badge">Selected: {selected.slug}</span> : <span className="Badge">None</span>}
          </div>

          {selected && analytics ? (
            <div className="Stack" style={{ gap: 10 }}>
              <div className="Row" style={{ justifyContent: "space-between" }}>
                <span className="Badge">Clicks: {analytics.click_count}</span>
                <span className="Badge">
                  Last clicked: {analytics.last_clicked_at ? analytics.last_clicked_at : "—"}
                </span>
              </div>
              <div>
                <div className="Label">Destination</div>
                <div style={{ fontFamily: "var(--font-mono)" }}>{selected.long_url}</div>
              </div>
            </div>
          ) : (
            <div style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
              {selectedSlug && !analytics ? "Loading analytics..." : "Pick a link above and click Analytics."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
