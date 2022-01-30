import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = "http://localhost:8000/";
const token = localStorage.localJWT;

export const fetchAsyncLogin = createAsyncThunk("login/post", async (auth) => {
  const res = await axios.post(`${apiUrl}authen/jwt/create`, auth, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
});

export const fetchAsyncRegister = createAsyncThunk(
  "login/register",
  async (auth) => {
    const res = await axios.post(`${apiUrl}api/register/`, auth, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

export const fetchAsyncProf = createAsyncThunk("login/get", async () => {
  const res = await axios.get(`${apiUrl}api/myself/`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return res.data;
});

const loginSlice = createSlice({
  name: "login",
  initialState: {
    // userの認証に使うstate
    authen: {
      email: "",
      password: "",
    },
    /*  モードを切り替えるためのstate
        true: Loginモード, false: Registerモード  */
    isLoginView: true,
    // ログインしているuserのidとusernameを保有するstate
    profile: {
      id: 0,
      username: "",
    },
  },
  reducers: {
    /*  ブラウザのフォームに入力されたemailを
        authenのemailのstateに格納  */
    editEmail(state, action) {
      state.authen.email = action.payload;
    },
    /*  ブラウザのフォームに入力されたpasswordを
        authenのpasswordのstateに格納  */
    editPassword(state, action) {
      state.authen.password = action.payload;
    },
    /*  LoginモードとRegisterモードを切り替えるaction  */
    toggleMode(state) {
      state.isLoginView = !state.isLoginView;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem("localJWT", action.payload.access);
      action.payload.access && (window.location.href = "/tasks"); // ページ遷移： "/tasks"
    });
    builder.addCase(fetchAsyncProf.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
  },
});

export const { editEmail, editPassword, toggleMode } = loginSlice.actions;
export const selectAuthen = (state) => state.login.authen;
export const selectIsLoginView = (state) => state.login.isLoginView;
export const selectProfile = (state) => state.login.profile;

export default loginSlice.reducer;
