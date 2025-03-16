import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
import { Header } from "./Components/Header";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import ErrorPage from "./Pages/Error";
import Passwords from "./Pages/Passwords";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authenticated, Loading, userAtom } from "./StateManagement/Atom";
import { useEffect } from "react";
import axios from "axios";
import Profile from "./Pages/Profile";

function App() {
  const [auth, setAuth] = useRecoilState(authenticated);
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useRecoilState(Loading);

  useEffect(() => {
    const checkAuthenticated = async () => {
      try {
        setLoading({ ...loading, passwordLoading: true });
        const response = await axios.get(apiUrl + "user/isAuth", {
          withCredentials: true,
        });
        setLoading({ ...loading, passwordLoading: false });
        if (response.status === 200) {
          setAuth(true);
          const { email, id, name, uuid } = response.data;
          setUser({ email, name, id, uuid });
        }
      } catch (error) {
        setLoading({...loading, passwordLoading: false});
        navigate("/sign-in", { replace: true });
        setAuth(false);
      }
    };
    checkAuthenticated();
  }, [setAuth, setUser]);

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            auth ? (
              <Navigate to="/passwords" replace />
            ) : (
              <Navigate to="/sign-in" replace />
            )
          }
        />
        <Route path="/passwords" element={<Passwords />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
