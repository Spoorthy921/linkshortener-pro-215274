import React, { useEffect } from "react";

// PUBLIC_INTERFACE
function Toast({ toast, onDismiss }) {
  /** Small transient message UI. */
  useEffect(() => {
    if (!toast) return;

    const t = setTimeout(() => onDismiss(), 3500);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="ToastWrap" role="status" aria-live="polite">
      <div className="Toast">
        <div className="ToastMessage">{toast.message}</div>
        <button className="ToastButton" type="button" onClick={onDismiss} aria-label="Dismiss notification">
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default Toast;
