export const BgGlow = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-sky-400/20 blur-3xl -translate-y-1/2" />

      <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-indigo-400/15 blur-3xl translate-y-1/3" />
    </div>
  );
};