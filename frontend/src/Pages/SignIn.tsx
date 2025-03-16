import { useEffect, useState } from "react";
import { Box } from "../Components/Box";
import Input from "../Components/Input";
import Button from "../Components/Button";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
import { useRecoilState, useSetRecoilState } from "recoil";
import { authenticated, Loading, userAtom } from "../StateManagement/Atom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseConfig } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { ImSpinner3 } from "react-icons/im";

initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const gAuth = getAuth();
const SignIn = () => {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
    token: "",
    googleLogin: false,
  });
  const [loading, setLoading] = useRecoilState(Loading);
  const setUser = useSetRecoilState(userAtom);
  const [auth, setAuth] = useRecoilState(authenticated);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading({ ...loading, googleLoading: true });
      const result = await signInWithPopup(gAuth, provider);
      const token = await result.user.getIdToken();
      signIn("", "", token, true);
      setLoading({ ...loading, googleLoading: false });
    } catch (error) {
      setLoading({ ...loading, googleLoading: false });
      toast.error("Error during sign-in");
    }
  };

  useEffect(() => {
    if (auth) {
      navigate("/passwords", { replace: true });
      return;
    }
  }, [auth, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  const handleClick = async () => {
    await signIn();
  };
  const signIn = async (
    email = formData.Email,
    password = formData.Password,
    token = formData.token,
    googleLogin = formData.googleLogin
  ) => {
    try {
      if (auth) {
        navigate("/passwords", { replace: true });
        return;
      }
      setLoading({ ...loading, passwordLoading: true });
      const response = await axios.post(
        apiUrl + "user/signIn",
        {
          email: email,
          password: password,
          googleToken: token,
          googleLogin: googleLogin,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setAuth(true);
      setLoading({ ...loading, passwordLoading: false });
      const { id, name, uuid } = response.data;
      setUser({ email, name, id, uuid });
      toast.success("You are logged in.", { autoClose: 3000 });
      navigate("/passwords", { replace: true });
    } catch (err) {
      setLoading({ ...loading, passwordLoading: false });
      toast.error("Invalid Credentials");
      setAuth(false);
      navigate("/sign-in");
      return;
    }
  };

  return (
    <div className="pt-[50px]">
      <Box heading="Sign In">
        <Input
          name="Email"
          label="Email"
          type="text"
          placeholder="Email"
          onChange={handleChange}
        />
        <Input
          name="Password"
          label="Password"
          type="Password"
          placeholder="Password"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          onClick={handleClick}
          tag={
            loading.passwordLoading ? (
              <span>
                <ImSpinner3 className="animate-spin text-white" />
              </span>
            ) : (
              "Submit"
            )
          }
        />
        <div className="flex justify-center items-center">
          <Button
            className="flex  items-center justify-center w-full border-2 p-2 rounded-md  border-[#7091E6] mt-2"
            onClick={handleGoogleSignIn}
            tag={
              loading.googleLoading ? (
                <span>
                  <ImSpinner3 className="animate-spin text-blue-600" />
                </span>
              ) : (
                <span className="flex items-center">
                  <FcGoogle className="text-xl mr-1" /> Sign In with Google
                </span>
              )
            }
          ></Button>
        </div>
      </Box>
    </div>
  );
};

export default SignIn;
