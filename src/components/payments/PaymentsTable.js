import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getPayments } from "../../stores/paymentsSlice";
import { notifyError, notifySuccess } from "../tools/Notify";
import EditPaymentModal from "../modals/EditPaymentModal";
import {
  changePaymentLockStatus,
  removePayment,
} from "../../services/paymentsService";

function PaymentsTable() {
  const dispatch = useDispatch();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState([]);

  const { payments } = useSelector((state) => state.payments);
  const { token } = useSelector((state) => state.auth);

  const openModal = async (payment) => {
    setSelectedPayment(payment);
    setIsOpenEdit(true);
  };

  const unlockPayment = async (id) => {
    try {
      Swal.fire({
        text: `Ödənişin klidi açılacaq`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
        cancelButtonText: "İmtina",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await changePaymentLockStatus(0, id);
          notifySuccess("Klid açıldı!");
          dispatch(getPayments());
        }
      });
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const lockPayment = async (id) => {
    try {
      Swal.fire({
        text: `Ödəniş klidlənəcək`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
        cancelButtonText: "İmtina",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await changePaymentLockStatus(1, id);
          notifySuccess("Klidləndi!");
          dispatch(getPayments());
        }
      });
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const handlePayment = async (payment) => {
    Swal.fire({
      title: "Silinmə",
      text: `'${payment.CODE}' kodlu ödəniş silinəcək`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sil",
      cancelButtonText: "İmtina",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await removePayment(payment.ID);
          notifySuccess(`"${payment.CODE}" kodlu ödəniş uğurla silindi.`);
          dispatch(getPayments());
        } catch (error) {
          notifyError("Sistem xətası!");
          console.log(error.response);
        }
      }
    });
  };

  return (
    <>
      <div className="relative overflow-x-auto sm:rounded-lg w-full  max-h-screen">
        {payments.length > 0 ? (
          <table className="w-full mobile:text-xs desktop:text-sm shadow-md text-left text-gray-500 dark:text-slate-300 rounded-l">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-slate-300">
              <tr>
                <th scope="col" className="px-6 py-3">
                  REF
                </th>
                <th scope="col" className="px-6 py-3">
                  KOD
                </th>
                <th scope="col" className="px-6 py-3">
                  AD
                </th>
                <th scope="col" className="px-6 py-3">
                  QİYMƏT
                </th>
                <th scope="col" className="px-6 py-3">
                  DOCCODE
                </th>
                <th scope="col" className="px-6 py-3">
                  Açıqlama
                </th>
                <th scope="col" className="px-6 py-3">
                  TARİX
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {payments &&
                payments.map((payment) => (
                  <tr
                    key={payment.ID}
                    className="bg-white border-b dark:border-b-slate-600 dark:hover:bg-gray-700 hover:bg-gray-50 dark:bg-gray-800"
                  >
                    <td className="px-6 py-4">{payment.ID}</td>

                    <th
                      scope="row"
                      className="px-6 py-4 font-bold text-black dark:text-slate-300"
                    >
                      {payment.CODE}
                    </th>
                    <td className="px-6 py-4">{payment.NAME}</td>
                    <td className="px-6 py-4">{payment.AMOUNT}</td>
                    <td className="px-6 py-4">{payment.DOCCODE}</td>
                    <td className="px-6 py-4">{payment.EXPLANATION}</td>
                    <td className="px-6 py-4">
                      {new Date(payment.DATE).toLocaleDateString("az")}
                    </td>
                    {(() => {
                      if (payment.LOCK_STATUS === 0) {
                        return (
                          <td className="px-6 py-4 flex gap-2">
                            <button
                              className="text-slate-100 py-1 px-4 rounded-md dark:text-slate-100 bg-blue-600"
                              onClick={() => openModal(payment)}
                            >
                              düzəliş
                            </button>
                            {token.ROLE === "ADMIN" && (
                              <button
                                className="font-bold  dark:text-slate-300 text-slate-100 bg-red-600 py-1 px-4 rounded-md"
                                onClick={() => handlePayment(payment)}
                              >
                                sil
                              </button>
                            )}
                            <button
                              className="text-slate-100 py-1 px-4 rounded-md dark:text-slate-100 bg-blue-600"
                              onClick={() => lockPayment(payment.ID)}
                            >
                              klidlə
                            </button>
                          </td>
                        );
                      } else {
                        return (
                          <td className="px-6 py-4 flex gap-2 justify-end">
                            <button
                              className="text-slate-100 py-1 px-4 rounded-md dark:text-slate-100 bg-blue-600"
                              onClick={() => unlockPayment(payment.ID)}
                            >
                              kilidi aç
                            </button>
                          </td>
                        );
                      }
                    })()}
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p className="text-xl dark:text-white text-center p-8">
            Ödəniş tapılmadı
          </p>
        )}
      </div>
      <EditPaymentModal
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        data={selectedPayment}
      />
    </>
  );
}

export default memo(PaymentsTable);
