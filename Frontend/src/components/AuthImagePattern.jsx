const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden md:flex flex-col items-center justify-center bg-base-200">
      <div className="grid grid-cols-3 gap-1 mb-8">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`aspect-square w-20 rounded-2xl bg-primary opacity-10 border border-black ${
              i % 2 === 0 ? "animate-pulse" : ""
            }`}
          />
        ))}
      </div>
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content opacity-80">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
