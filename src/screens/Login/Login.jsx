import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";
import CustomButton from "../../components/CustomButton";
import { useState } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { validateEmail } from "../../utils/helper";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter password");
      return;
    }
    setError("");

    //Login API Call
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      //Handle successful login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      //Handle Error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred.Please Try again");
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      <div className="flex justify-center items-center w-full h-full bg-white shadow-lg rounded-lg">
        <div className="flex w-full h-full">
          <div className="flex flex-col justify-center items-center w-1/2 p-10 max-md:w-screen">
            <h2 className="text-3xl font-bold mb-6">Log in to your account</h2>
            <div className="flex gap-4 mb-4 w-full  justify-center  ">
              <button className="py-2 px-10 max-sm:px-6  rounded border flex gap-2">
                <img src="/images/facebook.png" width={24} height={24} />
                <p>Facebook</p>
              </button>
              <button className=" py-2 px-10  max-sm:px-6 rounded border flex gap-2">
                <img src="/images/google.png" width={24} height={24} />
                <p>Google</p>
              </button>
            </div>
            <p className="mb-4">or continue with email</p>

            <form onSubmit={handleLogin}>
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
               {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
              <div className="flex items-center justify-between w-full mt-4 mb-6 gap-9">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-blue-500">
                  Forgot Password?
                </Link>
              </div>
              <CustomButton label="Sign In" fullWidth type="submit"/>
            </form>
            <p className="mt-4">
              Didn't Have an Account?{" "}
              <Link
                to="/signUp"
                className="font-medium text-blue-500 underline"
              >
                sign up here
              </Link>
            </p>
          </div>
          <div class="flex flex-col justify-center items-center w-1/2 p-10  text-black max-md:hidden">
            <img src="/images/pdfread.png" />
            <h1 class="text-4xl font-bold">PDF Reader</h1>
            <p class="mt-5 text-xl">Enhance your reading experience.</p>
            <p class="mt-2">Access your documents seamlessly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
