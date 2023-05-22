import React from "react";

export const Skeleton: React.FC = () => {
  return (
    <>
      <div className="animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
    </>
  );
};

Skeleton.defaultProps = {};

export default Skeleton;
