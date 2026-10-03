const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-primary-700">
      <div className="flex space-x-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-5 h-5 bg-info rounded-full animate-spinDelay"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
