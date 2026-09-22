export function AuthFooter() {
  return (
    <footer className="w-full py-6 px-10 bg-surface-container-low mt-auto border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body-md text-body-md text-on-surface-variant">
          © 2024 HealthStride Analytics. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Help Center"].map((t) => (
            <a
              key={t}
              className="text-on-surface-variant hover:text-primary transition-colors font-label-md"
              href="#"
            >
              {t}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
