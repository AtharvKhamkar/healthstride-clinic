export function AuthHeader() {
  return (
    <header className="w-full h-20 flex items-center px-10 bg-glass-bg backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            health_and_safety
          </span>
        </div>
        <span className="font-headline-md text-headline-md text-primary tracking-tight">
          HealthStride
        </span>
      </div>
    </header>
  );
}
