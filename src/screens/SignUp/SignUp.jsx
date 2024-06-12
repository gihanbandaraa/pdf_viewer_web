import CustomButton from "../../components/CustomButton";
import FormInput from "../../components/FormInput";
import { useState } from "react";

const SignUp = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  return (
    <div className="flex justify-center items-center w-full h-[100vh]">
      <div className="flex justify-evenly flex-wrap w-full bg-slate-100 py-10 px-10">
        <div className="w-[30%] max-sm:w-[90%]">
          <h3 className="text-3xl leading-normal font-bold max-lg:text-2xl max-sm:text-xl ">
            Sign Up an create new account to start viewing PDF.
          </h3>
          <p className="mt-9">
            If you already have your own account?{" "}
            <a href="/login" className=" underline">
              sign in here
            </a>
          </p>
        </div>

        <div>
          <FormInput
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            type="text"
          />
          <FormInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />
          <CustomButton />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
