import React, { createContext, useContext, useState } from "react";

// Define the toast structure
interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "error" | "info" | "warning" | "destructive";
}

// Contexts
const ToastContext = createContext<{
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
} | null>(null);

// Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 15); // Generate unique ID
    setToasts((prev) => [...prev, { id, ...toast }]);
    setTimeout(() => removeToast(id), 5000); // Auto-remove after 5 seconds
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} removeToast={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook to use the Toast Context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// ToastItem Component
const ToastItem: React.FC<{ toast: Toast; removeToast: () => void }> = ({ toast, removeToast }) => {
  const getVariantStyle = () => {
    switch (toast.variant) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
      case "destructive":
        return "bg-red-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      case "warning":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-700 text-white";
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-md shadow-lg ${getVariantStyle()}`}
    >
      <div>
        <strong>{toast.title}</strong>
        {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
      </div>
      <button onClick={removeToast} className="ml-4 text-sm font-bold">
        ✖
      </button>
    </div>
  );
};
