import { useRecoilValue } from "recoil";
import { Loading } from "../StateManagement/Atom";
const Button = ({ tag, className, ...rest }: any) => {
  const loading = useRecoilValue(Loading);
  return (
    <button
      disabled={loading.googleLoading || loading.passwordLoading || loading.createPasswordLoading}
      className={` ${
        className
          ? className
          : "border flex items-center justify-center w-full h-10 mt-5 rounded-md text-white bg-[#7091E6]  "
      }`}
      {...rest}
    >
      {tag}
    </button>
  );
};
export default Button;
