import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { urlRoot } from "../..";
import { getInvoices } from "../../stores/invoicesSlice";
import { notifyError, notifySuccess } from "../tools/Notify";
import dateFormat from "dateformat";
import Swal from "sweetalert2";
import { putInvoice } from "../../services/invoicesService";

function EditInvoiceModal({ isOpen, setIsOpen, currentItem }) {
  const invoices = useSelector((state) => state.invoices);
  const [updateInvoiceDate, setUpdateInvoiceDate] = useState(null);
  const [updateInvoiceDoccode, setUpdateInvoiceDoccode] = useState(null);
  const [updateInvoiceExp, setUpdateInvoiceExp] = useState(null);
  const dispatch = useDispatch();

  const updateInvoice = async () => {
    const obj = {
      id: currentItem.ID,
      date: updateInvoiceDate,
      docId: updateInvoiceDoccode,
      explanation: updateInvoiceExp,
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
          await putInvoice(obj);
          notifySuccess("Məlumatlar uğurla yeniləndi!");
          setIsOpen(false);
          dispatch(getInvoices());
        }
      });
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      setUpdateInvoiceDate(new Date(currentItem.DATE).toLocaleString("az"));
      setUpdateInvoiceDoccode(currentItem.DOC_ID);
      setUpdateInvoiceExp(currentItem.EXPLANATION);
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
                <div className="flex flex-col desktop:gap-4 mobile:gap-2  ">
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
                      disabled
                      className="bg-transparent border disabled:bg-slate-100 dark:disabled:bg-gray-800 border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                    />
                  </div>

                  <input
                    defaultValue={
                      currentItem?.DATE
                        ? dateFormat(new Date(currentItem.DATE), "yyyy-mm-dd")
                        : ""
                    }
                    type="date"
                    placeholder="Tarix"
                    onChange={(e) =>
                      setUpdateInvoiceDate(
                        e.target.value +
                          " " +
                          new Date().toLocaleTimeString("az")
                      )
                    }
                    className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                  />
                  <div className="flex gap-2 desktop:flex-row mobile:flex-col">
                    <select
                      className="bg-transparent border border-gray-300 dark:bg-gray-700 dark:border-slate-500 text-gray-900 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 mobile:w-full "
                      onChange={(e) => setUpdateInvoiceDoccode(e.target.value)}
                      defaultValue={currentItem.DOC_ID}
                    >
                      <option
                        key={currentItem.DOC_ID}
                        value={currentItem.DOC_ID}
                      >
                        {currentItem.DOCCODE}
                      </option>

                      {invoices.docCodes
                        .filter((t) => t.ID !== currentItem.DOC_ID)
                        .map((doccode) => (
                          <option key={doccode.ID} value={doccode.ID}>
                            {doccode.NAME}
                          </option>
                        ))}
                    </select>
                    <input
                      defaultValue={currentItem.EXPLANATION}
                      type="text"
                      placeholder="Əlavə"
                      onChange={(e) => setUpdateInvoiceExp(e.target.value)}
                      className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-gray-500 dark:text-slate-300 dark:hover:bg-gray-700 px-4 py-2 font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={updateInvoice}
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

export default EditInvoiceModal;
