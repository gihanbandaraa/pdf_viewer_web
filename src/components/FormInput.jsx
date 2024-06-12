import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const FormInput = ({ value, onChange, placeholder, type = "text" }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const inputType = type === "password" && isShowPassword ? "text" : type;

  return (
    <div className="flex w-[100%]  items-center bg-transparent border-[1.5px] px-5 rounded mb-3">
      <input
        value={value}
        onChange={onChange}
        type={inputType}
        placeholder={placeholder}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
      />
      {type === "password" && (
        isShowPassword ? (
          <FaRegEye
            size={22}
            className="text-primary cursor-pointer"
            onClick={toggleShowPassword}
          />
        ) : (
          <FaRegEyeSlash
            size={22}
            className="text-primary cursor-pointer"
            onClick={toggleShowPassword}
          />
        )
      )}
    </div>
  );
};



export default FormInput;
