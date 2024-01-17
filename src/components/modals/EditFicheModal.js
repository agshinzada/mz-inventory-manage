import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { notifyError, notifySuccess } from "../tools/Notify";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { getFiches, getPayments } from "../../stores/paymentsSlice";
import { putPaymentsBulk, removePayment } from "../../services/paymentsService";

function EditFicheModal({ isOpen, setIsOpen, data, setData, fiche }) {
  const invoiceListRef = useRef();
  const [submitButton, setSubmitButton] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handlePayment = async (id) => {
    try {
      Swal.fire({
        title: "Silinmə",
        text: `Ödəniş ləğv ediləcək`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
        cancelButtonText: "İmtina",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await removePayment(id);
          notifySuccess("Ödəniş uğurla silindi!");
          setData(data.filter((p) => p.ID !== id));
        }
      });
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const handleFiche = async () => {
    try {
      setSubmitButton(true);
      let arr = [];
      if (data.length > 0) {
        for (
          let index = 0;
          index < invoiceListRef.current.children.length;
          index++
        ) {
          let priceValue =
            invoiceListRef.current.children[index].children[5].children[0]
              .value;
          if (priceValue && priceValue !== "") {
            const id =
              invoiceListRef.current.children[index].attributes["value"].value;
            const price =
              invoiceListRef.current.children[index].children[5].children[0]
                .value;
            const expl =
              invoiceListRef.current.children[index].children[6].children[0]
                .value;

            arr = [...arr, { id, price, expl }];
          } else {
            notifyError("Qiymət boş qoyula bilməz!");
            break;
          }
        }
        Swal.fire({
          title: "Faktura düzəliş",
          text: `Faktura məlumatları yeniləcək`,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
          cancelButtonText: "İmtina",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              if (arr) {
                if (result.isConfirmed) {
                  await putPaymentsBulk(arr);
                  notifySuccess("Faktura uğurla yeniləndi!");
                  dispatch(getFiches());
                  dispatch(getPayments());
                  setIsOpen(false);
                }
              }
            } catch (error) {
              notifyError("Sistem xətası!");
              console.log(error.response);
            }
          }
        });
      } else {
        notifyError("Qaimə seçilməyib!");
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    } finally {
      setSubmitButton(false);
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
                      FAKTURA - <strong>№{fiche && fiche.CODE}</strong>
                    </p>
                    <hr />
                  </Dialog.Title>
                  <div>
                    <div className="max-h-[500px] h-full overflow-y-auto">
                      <table className="w-full desktop:text-sm mobile:text-xs text-left text-gray-500 rounded-l">
                        <thead className="text-gray-700 text-center uppercase text-xs bg-gray-50 dark:bg-gray-800 dark:text-slate-100">
                          <tr>
                            <th scope="col" className="px-3 py-3">
                              REF
                            </th>
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
                            {token.ROLE === "ADMIN" && (
                              <th scope="col" className="px-3 py-3"></th>
                            )}
                          </tr>
                        </thead>
                        <tbody
                          className=" bg-white dark:bg-gray-800 dark:text-slate-300 text-center"
                          ref={invoiceListRef}
                        >
                          {data &&
                            data.map((payment) => (
                              <tr
                                key={payment.ID}
                                className=" border-b dark:border-b-gray-500  hover:bg-gray-50 dark:hover:bg-gray-700"
                                value={payment.ID}
                              >
                                <th
                                  scope="row"
                                  className="px-3 py-4 font-bold text-gray-900 dark:text-slate-100 whitespace-nowrap"
                                >
                                  {payment.ID}
                                </th>
                                <td className="px-3 py-4 ">{payment.CODE}</td>
                                <td className="px-3 py-4 ">{payment.NAME}</td>
                                <td className="px-3 py-4">
                                  {new Date(payment.DATE).toLocaleDateString(
                                    "az"
                                  )}
                                </td>
                                <td className="px-3 py-4">{payment.DOCCODE}</td>
                                <td className="px-2 py-4">
                                  <input
                                    type="number"
                                    id="visitors"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-20 py-2 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    defaultValue={payment.AMOUNT}
                                  />
                                </td>
                                <td className="px-2 py-4">
                                  <input
                                    type="text"
                                    id="visitors"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-36 py-2 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    defaultValue={payment.EXPLANATION}
                                  />
                                </td>
                                {token.ROLE === "ADMIN" && (
                                  <td className="px-2 py-4">
                                    <button
                                      className="text-lg"
                                      onClick={() => handlePayment(payment.ID)}
                                    >
                                      X
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={submitButton}
                      onClick={handleFiche}
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-gray-500 dark:text-slate-100 dark:hover:bg-gray-700 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
    </>
  );
}

export default EditFicheModal;
