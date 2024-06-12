import { Link } from "react-router-dom";
import CustomButton from "../../components/CustomButton";
import FormInput from "../../components/FormInput";
import { useState } from "react";

const SignUp = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      <div className="flex justify-center items-center w-full h-full bg-white shadow-lg rounded-lg">
        <div className="flex w-full h-full">
          <div class="flex flex-col justify-center items-center w-1/2 p-10  text-black max-md:hidden">
          <img src="/images/pdfread.png"/>
            <h1 class="text-4xl font-bold">PDF Reader</h1>
            <p class="mt-5 text-xl">Enhance your reading experience.</p>
            <p class="mt-2">Access your documents seamlessly.</p>
          </div>

          <div className="flex flex-col justify-center items-center w-1/2 p-10 max-md:w-screen">
            <h2 className="text-3xl font-bold mb-6">Create a new account</h2>
            <div className="flex gap-4 mb-4 w-full  justify-center ">
              <button className="py-2 px-10 w-max-15 rounded border flex gap-2">
                <img src="/images/facebook.png" width={24} height={24}/>
                <p>Facebook</p>
              </button>
              <button className=" py-2 px-10  rounded border flex gap-2">
                <img src="/images/google.png" width={24} height={24}/>
                <p>Google</p>
              </button>
            </div>
            <p className="mb-4">or continue with email</p>
            <FormInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              type="text"
            />
            <FormInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="text"
            />
            <FormInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
            />
            <div className="flex items-center justify-between w-full mt-4 mb-6 gap-9">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-blue-500">
                Forgot Password?
              </Link>
            </div>
            <CustomButton label="Sign Up" fullWidth />
            <p className="mt-4">
              Already Have an Account?{" "}
              <Link to="/login" className="font-medium text-blue-500 underline">
                sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
