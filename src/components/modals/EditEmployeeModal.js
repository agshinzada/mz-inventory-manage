import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments, getRegions } from "../../stores/departmentsSlice";
import { notifyError, notifySuccess } from "../tools/Notify";
import { putEmployee } from "../../services/employeeService";
import Swal from "sweetalert2";

function EditEmployeeModal({ isOpen, setIsOpen, data }) {
  const { departments, regions } = useSelector((state) => state.departments);
  const dispatch = useDispatch();
  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [regionId, setRegionId] = useState(null);
  const [explanation, setExplanation] = useState(null);

  const handleEmployee = async () => {
    try {
      Swal.fire({
        text: `Düzəliş edilsin?`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
        cancelButtonText: "İmtina",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await putEmployee({
            employeeId: data.ID,
            name,
            surname,
            departmentId,
            regionId,
            explanation,
          });

          notifySuccess("Düzəliş edildi!");
          setIsOpen(false);
        }
      });
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getDepartments());
    dispatch(getRegions());
  }, []);

  useEffect(() => {
    setName(data.NAME);
    setSurname(data.SURNAME);
    setDepartmentId(data.DEPARTMENT_ID);
    setRegionId(data.REGION_ID);
    setExplanation(data.EXPLANATION);
  }, [data]);

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Düzəliş
                </Dialog.Title>
                <div className="mt-6 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ad"
                      defaultValue={data && data.NAME}
                      required
                      className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Soyad"
                      defaultValue={data && data.SURNAME}
                      required
                      className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                      onChange={(e) => setSurname(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="bg-transparent border border-gray-300 dark:bg-gray-700 dark:border-slate-500 text-gray-900 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 mobile:w-full "
                      required
                      defaultValue={data && data.DEPARTMENT_ID}
                      onChange={(e) => setDepartmentId(e.target.value)}
                    >
                      <option
                        disabled
                        hidden
                        value={data && data.DEPARTMENT_ID}
                      >
                        {data && data.DEPARTMENT}
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
                      defaultValue={data && data.REGION_ID}
                      onChange={(e) => setRegionId(e.target.value)}
                    >
                      <option disabled hidden value={data && data.REGION_ID}>
                        {data && data.REGION}
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
                      defaultValue={data && data.EXPLANATION}
                      required
                      className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                      onChange={(e) => setExplanation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => handleEmployee()}
                  >
                    Yadda saxla
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default EditEmployeeModal;
