import { PackageSearch } from "lucide-react";

export default function EmptyState({ title = "Nothing here", message, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <PackageSearch className="text-gray-400" size={28} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      {message && <p className="text-sm text-gray-500 max-w-xs mb-5">{message}</p>}
      {action && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  );
}
