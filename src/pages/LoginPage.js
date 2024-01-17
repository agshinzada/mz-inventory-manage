import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../components/tools/Notify";
import { login } from "../stores/authSlice";
import { postLogin, postLoginActivity } from "../services/authService";
var hash = require("hash.js");

function LoginPage() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imgToggle = useRef();
  const divToggle = useRef();
  const logoImg = useRef();
  const [dark, setDark] = useState(true);
  const root = document.getElementById("body");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const hashPass = hash.sha256().update(password).digest("hex");
      const data = await postLogin(username, hashPass);
      if (data.length > 0) {
        const activityId = await postLoginActivity(data[0].ID);
        data[0].activityId = activityId[0].ID;
        dispatch(login(data[0]));
        notifySuccess("Daxil oldunuz. Gözləyin!");
        setTimeout(() => {
          toast.dismiss();
          navigate("/");
        }, 1500);
      } else {
        notifyError("İstifadəçi adı və ya şifrə yanlışdır!");
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  function handleTheme() {
    if (dark) {
      imgToggle.current.src = "../img/light.png";
      logoImg.current.src = "../svg/logo-black.svg";
      root.classList.toggle("dark");
      setDark(false);
    } else {
      imgToggle.current.src = "../img/dark.png";
      logoImg.current.src = "../svg/logo-white.svg";
      root.classList.add("dark");
      setDark(true);
    }
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen w-full bg-slate-200 dark:bg-gray-700">
      <form
        className="desktop:w-96 mobile:w-80 bg-white relative dark:bg-gray-800 p-8 rounded-sm shadow-lg"
        onSubmit={handleSignIn}
      >
        <div className="mb-8 justify-center items-center flex gap-4">
          <img
            src="../svg/logo-white.svg"
            ref={logoImg}
            alt="logo"
            className="mobile:w-10 desktop:w-12"
          />
          <h1 className="desktop:text-2xl mobile:text-lg  dark:text-white">
            <strong>İdarəetmə</strong>
            <br />
            paneli
          </h1>
        </div>
        <div
          className=" absolute top-3 right-3 flex items-center gap-3 bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 p-1 px-3 rounded-md cursor-pointer hover:bg-gray-400 transition-colors"
          ref={divToggle}
          onClick={handleTheme}
        >
          <img
            src="../img/dark.png"
            alt="dark"
            className="w-6"
            ref={imgToggle}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="text"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            İstifadəçi adı
          </label>
          <input
            type="text"
            id="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Şifrə
          </label>
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-gray-500 disabled:dark:bg-gray-500"
          disabled={username && password ? false : true}
        >
          Log in
        </button>
      </form>
      <a
        href="/"
        className="dark:text-white hover:font-semibold hover:scale-105 transition-all hover:text-blue-700"
      >
        Ana səhifəyə qayıt
      </a>
      <Toaster />
    </div>
  );
}

export default LoginPage;
