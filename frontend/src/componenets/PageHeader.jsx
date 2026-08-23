const PageHeader = ({ icon, title, description, className, bg }) => {
    return (
        <div className={`flex items-center gap-3 mb-2 ${className}`}>
            <div className={`w-10 h-10 rounded-xl ${bg} text-white flex items-center justify-center shadow-sm`}>
                {icon}
            </div>

            <div>
                <h1 className="text-2xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                    {title}
                </h1>

                <p className="text-xs text-slate-500 mt-0.5">
                    {description}
                </p>
            </div>
        </div>
    )
};


export default PageHeader;