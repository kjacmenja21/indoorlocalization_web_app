import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-8 space-y-4">
      <div className="animate-spin">
        <Loader2 className="w-12 h-12 text-blue-500" />
      </div>
      <p className="text-gray-600 text-lg">Loading floor maps...</p>
    </div>
  );
};

export default LoadingSpinner;
