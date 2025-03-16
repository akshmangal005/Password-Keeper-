import { NavLink, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authenticated, passwordsAtom, userAtom } from "../StateManagement/Atom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const Header = () => {
  const [auth, setAuth] = useRecoilState(authenticated);
  const user = useRecoilValue(userAtom);
  const setPasswords = useSetRecoilState(passwordsAtom);
  const navigate = useNavigate();
  const handleLogout = async () => {
    setPasswords([]);
    await axios.get(apiUrl + "user/logout", {
      withCredentials: true,
    });
    setAuth(false);
    navigate("/sign-in");
  };
  return (
    <div className="w-screen h-10 fixed bg-[#3D52A0] text-white pl-[50px] pr-[50px] flex items-center justify-between z-10">
      <div>
        {auth ? (
          <NavLink
            to="/passwords"
            className={({ isActive }) =>
              isActive ? "text-yellow-300 font-bold" : "text-white"
            }
          >
            Password Manager{" "}
          </NavLink>
        ) : (
          <NavLink to="/sign-in" className={" font-bold text-white"}>
            Password Manager{" "}
          </NavLink>
        )}
      </div>
      <div className="flex gap-5">
        {auth ? (
          <>
            <NavLink
              to={`/profile/${user?.id}`}
              className={({ isActive }) =>
                isActive ? "text-yellow-300 font-bold" : "text-white"
              }
            >
              Profile
            </NavLink>

            <button onClick={handleLogout} className="text-white">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/sign-up"
              className={({ isActive }) =>
                isActive ? "text-yellow-300 font-bold" : "text-white"
              }
            >
              Sign Up
            </NavLink>
            <NavLink
              to="/sign-in"
              className={({ isActive }) =>
                isActive ? "text-yellow-300 font-bold" : "text-white"
              }
            >
              Sign In
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};
