import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notifyError, notifySuccess } from "../components/tools/Notify";
import TitleBox from "../components/tools/TitleBox";
import {
  getEmployees,
  setEmployeeNumber,
  setSearchedEmployee,
} from "../stores/employeesSlice";
import {
  getEmployeesBySearch,
  getNumbersByEmployeeId,
  removeEmployee,
} from "../services/employeeService";
import AddEmployeeModal from "../components/modals/AddEmployeeModal";
import EmployeeNumbersModal from "../components/modals/EmployeeNumbersModal";
import EditEmployeeModal from "../components/modals/EditEmployeeModal";
import Swal from "sweetalert2";

function EmployeesPage() {
  const dispatch = useDispatch();
  let [isOpenAdd, setIsOpenAdd] = useState(false);
  let [isOpenNumbers, setIsOpenNumbers] = useState(false);
  let [isOpenEdit, setIsOpenEdit] = useState(false);
  let [searchMethod, setSearchMethod] = useState(1);
  const { token } = useSelector((state) => state.auth);
  const { employees } = useSelector((state) => state.employees);
  const [selectedEmployee, setSelectedEmployee] = useState([]);

  const openNumbersModal = async (id) => {
    try {
      const data = await getNumbersByEmployeeId(id);
      dispatch(setEmployeeNumber(data));
      setIsOpenNumbers(true);
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const searchEmployee = async (e) => {
    e.preventDefault();
    const value = new FormData(e.target).get("searchInput").toLowerCase();
    try {
      const data = await getEmployeesBySearch(value, searchMethod);
      dispatch(setSearchedEmployee(data));
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      Swal.fire({
        text: `Profil silinsin?`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
        cancelButtonText: "İmtina",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await removeEmployee(id);
          notifySuccess("Uğurla silindi!");
          dispatch(getEmployees());
        }
      });
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getEmployees());
  }, []);

  return (
    <div className="flex flex-col gap-4 desktop:text-sm mobile:text-xs">
      <TitleBox title="işçilər" />
      <div>
        <div className="flex gap-2 desktop:flex-row mobile:flex-col">
          <select
            className="bg-transparent border border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-500 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-fit mobile:w-full p-2"
            onChange={(e) => setSearchMethod(e.target.value)}
            defaultValue={"DEFAULT"}
          >
            <option defaultValue={"DEFAULT"} key={1} value={1}>
              Ad Soyad
            </option>
            <option key={2} value={2}>
              Rut
            </option>
            <option key={3} value={3}>
              Nömrə
            </option>
            <option key={4} value={4}>
              Şöbə
            </option>
          </select>
          <div className="flex gap-3 desktop:flex-row mobile:flex-col w-full">
            <div className="relative w-full">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <form onSubmit={searchEmployee}>
                <input
                  type="search"
                  className="block p-4 pl-10 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="İşçi axtar..."
                  name="searchInput"
                  required
                />
                <button
                  type="submit"
                  className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-4 py-2"
                >
                  axtar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg py-2 px-6 desktop:w-fit mobile:w-full self-end"
        onClick={() => setIsOpenAdd(true)}
      >
        Əlavə et
      </button>
      <div className="flex h-fit flex-wrap gap-3 justify-center">
        {employees &&
          employees.map((employee) => (
            <div
              className="w-full p-3 bg-white dark:bg-gray-800 dark:border-gray-600 rounded-lg border border-gray-200 shadow-md "
              key={employee.ID}
            >
              <div className="flex desktop:gap-8 items-center desktop:flex-row mobile:flex-col mobile:gap-4">
                <div className="flex justify-between w-full">
                  <h5 className="desktop:text-xl mobile:text-[14px] font-medium text-gray-900 dark:text-slate-100 w-full">
                    {employee.NAME} {employee.SURNAME}
                  </h5>
                  <div className="flex items-center gap-2 justify-self-end">
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      {employee.DEPARTMENT}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      {employee.REGION}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      {employee.EXPLANATION}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 justify-self-end">
                  <button
                    className="inline-flex items-center py-2 px-4 desktop:text-sm mobile:text-xs font-medium text-center text-white bg-blue-700 dark:bg-gray-500 dark:hover:bg-gray-700 rounded-lg hover:bg-blue-800 "
                    onClick={() => openNumbersModal(employee.ID)}
                  >
                    Nömrə
                  </button>
                  <button
                    className="inline-flex items-center py-2 px-4 desktop:text-sm mobile:text-xs font-medium text-center text-white bg-blue-500 dark:bg-gray-700 dark:hover:bg-gray-800 rounded-lg hover:bg-blue-600  focus:outline-none"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setIsOpenEdit(true);
                    }}
                  >
                    düzəliş
                  </button>
                  {token.ROLE === "ADMIN" && (
                    <button
                      className="inline-flex items-center py-2 px-4 desktop:text-sm mobile:text-xs text-center dark:text-red-500 text-red-700 dark:hover:text-red-700 hover:text-red-800 font-semibold  rounded-lg  focus:outline-none"
                      onClick={() => handleDelete(employee.ID)}
                    >
                      sil
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      <AddEmployeeModal isOpen={isOpenAdd} setIsOpen={setIsOpenAdd} />
      <EditEmployeeModal
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        data={selectedEmployee}
      />
      <EmployeeNumbersModal
        isOpen={isOpenNumbers}
        setIsOpen={setIsOpenNumbers}
      />
    </div>
  );
}

export default memo(EmployeesPage);
