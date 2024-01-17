import { Dialog, Transition } from "@headlessui/react";
import { Fragment, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTypes } from "../../stores/typesSlice";
import { notifyError, notifySuccess } from "../tools/Notify";
import { postNewType } from "../../services/itemTypesService";
import Swal from "sweetalert2";
import EditTypeModal from "./EditTypeModal";

function TypesModal({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const { types } = useSelector((state) => state.types);
  const { token } = useSelector((state) => state.auth);
  const [typeName, setTypeName] = useState();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openEditModal = (type) => {
    setSelectedType(type);
    setIsEditOpen(true);
  };

  const handleType = async () => {
    try {
      if (typeName && typeName.trim() !== "") {
        Swal.fire({
          title: "Yeni tip",
          text: `Əlavə edilsin?`,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
          cancelButtonText: "İmtina",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await postNewType({
              name: typeName.trim(),
              userId: token.ID,
            });
            notifySuccess("Yeni tip uğurla əlavə edildi!");
            dispatch(getTypes());
          }
        });
      } else {
        notifyError(`Xananı doldurun`);
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  return (
    <>
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

          <div className="fixed inset-0 overflow-hidden">
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium pb-10 leading-6 text-gray-900 dark:text-slate-300"
                  >
                    Cihaz tipləri
                  </Dialog.Title>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Tip adı"
                      className="bg-transparent border border-gray-300 text-gray-900 dark:border-slate-500 dark:text-slate-300 dark:bg-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-fit p-2"
                      onChange={(e) => setTypeName(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2 px-6 w-fit h-fit"
                      onClick={handleType}
                    >
                      Əlavə et
                    </button>
                  </div>
                  <hr className="my-4" />

                  <div className="flex flex-col pr-3 gap-3 max-h-[25rem] overflow-y-auto">
                    {types &&
                      types.map((type) => (
                        <div className="flex items-center gap-3" key={type.ID}>
                          <span className="dark:text-white">{type.ID}</span>
                          <span className="bg-transparent border border-gray-300 text-gray-900 dark:border-slate-500 dark:text-slate-300 dark:bg-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2">
                            {type.NAME}
                          </span>
                          {token.ROLE === "ADMIN" && (
                            <button
                              type="submit"
                              className="text-gray-800 dark:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2 px-6 w-fit h-fit"
                              onClick={() => openEditModal(type)}
                            >
                              Düzəliş
                            </button>
                          )}
                        </div>
                      ))}
                  </div>

                  <div className="mt-8">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-gray-500 dark:text-slate-300 dark:hover:bg-gray-700 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      OK
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <EditTypeModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        type={selectedType}
      />
    </>
  );
}

export default memo(TypesModal);
