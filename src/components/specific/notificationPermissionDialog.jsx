import React from "react";

const NotificationPermissionDialog = ({ onEnable, onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 transform transition-all scale-100 animate-[fadeIn_0.25s_ease-out]">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span role="img" aria-label="bell">🔔</span> Enable Notifications
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Allow notifications to stay updated with new messages, even when your browser is closed.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onDismiss}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={onEnable}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
          >
            Enable
          </button>
        </div>
      </div>

      {/* Inline animation style */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default NotificationPermissionDialog;
