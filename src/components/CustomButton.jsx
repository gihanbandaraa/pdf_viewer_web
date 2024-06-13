import React from "react";

const CustomButton = ({
  label,
  iconUrl,
  backgroundColor,
  borderColor,
  textColor,
  fullWidth,
  type = "button",
  onClick, 
}) => {
  return (
    <button
      type={type}
      onClick={onClick} 
      className={`flex justify-center items-center gap-2 px-7 py-4 border font-poppins text-lg leading-none ${
        backgroundColor ? `${backgroundColor} ${textColor} ${borderColor}` : "bg-black text-white"
      } rounded-full ${fullWidth ? 'w-full' : ''} hover:bg-white hover:text-black border-black hover:ease-in duration-300`}
    >
      {label}
      {iconUrl && (
        <img src={iconUrl} alt={label} className="ml-2 rounded-full w-5 h-5" />
      )}
    </button>
  );
};

export default CustomButton;
