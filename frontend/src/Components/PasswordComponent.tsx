import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { FaDownload } from "react-icons/fa6";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  createPassword,
  ModifyPasswordState,
  passwordsAtom,
} from "../StateManagement/Atom";
import { CiEdit } from "react-icons/ci";
const apiUrl = import.meta.env.VITE_API_URL;

interface PasswordComponentProps {
  id: number;
  title: string;
  content: string;
  file?: string;
  username?: string;
  sharedAt?: string;
  createdAt: Date;
}

export const PasswordComponent: React.FC<PasswordComponentProps> = ({
  title,
  content,
  username,
  id,
  file,
}) => {
  console.log(file);

  const [toggleBorder, setToggleBorder] = useState(false);
  const [toggleVisiblity, SetToggleVisiblity] = useState(false);
  const [password, setPassword] = useRecoilState(passwordsAtom);
  const setVisiblity = useSetRecoilState(createPassword);
  const setModifyPassowrd = useSetRecoilState(ModifyPasswordState);
  const deletePassword = async () => {
    try {
      const updatedPasswords = (password ?? [])?.filter(
        (item) => item.id != id
      );
      setPassword(updatedPasswords);

      await axios.delete(apiUrl + `password/delete/${id}`, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const updatePassword = () => {
    setModifyPassowrd({
      id,
      title,
      content,
      username,
      modifyPassword: true,
    });
    setVisiblity(true);
  };

  const handleVisiblity = () => {
    SetToggleVisiblity(!toggleVisiblity);
  };

  const handleBorder = () => {
    setToggleBorder(!toggleBorder);
  };

  return (
    <div className="m-5">
      <Accordion className="w-[300px] md:w-[500px]">
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          {title}
        </AccordionSummary>
        <hr />
        <AccordionDetails>
          <div className="flex flex-col w-full">
            <label htmlFor="username" className="mb-1 text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={username}
              className="bg-gray-100 pl-5 h-10 rounded-md outline-none"
              readOnly
            />
          </div>
        </AccordionDetails>
        <AccordionDetails>
          <div className={`flex flex-col w-full`}>
            <label htmlFor="password" className="mb-1 text-sm font-medium">
              Password
            </label>
            <div
              className={`flex items-center  ${
                toggleBorder ? "border border-black rounded-md" : ""
              }`}
            >
              <input
                type={toggleVisiblity ? "text" : "password"}
                onFocus={handleBorder}
                onBlur={handleBorder}
                value={toggleVisiblity ? content : "password"}
                name="password"
                className="bg-gray-100 pl-5 h-10 flex-grow rounded-l-md outline-none"
                readOnly
              />
              <div
                onClick={handleBorder}
                className="w-10 h-10 pr-2 rounded-r-md flex items-center bg-gray-100"
              >
                <VisibilityIcon
                  onClick={handleVisiblity}
                  fontSize="small"
                  className="text-sm hover:cursor-pointer"
                />
              </div>
            </div>
          </div>
        </AccordionDetails>

        <div className="flex items-center justify-between p-5">
          <div>
            {file && (
              <a href={file} download="hello">
                <button>
                  <FaDownload />
                </button>
              </a>
            )}
          </div>
          <div>
            <button className="text-2xl pr-2" onClick={updatePassword}>
              <CiEdit />
            </button>
            <button
              onClick={deletePassword}
              className="text-red-500 text-2xl hover:underline"
            >
              <MdDelete />
            </button>
          </div>
        </div>
      </Accordion>
    </div>
  );
};
