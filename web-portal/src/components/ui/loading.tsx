import React from "react";

interface LoadingProps {
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  fullScreen = false,
  className = "",
}) => {
  const spinner = (
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {spinner}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {spinner}
    </div>
  );
};

export default Loading;
