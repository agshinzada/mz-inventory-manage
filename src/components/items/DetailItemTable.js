import axios from "axios";
import { Fragment, memo, useState } from "react";
import { urlRoot } from "../..";
import { notifyError } from "../tools/Notify";
import { useDispatch, useSelector } from "react-redux";

import { Dialog, Transition } from "@headlessui/react";
import { setSearchedInvoices } from "../../stores/invoicesSlice";
import { setSearchedReplacements } from "../../stores/replacementsSlice";

function DetailItemTable({ data }) {
  const dispatch = useDispatch();

  const invoices = useSelector((state) => state.invoices);
  const replacements = useSelector((state) => state.replacements);

  let [isOpenInvoice, setIsOpenInvoice] = useState(false);
  let [isOpenRepl, setIsOpenRepl] = useState(false);

  const openInvoiceModal = async (id) => {
    try {
      const res = await axios.get(`${urlRoot}/items/invoices/item?id=${id}`);
      if (res.status === 200 && res.statusText === "OK") {
        dispatch(setSearchedInvoices(res.data));
        setIsOpenInvoice(true);
      } else {
        notifyError(`Xəta: ${res.statusText}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openReplModal = async (id) => {
    try {
      const res = await axios.get(
        `${urlRoot}/items/replacements/item?id=${id}`
      );
      if (res.status === 200 && res.statusText === "OK") {
        dispatch(setSearchedReplacements(res.data));
        setIsOpenRepl(true);
      } else {
        notifyError(`Xəta: ${res.statusText}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function closeInvoiceModal() {
    setIsOpenInvoice(false);
  }
  function closeReplModal() {
    setIsOpenRepl(false);
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative overflow-x-auto overflow-y-auto sm:rounded-lg w-full shadow-md h-fit max-h-[50rem]">
        <table className="desktop:w-full mobile:text-xs desktop:text-sm text-left text-gray-500 dark:text-slate-300 rounded-l animate__animated animate__fadeIn ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-slate-300">
            <tr>
              <th scope="col" className="px-6 py-3">
                KOD
              </th>
              <th scope="col" className="px-6 py-3">
                AD
              </th>
              <th scope="col" className="px-6 py-3">
                TİP
              </th>
              <th scope="col" className="px-6 py-3">
                BÖLMƏ
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data.map((item) => (
                <tr
                  key={item.ID}
                  className="bg-white border-b dark:border-b-slate-600 dark:hover:bg-gray-700 hover:bg-gray-50 dark:bg-gray-800"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-bold text-black dark:text-slate-300"
                  >
                    {item.CODE}
                  </th>
                  <td className="px-6 py-4">{item.NAME}</td>
                  <td className="px-6 py-4">{item.TYPE}</td>
                  <td className="px-6 py-4">{item.DEPARTMENT}</td>
                  <td className="px-6 py-4 flex desktop:flex-row mobile:flex-col gap-2">
                    <button
                      type="submit"
                      className=" text-white focus:ring-1 bg-blue-800 hover:bg-blue-900 dark:hover:bg-gray-600 dark:bg-transparent font-medium rounded-lg text-sm py-2 px-6 desktop:w-fit mobile:w-full"
                      onClick={() => openInvoiceModal(item.ID)}
                    >
                      Invoices
                    </button>
                    <button
                      type="submit"
                      className=" text-white outline-none bg-blue-800 hover:bg-blue-900 dark:hover:bg-gray-600 dark:bg-transparent focus:ring-1 font-medium rounded-lg text-sm py-2 px-6 desktop:w-fit mobile:w-full"
                      onClick={() => openReplModal(item.ID)}
                    >
                      Yerdəyişmə
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Transition appear show={isOpenInvoice} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeInvoiceModal}>
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
                <Dialog.Panel className="w-full desktop:max-w-xl mobile:max-w-xs transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="desktop:text-2xl mobile:text-lg font-medium pb-3 leading-6 text-gray-900 dark:text-slate-300"
                  >
                    Invoices
                  </Dialog.Title>
                  <div class="overflow-x-auto relative">
                    <table class="w-full desktop:text-sm mobile:text-xs text-left text-gray-500 dark:text-gray-400">
                      <thead class="text-xs text-gray-700 uppercase dark:text-gray-400">
                        <tr>
                          <th
                            scope="col"
                            class="py-3 px-6 bg-gray-50 dark:bg-gray-800"
                          >
                            DOCCODE
                          </th>
                          <th scope="col" class="py-3 px-6">
                            QİYMƏT
                          </th>
                          <th
                            scope="col"
                            class="py-3 px-6 bg-gray-50 dark:bg-gray-800"
                          >
                            FAKTURA
                          </th>
                          <th scope="col" class="py-3 px-6">
                            Tarix
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices?.table.map((invoice) => (
                          <tr
                            class="border-b border-gray-200 dark:border-gray-700 dark:text-gray-300"
                            key={invoice.ID}
                          >
                            <th
                              scope="row"
                              class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-gray-300 dark:bg-gray-800"
                            >
                              {invoice.DOCCODE}
                            </th>

                            <td class="py-4 px-6">{invoice.AMOUNT} AZN</td>
                            <td class="py-4 px-6 bg-gray-50 dark:bg-gray-800">
                              {invoice.FICHENO}
                            </td>
                            <td class="py-4 px-6">
                              {new Date(invoice?.DATE).toLocaleDateString("az")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-gray-500 dark:text-slate-300 desktop:text-sm mobile:text-xs dark:hover:bg-gray-700 px-4 py-2 font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeInvoiceModal}
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
      <Transition appear show={isOpenRepl} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeReplModal}>
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
                <Dialog.Panel className="w-full desktop:max-w-lg mobile:max-w-xs transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium pb-3 leading-6 text-gray-900 dark:text-slate-300"
                  >
                    Invoices
                  </Dialog.Title>
                  <div className="py-5 flex flex-col gap-2">
                    <div class="overflow-x-auto relative">
                      <table class="w-full desktop:text-sm mobile:text-xs text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase dark:text-gray-400">
                          <tr>
                            <th
                              scope="col"
                              class="py-3 px-6 bg-gray-50 dark:bg-gray-800"
                            >
                              Haradan
                            </th>
                            <th scope="col" class="py-3 px-6">
                              Haraya
                            </th>
                            <th
                              scope="col"
                              class="py-3 px-6 bg-gray-50 dark:bg-gray-800"
                            >
                              Tarix
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {replacements?.table.map((repl) => (
                            <tr
                              class="border-b border-gray-200 dark:border-gray-700 dark:text-gray-300"
                              key={repl.ID}
                            >
                              <th
                                scope="row"
                                class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-gray-300 dark:bg-gray-800"
                              >
                                {repl.FROM}
                              </th>
                              <td class="py-4 px-6">{repl.PLACED}</td>
                              <td class="py-4 px-6 bg-gray-50 dark:bg-gray-800">
                                {new Date(repl.DATE).toLocaleDateString("az")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-gray-500 dark:text-slate-300 dark:hover:bg-gray-700 px-4 py-2 desktop:text-sm mobile:text-xs font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeReplModal}
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
    </div>
  );
}

export default memo(DetailItemTable);
