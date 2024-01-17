import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useSelector } from "react-redux";

function FichesModal({ isOpen, setIsOpen, setData }) {
  const { fiches } = useSelector((state) => state.payments);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative" onClose={() => setIsOpen(false)}>
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
              <Dialog.Panel className="w-fit h-fit transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium pb-5 leading-6 text-gray-900 dark:text-slate-300"
                >
                  <p className="dark:text-white text-center text-lg">
                    <strong>Fakturalar</strong>
                  </p>
                </Dialog.Title>
                <div className="max-h-[500px] h-full overflow-y-auto">
                  <table className="w-full overflow-y-auto desktop:text-sm mobile:text-xs text-left text-gray-500 rounded-l">
                    <thead className="text-gray-700 uppercase text-xs bg-gray-50 dark:bg-gray-800 dark:text-slate-100">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          NÖMRƏ
                        </th>
                        <th scope="col" className="px-6 py-3">
                          AD
                        </th>
                        <th scope="col" className="px-6 py-3">
                          QİYMƏT
                        </th>
                        <th scope="col" className="px-6 py-3">
                          TARİX
                        </th>
                      </tr>
                    </thead>
                    <tbody className=" bg-white dark:bg-gray-800 dark:text-slate-300">
                      {fiches.length > 0
                        ? fiches.map((payment) => (
                            <tr
                              key={payment.ID}
                              className=" border-b  cursor-pointer dark:border-b-gray-500  hover:bg-gray-50 dark:hover:bg-gray-700"
                              onDoubleClick={() => {
                                setData(payment);
                                setIsOpen(false);
                              }}
                            >
                              <th
                                scope="row"
                                className="px-6 py-4 font-bold text-gray-900 dark:text-slate-100 whitespace-nowrap"
                              >
                                {payment.CODE}
                              </th>
                              <td className="px-6 py-4 ">{payment.NAME}</td>
                              <td className="px-6 py-4">{payment.TOTAL}</td>

                              <td className="px-6 py-4">
                                {new Date(payment.DATE).toLocaleDateString(
                                  "az"
                                )}
                              </td>
                            </tr>
                          ))
                        : "Faktura yoxdur"}
                    </tbody>
                  </table>
                </div>
                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-gray-500 dark:text-slate-100 dark:hover:bg-gray-700 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => setIsOpen(false)}
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
  );
}

export default FichesModal;
