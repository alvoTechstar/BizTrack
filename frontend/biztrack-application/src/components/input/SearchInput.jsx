import React from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function SearchInput({
  id,
  placeholder,
  input,
  handleInput,
  handleClear,
}) {
  return (
    <div className="w-64 mr-2">
      <div
        className={`flex items-center rounded-md border ${
          input ? "border-gray-400" : "border-transparent"
        } bg-gray-100 focus-within:border-gray-400`}
      >
        <div className="w-10 flex items-center justify-center ml-3 text-gray-500 cursor-pointer">
          <SearchRoundedIcon className="h-4 w-4" />
        </div>
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          value={input}
          autoComplete="off"
          onChange={(e) => handleInput(e)}
          className="w-full py-2 px-3 text-sm font-medium text-gray-700 bg-transparent focus:outline-none"
        />
        <div
          className={`w-10 flex items-center justify-center mr-3 cursor-pointer ${
            input ? "visible" : "invisible"
          }`}
          onClick={() => handleClear("")}
        >
          <CloseRoundedIcon className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
}
