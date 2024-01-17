import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getFiches, getPayments } from "../../stores/paymentsSlice";
import { notifyError, notifySuccess } from "../tools/Notify";
import AddInvoiceToFicheModal from "./AddInvoiceToFicheModal";
import { postNewFiche, postPaymentsBulk } from "../../services/paymentsService";

function AddFicheModal({ isOpen, setIsOpen, type, date, getInvoices }) {
  const [isOpenInvoices, setIsOpenInvoices] = useState(false);
  const [data, setData] = useState([]);
  const [submitInput, setSubmitInput] = useState(false);
  const { lastFicheCode } = useSelector((state) => state.payments);
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const invoiceListRef = useRef();

  const removeInvoice = (i) => {
    try {
      if (data.length === 1) {
        setData([]);
      } else {
        setData(data.filter((da) => da.ID !== i.ID));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFiche = async () => {
    try {
      setSubmitInput(true);
      let arr = [];
      if (data.length > 0) {
        for (
          let index = 0;
          index < invoiceListRef.current.children.length;
          index++
        ) {
          let priceValue =
            invoiceListRef.current.children[index].children[4].children[0]
              .value;
          if (priceValue && priceValue !== "") {
            const invoiceId =
              invoiceListRef.current.children[index].attributes["value"].value;
            const price =
              invoiceListRef.current.children[index].children[4].children[0]
                .value;
            const expl =
              invoiceListRef.current.children[index].children[5].children[0]
                .value;

            arr = [...arr, { invoiceId, price, expl }];
          } else {
            notifyError("Qiymətlər əlavə edilməyib!");
            arr = false;
            break;
          }
        }

        if (arr) {
          Swal.fire({
            title: "Yeni faktura",
            text: `Faktura məlumatları əlavə edilsin?`,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK",
            cancelButtonText: "İmtina",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const fiche = await postNewFiche({
                code: lastFicheCode,
                type,
                date,
                userId: token.ID,
              });
              const paymentRes = await postPaymentsBulk({
                ficheId: fiche.ID,
                userId: token.ID,
                arr,
              });
              if (paymentRes.status === 200) {
                notifySuccess("Faktura yaradıldı");
                getInvoices();
                setIsOpen(false);
                setTimeout(() => {
                  notifySuccess("Ödənişlər fakturaya əlavə olundu");
                }, 1500);
                setTimeout(() => {}, 2000);
                setData([]);
                setSubmitInput(false);
                dispatch(getPayments());
                dispatch(getFiches());
              }
            }
          });
        }
      } else {
        notifyError("Qaimə seçilməyib!");
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    } finally {
      setSubmitInput(false);
    }
  };

  return (
    <>
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
                <Dialog.Panel className="w-fit  transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium pb-5 leading-6 text-gray-900 dark:text-slate-300"
                  >
                    <p className="dark:text-white text-center text-lg mb-1">
                      FAKTURA - <strong>№{lastFicheCode}</strong>
                    </p>
                    <hr />
                  </Dialog.Title>
                  <div>
                    <div className="max-h-[500px] overflow-y-auto">
                      <table className="w-full desktop:text-sm mobile:text-xs text-left text-gray-500 rounded-l">
                        <thead className="text-gray-700 text-center uppercase text-xs bg-gray-50 dark:bg-gray-800 dark:text-slate-100">
                          <tr>
                            <th scope="col" className="px-3 py-3">
                              KOD
                            </th>
                            <th scope="col" className="px-3 py-3">
                              AD
                            </th>
                            <th scope="col" className="px-3 py-3">
                              TARİX
                            </th>
                            <th scope="col" className="px-3 py-3">
                              DOCCODE
                            </th>
                            <th scope="col" className="px-3 py-3">
                              Qİymət
                            </th>
                            <th scope="col" className="px-3 py-3">
                              açıqlama
                            </th>
                            <th scope="col" className="px-3 py-3"></th>
                          </tr>
                        </thead>
                        <tbody
                          className=" bg-white dark:bg-gray-800 dark:text-slate-300 text-center"
                          ref={invoiceListRef}
                        >
                          {data.length > 0 &&
                            data.map((invoice) => (
                              <tr
                                key={invoice.ID}
                                className=" border-b dark:border-b-gray-500  hover:bg-gray-50 dark:hover:bg-gray-700"
                                value={invoice.ID}
                              >
                                <th
                                  scope="row"
                                  className="px-3 py-4 font-bold text-gray-900 dark:text-slate-100 whitespace-nowrap"
                                >
                                  {invoice.CODE}
                                </th>
                                <td className="px-3 py-4 ">{invoice.NAME}</td>
                                <td className="px-3 py-4">
                                  {new Date(invoice.DATE).toLocaleDateString(
                                    "az"
                                  )}
                                </td>
                                <td className="px-3 py-4">{invoice.DOCCODE}</td>
                                <td className="px-2 py-4">
                                  <input
                                    type="number"
                                    id="visitors"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-20 py-2 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  />
                                </td>
                                <td className="px-2 py-4">
                                  <input
                                    type="text"
                                    id="visitors"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-36 py-2 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  />
                                </td>
                                <td className="px-2 py-4">
                                  <button
                                    className="text-lg"
                                    onClick={() => removeInvoice(invoice)}
                                  >
                                    X
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="text-white text-sm mt-7 h-fit bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium border border-gray-500 rounded-lg py-2 px-6 w-72"
                        onClick={() => setIsOpenInvoices(true)}
                      >
                        Qaimə əlavə et
                      </button>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-gray-500 dark:text-slate-100 dark:hover:bg-gray-700 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleFiche}
                      disabled={submitInput}
                    >
                      Əlavə et
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <AddInvoiceToFicheModal
        isOpen={isOpenInvoices}
        setIsOpen={setIsOpenInvoices}
        data={data}
        setData={setData}
      />
    </>
  );
}

export default AddFicheModal;
