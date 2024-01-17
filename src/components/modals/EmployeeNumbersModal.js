import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { notifyError } from "../tools/Notify";
import EditEmployeeNumber from "./EditEmployeeNumber";

function EmployeeNumbersModal({ isOpen, setIsOpen }) {
  const { numbers } = useSelector((state) => state.employees);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [data, setData] = useState([]);
  return (
    <>
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
                    Ətraflı
                  </Dialog.Title>
                  <div className="mt-2">
                    {numbers.length > 0 ? (
                      numbers.map((number) => (
                        <p
                          className="desktop:text-lg mobile:text-xs text-gray-500 dark:text-gray-300"
                          key={number.ID}
                        >
                          {number.NUMBER}
                        </p>
                      ))
                    ) : (
                      <p className="desktop:text-lg mobile:text-xs text-gray-500 dark:text-gray-300">
                        Nömrə qeyd edilməyib!
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 desktop:text-sm mobile:text-xs font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsOpen(false)}
                    >
                      OK
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-400 px-4 py-2 desktop:text-sm mobile:text-xs font-medium text-blue-900 hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        if (numbers.length > 0) {
                          setData(numbers);
                          setIsOpenEdit(true);
                        } else {
                          notifyError("Düzəliş ediləcək nömrə yoxdur!");
                        }
                      }}
                    >
                      Düzəliş
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <EditEmployeeNumber
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        data={numbers}
      />
    </>
  );
}

export default EmployeeNumbersModal;
