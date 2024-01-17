import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { notifyError, notifySuccess } from "../tools/Notify";
import { useDispatch } from "react-redux";
import axios from "axios";
import { urlRoot } from "../..";
import dateFormat from "dateformat";
import { getPayments } from "../../stores/paymentsSlice";
import Swal from "sweetalert2";

function EditPaymentModal({ isOpen, setIsOpen, data }) {
  const dispatch = useDispatch();
  const [paymentDate, setPaymentDate] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(null);
  const [paymentExp, setPaymentExp] = useState(null);

  const updatePayment = async () => {
    const obj = {
      id: data.ID,
      date: paymentDate,
      amount: paymentAmount,
      explanation: paymentExp,
    };
    Swal.fire({
      title: "Düzəliş",
      text: `Ödəniş məlumatları yenilənəcək`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "OK",
      cancelButtonText: "İmtina",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.put(`${urlRoot}/items/payments`, obj);
          notifySuccess("Ödəniş məlumatları uğurla yeniləndi!");
          setIsOpen(false);
          dispatch(getPayments());
        } catch (error) {
          notifyError("Sistem xətası!");
          console.log(error.response);
        }
      }
    });
  };

  useEffect(() => {
    setPaymentDate(new Date(data.DATE).toLocaleDateString("az"));
    setPaymentAmount(data.AMOUNT);
    setPaymentExp(data.EXPLANATION);
  }, [data]);

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
                      defaultValue={data.CODE}
                      placeholder="Kod"
                      disabled
                      className="bg-transparent border disabled:bg-slate-100 dark:disabled:bg-gray-800 border-gray-300 text-gray-900 dark:border-slate-500 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2"
                    />
                    <input
                      defaultValue={data.NAME}
                      type="text"
                      placeholder="Ad"
                      disabled
                      className="bg-transparent border disabled:bg-slate-100 dark:disabled:bg-gray-800 border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                    />
                  </div>

                  <input
                    defaultValue={
                      data?.DATE
                        ? dateFormat(new Date(data.DATE), "yyyy-mm-dd")
                        : ""
                    }
                    type="date"
                    placeholder="Tarix"
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                  />
                  <div className="flex gap-2 desktop:flex-row mobile:flex-col">
                    <input
                      defaultValue={data.AMOUNT}
                      type="number"
                      placeholder="Qiymət"
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                    />
                    <input
                      defaultValue={data.EXPLANATION}
                      type="text"
                      placeholder="Əlavə"
                      onChange={(e) => setPaymentExp(e.target.value)}
                      className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-gray-500 dark:text-slate-300 dark:hover:bg-gray-700 px-4 py-2 font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={updatePayment}
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

export default EditPaymentModal;
