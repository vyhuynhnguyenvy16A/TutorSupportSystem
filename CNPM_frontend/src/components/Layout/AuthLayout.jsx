import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout" style={{ padding: 20 }}>
      <div>{children}</div>
    </div>
  );
}
