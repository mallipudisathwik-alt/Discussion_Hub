export default function RichTextEditor({ value, onChange, placeholder = 'Write your content here...' }) {
  return (
    <div className="bg-[#0f172a] border border-[#475569] rounded-md overflow-hidden">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-[#475569] bg-[#1e293b]">
        {['Bold', 'Italic', 'Link', 'List'].map((btn) => (
          <button
            key={btn}
            type="button"
            className="text-gray-400 hover:text-white px-2 py-1 text-xs rounded hover:bg-[#334155] transition"
          >
            {btn}
          </button>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0f172a] text-gray-200 p-4 focus:outline-none min-h-[200px] resize-y"
        rows={8}
      />
    </div>
  )
}
