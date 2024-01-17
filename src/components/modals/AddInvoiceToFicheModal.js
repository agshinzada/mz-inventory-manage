import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { notifyError } from "../tools/Notify";
import { useDispatch, useSelector } from "react-redux";

function AddInvoiceToFicheModal({ isOpen, setIsOpen, data, setData }) {
  const { nonPriceInvoices: invoices } = useSelector((state) => state.invoices);
  const handleInvoice = (i) => {
    try {
      const exist = data.find((d) => d.ID === i.ID);
      if (exist) {
        notifyError("Bu qaimə əlavə edilib!");
      } else {
        setData([...data, i]);
      }
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

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
                    Cari ay üzrə <strong>qaimələr</strong>
                  </p>
                </Dialog.Title>
                <div className="max-h-[500px] h-full overflow-y-auto">
                  <table className="w-full overflow-y-auto desktop:text-sm mobile:text-xs text-left text-gray-500 rounded-l">
                    <thead className="text-gray-700 uppercase text-xs bg-gray-50 dark:bg-gray-800 dark:text-slate-100">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          KOD
                        </th>
                        <th scope="col" className="px-6 py-3">
                          AD
                        </th>
                        <th scope="col" className="px-6 py-3">
                          TARİX
                        </th>
                        <th scope="col" className="px-6 py-3">
                          DOCCODE
                        </th>
                        <th scope="col" className="px-6 py-3">
                          AÇIQLAMA
                        </th>
                      </tr>
                    </thead>
                    <tbody className=" bg-white dark:bg-gray-800 dark:text-slate-300">
                      {invoices.length > 0
                        ? invoices.map((invoice) => (
                            <tr
                              key={invoice.ID}
                              className=" border-b  cursor-pointer dark:border-b-gray-500  hover:bg-gray-50 dark:hover:bg-gray-700"
                              onDoubleClick={() => handleInvoice(invoice)}
                            >
                              <th
                                scope="row"
                                className="px-6 py-4 font-bold text-gray-900 dark:text-slate-100 whitespace-nowrap"
                              >
                                {invoice.CODE}
                              </th>
                              <td className="px-6 py-4 ">{invoice.NAME}</td>
                              <td className="px-6 py-4">
                                {new Date(invoice.DATE).toLocaleDateString(
                                  "az"
                                )}
                              </td>
                              <td className="px-6 py-4">{invoice.DOCCODE}</td>
                              <td className="px-6 py-4">
                                {invoice.EXPLANATION}
                              </td>
                            </tr>
                          ))
                        : "Ay üzrə qaimə yoxdur"}
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

export default AddInvoiceToFicheModal;
