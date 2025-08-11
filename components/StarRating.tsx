export default function StarRating({ value = 0, outOf = 5 }: { value?: number; outOf?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: outOf }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${i < value ? "fill-yellow-400 stroke-yellow-400" : "fill-transparent stroke-slate-300"}`}
        >
          <path strokeWidth="1.5" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      ))}
    </div>
  );
}