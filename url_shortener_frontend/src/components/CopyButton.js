import React, { useState } from "react";

// PUBLIC_INTERFACE
function CopyButton({ value, toast }) {
  /** Button that copies a string to the clipboard. */
  const [isCopying, setIsCopying] = useState(false);

  const onCopy = async () => {
    if (!value) return;
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(value);
      toast.show("Copied to clipboard.", "success");
    } catch (err) {
      toast.show("Copy failed (clipboard permission).", "error");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <button className="Button" type="button" onClick={onCopy} disabled={isCopying}>
      {isCopying ? "Copying..." : "Copy"}
    </button>
  );
}

export default CopyButton;
