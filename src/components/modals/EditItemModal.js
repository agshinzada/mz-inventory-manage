import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { urlRoot } from "../..";
import { getItems } from "../../stores/itemsSlice";
import { notifyError, notifySuccess } from "../tools/Notify";
import { putItem } from "../../services/itemService";

function EditItemModal({ isOpen, setIsOpen, currentItem }) {
  const { types } = useSelector((state) => state.types);
  const { departments } = useSelector((state) => state.departments);
  const [updateItemName, setUpdateItemName] = useState(null);
  const [updateItemType, setUpdateItemType] = useState(null);
  const [updateItemDepartment, setUpdateItemDepartment] = useState(null);
  const dispatch = useDispatch();

  const updateItem = async () => {
    const obj = {
      id: currentItem.ID,
      name: updateItemName,
      typeId: updateItemType,
      departmentId: updateItemDepartment,
    };
    try {
      Swal.fire({
        title: "Yeniləmə",
        text: `'${currentItem.CODE}' kodlu cihaz məlumatları yenilənəcək`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
        cancelButtonText: "İmtina",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await putItem(obj);
          notifySuccess("Cihaz məlumatları uğurla yeniləndi!");
          setIsOpen(false);
          dispatch(getItems());
        }
      });
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      setUpdateItemName(currentItem.NAME);
      setUpdateItemType(currentItem.TYPE_ID);
      setUpdateItemDepartment(currentItem.DEPARTMENT_ID);
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
                      placeholder="Kod"
                      disabled
                      className="bg-transparent border disabled:bg-slate-100 dark:disabled:bg-gray-800 border-gray-300 text-gray-900 dark:border-slate-500 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2"
                    />
                    <input
                      defaultValue={currentItem.NAME}
                      type="text"
                      placeholder="Ad"
                      onChange={(e) => setUpdateItemName(e.target.value)}
                      className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                    />
                  </div>
                  <div className="flex gap-2 desktop:flex-row mobile:flex-col">
                    <select
                      className="bg-transparent border border-gray-300 dark:bg-gray-700 dark:border-slate-500 text-gray-900 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 mobile:w-full "
                      name="device_type"
                      defaultValue={currentItem.TYPE_ID}
                      onChange={(e) => setUpdateItemType(e.target.value)}
                    >
                      <option
                        key={currentItem.TYPE_ID}
                        value={currentItem.TYPE_ID}
                      >
                        {currentItem.TYPE}
                      </option>

                      {types &&
                        types
                          .filter((t) => t.ID !== currentItem.TYPE_ID)
                          .map((type) => (
                            <option key={type.ID} value={type.ID}>
                              {type.NAME}
                            </option>
                          ))}
                    </select>
                    <select
                      className="bg-transparent border border-gray-300 dark:bg-gray-700 dark:border-slate-500 text-gray-900 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 mobile:w-full "
                      name="device_department"
                      defaultValue={currentItem.DEPARTMENT_ID}
                      onChange={(e) => setUpdateItemDepartment(e.target.value)}
                    >
                      <option
                        key={currentItem.DEPARTMENT_ID}
                        value={currentItem.DEPARTMENT_ID}
                      >
                        {currentItem.DEPARTMENT}
                      </option>

                      {departments &&
                        departments
                          .filter((d) => d.ID !== currentItem.DEPARTMENT_ID)
                          .map((dep) => (
                            <option key={dep.ID} value={dep.ID}>
                              {dep.NAME}
                            </option>
                          ))}
                    </select>
                  </div>
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

export default EditItemModal;
