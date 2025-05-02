import React from "react";
import iswLogo from "../../assets/Logos/isw.png";
import sidianLogo from "../../assets/Logos/sidian.png";

export default function Logo() {
  return (
    <div className="flex items-center space-x-6">
      <img src={iswLogo} alt="Interswitch" className="w-24 h-auto" />
      <img src={sidianLogo} alt="Credit Bank" className="w-24 h-auto mb-2" />
      {/* <img src={require("../../assets/Logos/ria.png")} alt="RIA" className="w-24 h-auto" /> */}
    </div>
  );
}
