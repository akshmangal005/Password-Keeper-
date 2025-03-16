import { PasswordComponent } from "../Components/PasswordComponent";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  authenticated,
  createPassword,
  Loading,
  passwordsAtom,
} from "../StateManagement/Atom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

import AddIcon from "@mui/icons-material/Add";
import { PasswordForm } from "../Components/PasswordForm";
import { SpinnerRoundFilled } from "spinners-react";
const apiUrl = import.meta.env.VITE_API_URL;

const Passwords = () => {
  const auth = useRecoilValue(authenticated);
  const [passwords, setPasswords] = useRecoilState(passwordsAtom);
  const [loading, setLoading] = useRecoilState(Loading);
  const [createPasswordVisiblity, setCreatePasswordVisiblity] =
    useRecoilState(createPassword);

  const handlePasswordCreation = () => {
    setCreatePasswordVisiblity(!createPasswordVisiblity);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate("/sign-in", { replace: true });
      return;
    }
    const getPasswords = async () => {
      try {
        setLoading({ ...loading, fetchPassword: true });
        const response = await axios.get(apiUrl + "password", {
          withCredentials: true,
        });
        setPasswords(response.data);
        setLoading({ ...loading, fetchPassword: false });
      } catch (err) {
        console.log(err);
        setPasswords([]);
      }
    };
    getPasswords();
  }, [auth]);
  if (loading.fetchPassword==true && passwords.length==0)
    return (
      <div className="flex w-screen text-8xl h-screen items-center justify-center">
        <SpinnerRoundFilled  color="#7091E6" size="100px"/>
      </div>
    );
  else
    return (
      <div className="flex w-screen pt-[50px] h-auto justify-center">
        <div className="flex flex-col items-center  p-10 gap-5 mt-5 h-auto border w-[90%] md:w-[70%]">
          <button
            className="w-[300px] md:w-[500px] h-10 rounded-md border-dashed border-gray-500 border-2 bg-gray-200"
            onClick={handlePasswordCreation}
          >
            <AddIcon className="text-gray-400 h-9 w-9" />
          </button>
          <div>{createPasswordVisiblity && <PasswordForm />}</div>
          <div>
            {passwords?.map((pass) => (
              <PasswordComponent
                key={pass.id}
                id={pass.id}
                title={pass.title}
                username={pass.username}
                content={pass.content}
                file={pass.file}
                createdAt={pass.createdAt}
              />
            ))}
          </div>
        </div>
      </div>
    );
};

export default Passwords;
