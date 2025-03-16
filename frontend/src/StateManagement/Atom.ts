import { atom } from "recoil";
interface User {
  id: string;
  name: string;
  email: string;
  uuid: string;
}
interface LoadingState {
  googleLoading: boolean;
  passwordLoading: boolean;
  createPasswordLoading: boolean;
  fetchPassword: boolean
}

interface Password {
  id: number;
  title: string;
  content: string;
  file?: string;
  username?: string;
  createdAt: Date;
  sharedAt?: Date;
}
interface ModifyPassword {
  id: number;
  title: string;
  content: string;
  username?: string;
  modifyPassword?: boolean;
}

export const userAtom = atom<User | null>({
  key: "userAtom",
  default: null,
});
export const authenticated = atom<boolean>({
  key: "authenticated",
  default: false,
});
export const passwordsAtom = atom<Password[]>({
  key: "passwordsAtom",
  default: [],
});

export const createPassword = atom<boolean>({
  key: "createPassword",
  default: false,
});

export const Loading = atom<LoadingState>({
  key: "loading",
  default: {
    googleLoading: false,
    passwordLoading: false,
    createPasswordLoading: false,
    fetchPassword: false
  },
});

export const ModifyPasswordState = atom<ModifyPassword>({
  key: "modifyPassword",
  default: {
    id: 0,
    title: "",
    content: "",
    username: "",
    modifyPassword: false
  }
})