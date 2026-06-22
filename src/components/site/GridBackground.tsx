/**
 * Fixed, full-viewport ambient background: a faint blueprint grid masked to a
 * soft ellipse, with a cyan top glow and a purple bottom glow.
 */
export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
      <div className="absolute -top-48 left-1/2 h-[620px] w-[920px] -translate-x-1/2 rounded-full bg-[#00dbe9]/12 blur-[130px]" />
      <div className="absolute -bottom-56 right-[-120px] h-[520px] w-[640px] rounded-full bg-[#a855f7]/12 blur-[150px]" />
      <div className="absolute bottom-[-120px] left-[-120px] h-[420px] w-[520px] rounded-full bg-[#00dbe9]/8 blur-[150px]" />
    </div>
  );
}
