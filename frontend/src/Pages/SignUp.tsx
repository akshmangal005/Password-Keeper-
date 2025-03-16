import React, { useEffect, useState } from "react";
import { Box } from "../Components/Box";
import Button from "../Components/Button";
import Input from "../Components/Input";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authenticated, Loading, userAtom } from "../StateManagement/Atom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseConfig } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { ImSpinner3 } from "react-icons/im";
const apiUrl = import.meta.env.VITE_API_URL;

// Initialize Firebase outside the component to avoid re-initialization
initializeApp(firebaseConfig);
const gAuth = getAuth();
const provider = new GoogleAuthProvider();

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Password: "",
    googleLogin: false,
    token: "",
  });
  const [auth, setAuth] = useRecoilState(authenticated);
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useRecoilState(Loading);
  const handleGoogleSignIn = async () => {
    try {
      setLoading({ ...loading, googleLoading: true });
      const result = await signInWithPopup(gAuth, provider);
      const token = await result.user.getIdToken();
      await signUp("", "", "", true, token);
      setLoading({ ...loading, googleLoading: false });
    } catch (error) {
      setLoading({ ...loading, googleLoading: false });
      toast.error("Failed to sign in with Google.");
    }
  };

  useEffect(() => {
    if (auth) {
      navigate("/passwords");
    }
  }, [auth, navigate]);

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleClick = async () => {
    await signUp();
  };
  const signUp = async (
    userEmail = formData.Email,
    Name = formData.Username,
    Password = formData.Password,
    googleLogin = formData.googleLogin,
    token = formData.token
  ) => {
    if (!googleLogin && !userEmail && !Name && !Password && !googleLogin) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading({ ...loading, passwordLoading: true });
      const response = await axios.post(
        `${apiUrl}user/signUp`,
        {
          name: Name,
          email: userEmail,
          password: Password,
          googleToken: token,
          googleLogin,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setLoading({ ...loading, passwordLoading: false });
      const { id, email, uuid, name } = response.data;
      setUser({ id, email, uuid, name });
      toast.success("User created successfully");
      setAuth(true);
    } catch (err: any) {
      setLoading({ ...loading, passwordLoading: false });
      if (err.response?.status === 409) {
        toast.error("User already exists");
      } else if (err.response?.status === 400) {
        toast.error("Please fill in all required fields");
      } else {
        console.error("Error:", err);
        toast.error("Internal server error");
      }
    }
  };

  return (
    <div className="pt-[50px]">
      <Box heading="Sign Up">
        <Input
          name="Username"
          label="Username"
          type="text"
          placeholder="Username"
          onChange={handleChange}
        />
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
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button onClick={() => handleClick()} tag="Submit" />
        <div className="flex justify-center items-center">
          <Button
            className="flex  items-center justify-center w-full border-2 p-2 rounded-md  border-[#7091E6] mt-2"
            onClick={handleGoogleSignIn}
            tag={
              loading ? (
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

export default SignUp;
