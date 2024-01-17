import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { notifyError, notifySuccess } from "../tools/Notify";
import Swal from "sweetalert2";
import { putEmployeeNumber } from "../../services/employeeService";

function EditEmployeeNumber({ isOpen, setIsOpen, data }) {
  const [num1, setNum1] = useState(null);
  const [num2, setNum2] = useState(null);

  const handleNumbers = async () => {
    try {
      if (num1 === "" || num2 === "") {
        notifyError("Xanaları doldurun!");
      } else {
        Swal.fire({
          text: `Düzəliş edilsin?`,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
          cancelButtonText: "İmtina",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await putEmployeeNumber({
              obj: data,
              num1,
              num2,
            });
            notifySuccess("Düzəliş edildi!");
            setIsOpen(false);
          }
        });
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  useEffect(() => {
    setNum1(data[0]?.NUMBER);
    setNum2(data[1]?.NUMBER);
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
              <Dialog.Panel className="w-full desktop:max-w-md mobile:max-w-xs transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="desktop:text-lg mobile:text-md font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Düzəliş
                </Dialog.Title>
                <div className="mt-6 flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Ad"
                    defaultValue={data && data[0]?.NUMBER}
                    required
                    className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                    onChange={(e) => setNum1(e.target.value.trim())}
                  />

                  {data.length > 1 && (
                    <input
                      type="text"
                      placeholder="Ad"
                      defaultValue={data && data[1]?.NUMBER}
                      required
                      className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                      onChange={(e) => setNum2(e.target.value.trim())}
                    />
                  )}
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 desktop:text-sm mobile:text-xs font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => handleNumbers()}
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

export default EditEmployeeNumber;
