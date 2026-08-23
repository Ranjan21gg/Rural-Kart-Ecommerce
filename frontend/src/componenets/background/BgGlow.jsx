export const BgGlow = () => {
    return (
        <div>
            {/* Glowing Ambient Background Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none translate-y-1/3" />
        </div>
    )
}