export function LoadingDots() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span
        className="size-2 rounded-full bg-primary motion-reduce:opacity-70"
        style={{
          animation: "pulse 1.4s ease-in-out infinite",
          animationDelay: "0s",
        }}
      />
      <span
        className="size-2 rounded-full bg-primary motion-reduce:opacity-70"
        style={{
          animation: "pulse 1.4s ease-in-out infinite",
          animationDelay: "0.2s",
        }}
      />
      <span
        className="size-2 rounded-full bg-primary motion-reduce:opacity-70"
        style={{
          animation: "pulse 1.4s ease-in-out infinite",
          animationDelay: "0.4s",
        }}
      />
    </div>
  )
}
