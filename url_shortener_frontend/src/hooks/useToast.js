import { useCallback, useState } from "react";

// PUBLIC_INTERFACE
function useToast() {
  /** Manage toast notifications. */
  const [toast, setToast] = useState(null);

  // PUBLIC_INTERFACE
  const show = useCallback((message, tone = "info") => {
    setToast({ message, tone, id: String(Date.now()) });
  }, []);

  // PUBLIC_INTERFACE
  const dismiss = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, show, dismiss };
}

export default useToast;
