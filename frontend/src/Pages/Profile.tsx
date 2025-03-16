import { useRecoilValue } from "recoil";
import { userAtom } from "../StateManagement/Atom";
import { useRef } from "react";

const Profile = () => {
  const user = useRecoilValue(userAtom);
  const textRef = useRef<HTMLInputElement>(null);
  const handleCopyClick = () => {
    if (textRef.current) {
      textRef.current.select(); // Select the text in the input field
      document.execCommand("copy");
    }
  };
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="h-[15rem] flex flex-col gap-5 p-2 w-[15rem] border rounded-md shadow-xl border-gray-100">
        <div className="text-center font-bold text-2xl">Profile</div>
        <div>Name: {user?.name}</div>
        <div>email: {user?.email}</div>
        <div>
          UUID:{" "}
          <input
            name="ApiKey"
            className="border-2 mt-2 w-[14rem] overflow-hidden p-1 shadow-inner rounded-md "
            onClick={handleCopyClick}
            type="text"
            ref={textRef}
            value={user?.uuid}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
