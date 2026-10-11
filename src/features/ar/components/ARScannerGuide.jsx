/**
 * Scan guide shown while the camera is searching for a target.
 * Hidden once a target is found. Pure HTML overlay (high contrast over the
 * live camera feed).
 */
export function ARScannerGuide({ hint }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
      <div className="relative h-60 w-60 max-w-[75vw]">
        {/* Corner frame */}
        <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-xl border-l-4 border-t-4 border-white/90" />
        <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-xl border-r-4 border-t-4 border-white/90" />
        <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-xl border-b-4 border-l-4 border-white/90" />
        <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-xl border-b-4 border-r-4 border-white/90" />
        <span className="animate-scan-pulse absolute inset-4 rounded-xl border-2 border-dashed border-white/50" />
      </div>
      <p className="mt-6 rounded-full bg-black/55 px-4 py-2 text-sm font-medium text-white backdrop-blur">
        {hint || 'Arahkan kamera ke gambar alat musik'}
      </p>
    </div>
  );
}
