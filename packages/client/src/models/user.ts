export interface UserData {
  id: string;
  name: string;
  email: string;
  profileImage: string;
}

export interface UserContext {
  logged: boolean;
  token: string | null;
  userData: UserData | null;
  setLogged: Function;
  logOut: Function;
  error: {
    error: string;
    message: string;
  } | null;
}
