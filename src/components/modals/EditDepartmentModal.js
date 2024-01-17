import { Dialog, Transition } from "@headlessui/react";
import { Fragment, memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getDepartments } from "../../stores/departmentsSlice";
import { notifyError, notifySuccess } from "../tools/Notify";
import { putDepartment } from "../../services/departmentsService";
import Swal from "sweetalert2";

function EditDepartmentModal({ isOpen, setIsOpen, department }) {
  const dispatch = useDispatch();
  const [departmentName, setDepartmentName] = useState(null);

  const closeModal = async (id) => {
    setIsOpen(false);
  };

  const handleDepartment = async (e) => {
    e.preventDefault();
    try {
      if (departmentName && departmentName.trim() !== "") {
        Swal.fire({
          title: "Düzəliş",
          text: `Dəyişiklik edilsin?`,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
          cancelButtonText: "İmtina",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const res = await putDepartment({
              name: departmentName.trim(),
              id: department.ID,
            });
            notifySuccess("Düzəliş edildi!");
            closeModal();
            dispatch(getDepartments());
          }
        });
      }
    } catch (error) {
      notifyError(`${error.name}: ${error.message}`);
    }
  };

  useEffect(() => {
    setDepartmentName(department && department.NAME);
  }, [department]);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                  Düzəliş
                </Dialog.Title>
                <form onSubmit={handleDepartment}>
                  <input
                    type="text"
                    placeholder="Bölmə adı"
                    required
                    defaultValue={department && department.NAME}
                    className="bg-transparent border border-gray-300 text-gray-900 dark:border-slate-500 dark:text-slate-300 dark:bg-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2"
                    onChange={(e) => setDepartmentName(e.target.value)}
                  />

                  <div className="mt-8">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-gray-500 dark:text-slate-300 dark:hover:bg-gray-700 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      OK
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

export default memo(EditDepartmentModal);
