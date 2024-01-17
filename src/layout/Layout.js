import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../stores/authSlice";
import { notifyError, notifySuccess } from "../components/tools/Notify";
import { postLogin, postLogout, putPassword } from "../services/authService";
import { GiHamburgerMenu } from "react-icons/gi";
import Swal from "sweetalert2";
var hash = require("hash.js");

function Layout() {
  const imgToggle = useRef();
  const divToggle = useRef();
  const [dark, setDark] = useState(true);
  const [isOpen, setIsopen] = useState(false);
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [reTypePassword, setRetypePassword] = useState(null);
  const [passwordCheck, setPasswordCheck] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aside, setAside] = useState({});
  const root = document.getElementById("body");
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandle = async () => {
    try {
      Swal.fire({
        text: `Sistemdən çıxış edilsin?`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
        cancelButtonText: "İmtina",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await postLogout(token.activityId);
          dispatch(logout());
          navigate("/auth/login");
        }
      });
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const changePassword = async () => {
    try {
      if (passwordCheck) {
        const oldHashPass = hash.sha256().update(oldPassword).digest("hex");
        const data = await postLogin(token.USERNAME, oldHashPass);
        if (data.length > 0) {
          Swal.fire({
            text: `Şifrə yenilənəcək`,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK",
            cancelButtonText: "İmtina",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const newHashPass = hash
                .sha256()
                .update(reTypePassword)
                .digest("hex");
              await putPassword(token.USERNAME, newHashPass);
              notifySuccess("Şifrə uğurla dəyişildi!");
              setIsopen(false);
              setTimeout(() => {
                notifySuccess("Giriş səhifəsinə yönləndirilir...");
              }, 1000);
              setTimeout(() => {
                toast.dismiss();
                dispatch(logout());
              }, 3000);
            }
          });
        } else {
          notifyError("Köhnə şifrə düzgün deyil!");
        }
      } else {
        notifyError("Şifrələr eyni deyil!");
      }
    } catch (error) {
      console.log(error);
      notifyError(`Sistem xətası!`);
    }
  };
  const checkPassword = (pass) => {
    setPasswordCheck(pass === newPassword);
    setRetypePassword(pass);
  };

  function handleTheme() {
    if (dark) {
      imgToggle.current.src = "img/light.png";
      root.classList.toggle("dark");
      setDark(false);
    } else {
      imgToggle.current.src = "img/dark.png";
      root.classList.add("dark");
      setDark(true);
    }
  }

  function handleSidebar() {
    if (sidebarOpen) {
      aside.classList.add("mobile:hidden");
      aside.classList.add("desktop:hidden");
      setSidebarOpen(false);
    } else {
      aside.classList.toggle("mobile:hidden");
      aside.classList.toggle("desktop:hidden");
      setSidebarOpen(true);
    }
  }

  useEffect(() => {
    setAside(document.getElementById("aside"));
  }, [sidebarOpen]);

  return (
    <>
      <main className="min-h-screen bg-slate-50 dark:bg-gray-700 w-full order-2 p-6">
        <header className="flex desktop:justify-between mb-12 desktop:items-center desktop:flex-row mobile:flex-col  mobile:gap-3">
          <GiHamburgerMenu
            className="mb-5 text-3xl text-white cursor-pointer"
            onClick={handleSidebar}
          />
          <div className="flex desktop:justify-between mb-5 desktop:items-center desktop:flex-row mobile:flex-col mobile:items-end mobile:gap-3">
            <div className="flex gap-3 desktop:items-center desktop:mr-6 desktop:flex-row mobile:flex-col items-end">
              <small className="font-bold dark:text-white">
                {token && token.NAME} {token && token.SURNAME}
              </small>
              {token && (
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 text-sm  focus:ring-blue-300 font-medium rounded-md desktop:py-2 desktop:px-6 mobile:px-4 mobile:py-1 w-fit"
                  onClick={() => setIsopen(true)}
                >
                  Şifrəni dəyiş
                </button>
              )}
            </div>

            <div className="flex gap-5">
              <div
                className="flex items-center gap-3 bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 p-1 px-3 rounded-md cursor-pointer hover:bg-gray-400 transition-colors"
                ref={divToggle}
                onClick={handleTheme}
              >
                <img
                  src="img/dark.png"
                  alt="dark"
                  className="desktop:w-6 mobile:w-4"
                  ref={imgToggle}
                />
              </div>
              {token && (
                <button
                  className="dark:text-white font-bold bg-slate-400 dark:bg-slate-800 py-2 px-6 flex items-center gap-2 rounded-md"
                  onClick={logoutHandle}
                >
                  Çıxış
                </button>
              )}
            </div>
          </div>
        </header>
        <Outlet />
      </main>
      <aside
        id="aside"
        className="min-w-fit h-auto bg-blue-800 dark:bg-gray-800 "
      >
        <div className="flex flex-col items-center gap-11 desktop:px-6 mobile:px-2">
          <div className="flex gap-4 desktop:flex-row mobile:flex-col items-center mt-5">
            <img
              src="svg/logo-white.svg"
              alt="logo"
              className="desktop:w-10 mobile:w-9"
            />
            <h1 className="desktop:text-md mobile:text-sm mobile:text-center text-white">
              <strong>İDARƏETMƏ</strong> <br /> PANELİ
            </h1>
          </div>

          <div>
            <ul className="flex flex-col gap-8">
              <li>
                <NavLink
                  to="/dashboard"
                  title="Dashboard"
                  className="flex items-center gap-4 desktop:px-5 py-3 mobile:px-3 desktop:rounded-md opacity-70 hover:opacity-100 transition-all"
                >
                  <img
                    src="svg/dashboard-svgrepo-com.svg"
                    alt="svg"
                    className="desktop:w-9 mobile:w-7"
                  />
                  <small className="text-white mobile:hidden desktop:block">
                    Dashboard
                  </small>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/items"
                  title="Cihazlar"
                  className="flex items-center gap-4 desktop:px-5 py-3 mobile:px-3 desktop:rounded-md opacity-70 hover:opacity-100 transition-all"
                >
                  <img
                    src="svg/devices-svgrepo-com.svg"
                    alt="svg"
                    className="desktop:w-9 mobile:w-7"
                  />
                  <small className="text-white mobile:hidden desktop:block">
                    Cihazlar
                  </small>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/replacements"
                  title="Yerdəyişmə"
                  className="flex items-center gap-4 desktop:px-5 py-3 mobile:px-3 desktop:rounded-md opacity-70 hover:opacity-100 transition-all"
                >
                  <img
                    src="svg/change-svgrepo-com.svg"
                    alt="svg"
                    className="desktop:w-9 mobile:w-7"
                  />
                  <small className="text-white mobile:hidden desktop:block">
                    Yerdəyişmələr
                  </small>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/invoices"
                  title="Qaimələr"
                  className="flex items-center gap-4 desktop:px-5 py-3 mobile:px-3 desktop:rounded-md opacity-70 hover:opacity-100 transition-all"
                >
                  <img
                    src="svg/invoices.svg"
                    alt="svg"
                    className="desktop:w-9 mobile:w-7"
                  />
                  <small className="text-white mobile:hidden desktop:block">
                    Qaimələr
                  </small>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/payments"
                  title="Fakturalar"
                  className="flex items-center gap-4 desktop:px-5 py-3 mobile:px-3 desktop:rounded-md opacity-70 hover:opacity-100 transition-all"
                >
                  <img
                    src="svg/payments.svg"
                    alt="svg"
                    className="desktop:w-9 mobile:w-7"
                  />
                  <small className="text-white mobile:hidden desktop:block">
                    Fakturalar
                  </small>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/employees"
                  title="Nömrələr"
                  className="flex items-center gap-4 desktop:px-5 py-3 mobile:px-3 desktop:rounded-md opacity-70 hover:opacity-100 transition-all"
                >
                  <img
                    src="svg/employee.svg"
                    alt="svg"
                    className="desktop:w-9 mobile:w-7"
                  />
                  <small className="text-white mobile:hidden desktop:block">
                    İşçilər
                  </small>
                </NavLink>
              </li>

              {/* <li>
                <NavLink
                  to="/mazarina"
                  title="Mazarina"
                  className="flex items-center gap-4 desktop:px-5 py-3 mobile:px-3 desktop:rounded-md opacity-70 hover:opacity-100 transition-all"
                >
                  <img
                    src="svg/bee-svgrepo-com.svg"
                    alt="svg"
                    className="desktop:w-9 mobile:w-7"
                  />
                  <small className="text-white mobile:hidden desktop:block">
                    Mazarina
                  </small>
                </NavLink>
              </li> */}
            </ul>
          </div>
        </div>
      </aside>
      <Toaster />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsopen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium pb-10 leading-6 text-gray-900 dark:text-slate-300"
                  >
                    Şifrəni dəyiş
                  </Dialog.Title>
                  <div className="flex flex-col gap-10">
                    <div>
                      <label className="dark:text-slate-300">Köhnə şifrə</label>
                      <input
                        type="password"
                        required
                        className="bg-transparent border border-gray-300 text-gray-900 dark:border-slate-500 dark:text-slate-300 dark:bg-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2"
                        onChange={(e) => setOldPassword(e.target.value.trim())}
                      />
                    </div>
                    <div>
                      <label className="dark:text-slate-300">Yeni şifrə</label>
                      <input
                        type="password"
                        required
                        className="bg-transparent border mb-2 border-gray-300 text-gray-900 dark:border-slate-500 dark:text-slate-300 dark:bg-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2"
                        onChange={(e) => setNewPassword(e.target.value.trim())}
                      />
                      <input
                        type="password"
                        required
                        className="bg-transparent border border-gray-300 text-gray-900 dark:border-slate-500 dark:text-slate-300 dark:bg-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2"
                        onChange={(e) => checkPassword(e.target.value.trim())}
                      />
                    </div>
                  </div>
                  <div className="mt-8">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-gray-500 dark:text-slate-300 dark:hover:bg-gray-700 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={changePassword}
                    >
                      Göndər
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default Layout;
