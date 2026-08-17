import { useState } from "react";

export default function SearchBar({ onSearch, isLoading }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-zinc-500">
          r/
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="technology"
          disabled={isLoading}
          className="w-full rounded-full border border-zinc-700 bg-zinc-900 py-3 pl-9 pr-4 text-base text-zinc-100
                     placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#FF4500]
                     disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="shrink-0 rounded-full bg-[#FF4500] px-6 py-3 font-semibold text-white transition
                   hover:bg-[#e03d00] active:scale-[0.98]
                   disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:opacity-60"
      >
        {isLoading ? "Checking..." : "Check Vibe"}
      </button>
    </form>
  );
}