import classNames from "classnames";
import React from "react";

export type Props = {
  className?: string;
  rounded?: boolean;
};

export const Skeleton: React.FC<Props> = ({ className, rounded }) => {
  return (
    <>
      <div
        className={classNames(
          "animate-pulse h-2.5 bg-gray-200 rounded dark:bg-gray-700 w-48 mb-4",
          {
            "rounded-full": rounded,
          },
          className
        )}
      ></div>
    </>
  );
};

Skeleton.defaultProps = {};

export default Skeleton;
