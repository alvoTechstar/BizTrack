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
        className="text-[14px] leading-4 font-bold text-[#353f50]"
      >
        {text}
      </button>
    </div>
  );
};

export default NaviButton;
