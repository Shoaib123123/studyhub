import React from "react";

function EmptyState({
  title = "Nothing here",
  message = "There is nothing to display.",
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;