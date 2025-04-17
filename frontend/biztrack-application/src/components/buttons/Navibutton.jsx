import React from "react";

const NaviButton = ({ text, action, alignment = "left" }) => {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={`${alignmentClasses[alignment]} w-full`}>
      <button
        onClick={action}
        className="text-sm text-indigo-600 hover:underline focus:outline-none transition-all duration-150"
      >
        {text}
      </button>
    </div>
  );
};

export default NaviButton;
