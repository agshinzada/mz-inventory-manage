import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments, getRegions } from "../../stores/departmentsSlice";
import { notifyError, notifySuccess } from "../tools/Notify";
import {
  postNewEmployee,
  postNewEmployeeNumber,
} from "../../services/employeeService";
import Swal from "sweetalert2";

function AddEmployeeModal({ isOpen, setIsOpen }) {
  const { departments, regions } = useSelector((state) => state.departments);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [employeeName, setEmployeeName] = useState(null);
  const [employeeSurname, setEmployeeSurname] = useState(null);
  const [employeeDepartment, setEmployeeDepartment] = useState(null);
  const [employeeRegion, setEmployeeRegion] = useState(null);
  const [employeeExpl, setEmployeeExpl] = useState(null);
  const [employeeNum1, setEmployeeNum1] = useState(null);
  const [employeeNum2, setEmployeeNum2] = useState(null);

  const handleEmployee = async (e) => {
    e.preventDefault();
    try {
      if (employeeDepartment && employeeRegion) {
        Swal.fire({
          text: `Əlavə edilsin?`,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
          cancelButtonText: "İmtina",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const data = await postNewEmployee({
              name: employeeName,
              surname: employeeSurname,
              departmentId: employeeDepartment,
              regionId: employeeRegion,
              explanation: employeeExpl,
              userId: token.ID,
            });
            await postNewEmployeeNumber({
              employeeId: data[0].ID,
              num1: employeeNum1,
              num2: employeeNum2,
              userId: token.ID,
            });
            notifySuccess("Uğurla əlavə edildi!");
            setIsOpen(false);
          }
        });
      } else {
        notifyError("Bölmə və ya region seçilməyib");
      }
      console.log();
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getDepartments());
    dispatch(getRegions());
  }, []);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Yeni işçi
                </Dialog.Title>
                <form
                  onSubmit={handleEmployee}
                  className="mt-6 flex flex-col gap-2"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ad"
                      required
                      className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                      onChange={(e) => setEmployeeName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Soyad"
                      required
                      className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                      onChange={(e) => setEmployeeSurname(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="bg-transparent border border-gray-300 dark:bg-gray-700 dark:border-slate-500 text-gray-900 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 mobile:w-full "
                      required
                      defaultValue={"DEFAULT"}
                      onChange={(e) => setEmployeeDepartment(e.target.value)}
                    >
                      <option disabled hidden value={"DEFAULT"}>
                        Bölmə
                      </option>
                      {departments &&
                        departments.map((de) => (
                          <option key={de.ID} value={de.ID}>
                            {de.NAME}
                          </option>
                        ))}
                    </select>
                    <select
                      className="bg-transparent border border-gray-300 dark:bg-gray-700 dark:border-slate-500 text-gray-900 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 mobile:w-full "
                      required
                      defaultValue={"DEFAULT"}
                      onChange={(e) => setEmployeeRegion(e.target.value)}
                    >
                      <option disabled hidden value={"DEFAULT"}>
                        Region
                      </option>
                      {regions &&
                        regions.map((re) => (
                          <option key={re.ID} value={re.ID}>
                            {re.NAME}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Qeyd"
                      className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                      onChange={(e) => setEmployeeExpl(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nömrə 1"
                      required
                      className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                      onChange={(e) => setEmployeeNum1(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Nömrə 2"
                      className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                      onChange={(e) => setEmployeeNum2(e.target.value)}
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Əlavə et
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default AddEmployeeModal;
