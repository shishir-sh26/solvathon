export default function ChatWindow({ context }: { context?: string }) {
  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border border-gray-300 rounded-lg shadow-2xl flex flex-col overflow-hidden">
      <div className="bg-blue-600 text-white p-3 font-semibold text-sm">
        Placement Bot {context ? `(${context})` : ''}
      </div>
      <div className="p-4 h-48 bg-gray-50 text-xs text-gray-500 flex items-end">
        How can I help you today?
      </div>
      <input type="text" placeholder="Ask Jarvis..." className="p-3 border-t outline-none text-sm" />
    </div>
  )
}