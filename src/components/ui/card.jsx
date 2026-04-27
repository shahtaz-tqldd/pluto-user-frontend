export const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
  >
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="mb-6 border-b border-gray-100 pb-4">{children}</div>
);
