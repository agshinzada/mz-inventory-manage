import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { notifyError, notifySuccess } from "../tools/Notify";
import dateFormat from "dateformat";
import { getReplacements } from "../../stores/replacementsSlice";
import { putReplacement } from "../../services/replacementsService";

function EditReplacementModal({ isOpen, setIsOpen, currentItem }) {
  const { departments } = useSelector((state) => state.departments);
  const dispatch = useDispatch();

  const [updateReplPlaced, setUpdateReplPlaced] = useState(null);
  const [updateReplDate, setUpdateReplDate] = useState(null);

  const updateItem = async () => {
    const obj = {
      id: currentItem.ID,
      placedId: updateReplPlaced,
      date: updateReplDate,
    };
    try {
      Swal.fire({
        title: "Yeniləmə",
        text: `Məlumatlar yenilənəcək`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
        cancelButtonText: "İmtina",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await putReplacement(obj);
          notifySuccess("Məlumatlar uğurla yeniləndi!");
          setIsOpen(false);
          dispatch(getReplacements());
        }
      });
    } catch (error) {
      notifyError(`Sistem xətası!`);
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      setUpdateReplPlaced(currentItem.PLACED_ID);
      setUpdateReplDate(new Date(currentItem.DATE).toLocaleString("az"));
    } catch (error) {
      console.log(error);
    }
  }, [currentItem]);

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
          <div className="flex min-h-full items-center justify-center p-4 text-center desktop:text-sm mobile:text-xs">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full desktop:max-w-xl mobile:max-w-xs transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="desktop:text-2xl mobile:text-lg font-medium pb-10 leading-6 text-gray-900 dark:text-slate-300"
                >
                  Düzəliş
                </Dialog.Title>
                <div className="flex flex-col desktop:gap-4 mobile:gap-2">
                  <div className="flex gap-2 desktop:flex-row mobile:flex-col">
                    <input
                      type="text"
                      defaultValue={currentItem.CODE}
                      disabled
                      className="bg-transparent border disabled:bg-slate-100 dark:disabled:bg-gray-800 border-gray-300 text-gray-900 dark:border-slate-500 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2"
                    />
                    <input
                      defaultValue={currentItem.NAME}
                      type="text"
                      disabled
                      className="bg-transparent border disabled:bg-slate-100 dark:disabled:bg-gray-800 border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                    />
                  </div>
                  <div className="flex gap-2 desktop:flex-row mobile:flex-col">
                    <input
                      defaultValue={currentItem.FROM}
                      type="text"
                      disabled
                      className="bg-transparent border disabled:bg-slate-100 dark:disabled:bg-gray-800 border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                    />
                    <select
                      className="bg-transparent border border-gray-300 dark:bg-gray-700 dark:border-slate-500 text-gray-900 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 mobile:w-full "
                      name="device_department"
                      defaultValue={currentItem.PLACED_ID}
                      onChange={(e) => setUpdateReplPlaced(e.target.value)}
                    >
                      <option
                        key={currentItem.PLACED_ID}
                        value={currentItem.PLACED_ID}
                      >
                        {currentItem.PLACED}
                      </option>
                      {departments &&
                        departments
                          .filter((d) => d.ID !== currentItem.PLACED_ID)
                          .map((dep) => (
                            <option key={dep.ID} value={dep.ID}>
                              {dep.NAME}
                            </option>
                          ))}
                    </select>
                  </div>
                  <input
                    defaultValue={
                      currentItem?.DATE
                        ? dateFormat(new Date(currentItem.DATE), "yyyy-mm-dd")
                        : ""
                    }
                    type="date"
                    onChange={(e) =>
                      setUpdateReplDate(
                        e.target.value +
                          " " +
                          new Date().toLocaleTimeString("az")
                      )
                    }
                    className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                  />
                </div>
                <div className="mt-8">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-gray-500 dark:text-slate-300 dark:hover:bg-gray-700 px-4 py-2 font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={updateItem}
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

export default EditReplacementModal;
