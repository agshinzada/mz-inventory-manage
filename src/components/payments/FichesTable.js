import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditFicheModal from "../modals/EditFicheModal";
import { notifyError, notifySuccess } from "../tools/Notify";
import { getFiches, getPayments } from "../../stores/paymentsSlice";
import Swal from "sweetalert2";
import {
  changeFicheLockStatus,
  getPaymentsByFicheId,
  removeFiche,
} from "../../services/paymentsService";

function FichesTable({ fiches }) {
  const { token } = useSelector((state) => state.auth);
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [selectedFiche, setSelectedFiche] = useState(null);
  const dispatch = useDispatch();

  const openEditModal = async (fiche) => {
    try {
      const data = await getPaymentsByFicheId(fiche.ID);
      setPayments(data);
      setSelectedFiche(fiche);
      setEditIsOpen(true);
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const unlockFiche = async (id) => {
    try {
      Swal.fire({
        text: `Faktura və bağlı ödənişlərin klidi açılacaq`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
        cancelButtonText: "İmtina",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await changeFicheLockStatus(0, id);
          notifySuccess("Klid açıldı!");
          dispatch(getFiches());
          dispatch(getPayments());
        }
      });
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const lockFiche = async (id) => {
    try {
      Swal.fire({
        text: `Faktura və bağlı ödənişlər klidlənəcək`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
        cancelButtonText: "İmtina",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await changeFicheLockStatus(1, id);
          notifySuccess("Klidləndi!");
          dispatch(getFiches());
          dispatch(getPayments());
        }
      });
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const handleFiche = async (id) => {
    try {
      Swal.fire({
        title: "Silinmə",
        text: `Faktura və ödənişlər silinəcək`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
        cancelButtonText: "İmtina",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await removeFiche(id);
          notifySuccess("Uğurla silindi!");
          dispatch(getFiches());
          dispatch(getPayments());
        }
      });
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="relative overflow-x-auto sm:rounded-lg w-full max-h-screen">
          {fiches && fiches.length > 0 ? (
            <table className="w-full shadow-md text-center mobile:text-xs desktop:text-sm text-gray-500 dark:text-slate-300 rounded-l">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-slate-300">
                <tr>
                  <th scope="col" className="px-6 py-3"></th>
                  <th scope="col" className="px-6 py-3">
                    NÖMRƏ
                  </th>
                  <th scope="col" className="px-6 py-3">
                    AD
                  </th>
                  <th scope="col" className="px-6 py-3">
                    qiymət
                  </th>
                  <th scope="col" className="px-6 py-3">
                    yaradılma tarİXİ
                  </th>
                  <th scope="col" className="px-6 py-3">
                    TƏSDİQ tarİXİ
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {fiches &&
                  fiches.map((fiche) => (
                    <tr
                      key={fiche.ID}
                      className="bg-white border-b dark:border-b-slate-600 dark:hover:bg-gray-700 hover:bg-gray-50 dark:bg-gray-800"
                    >
                      <td className="px-6 py-4">
                        {fiche.LOCK_STATUS === 1 && (
                          <img
                            src="svg/lock-status.svg"
                            alt="lock-img"
                            className="w-5 mx-auto shadow-sm"
                          />
                        )}
                      </td>

                      <th
                        scope="row"
                        className="px-6 py-4 font-bold text-black dark:text-slate-300"
                      >
                        {fiche.CODE}
                      </th>
                      <td className="px-6 py-4">{fiche.NAME}</td>
                      <td className="px-6 py-4">{fiche.TOTAL}</td>
                      <td className="px-6 py-4">
                        {new Date(fiche.DATE).toLocaleDateString("az")}
                      </td>
                      <td className="px-6 py-4">
                        {fiche.PAY_DATE === null
                          ? ""
                          : new Date(fiche.PAY_DATE).toLocaleDateString("az")}
                      </td>
                      <td className="px-6 py-4">
                        {fiche.STATUS === 0 ? (
                          <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md dark:bg-red-900 dark:text-red-300">
                            Gözlənilir
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md dark:bg-green-900 dark:text-green-300">
                            Təsdilənib
                          </span>
                        )}
                      </td>
                      {(() => {
                        if (fiche.LOCK_STATUS === 0) {
                          return (
                            <td className="px-6 py-4 flex gap-2 justify-end">
                              <button
                                className="text-slate-100 py-1 px-4 rounded-md dark:text-slate-100 bg-blue-600"
                                onClick={() => openEditModal(fiche)}
                              >
                                düzəliş
                              </button>

                              {token.ROLE === "ADMIN" && (
                                <button
                                  className="font-bold  dark:text-slate-300 text-slate-100 bg-red-600 py-1 px-4 rounded-md"
                                  onClick={() => handleFiche(fiche.ID)}
                                >
                                  sil
                                </button>
                              )}
                              <button
                                className="text-slate-100 py-1 px-4 rounded-md dark:text-slate-100 bg-blue-600"
                                onClick={() => lockFiche(fiche.ID)}
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
                                onClick={() => unlockFiche(fiche.ID)}
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
              Faktura tapılmadı
            </p>
          )}
        </div>
      </div>
      <EditFicheModal
        isOpen={editIsOpen}
        setIsOpen={setEditIsOpen}
        data={payments}
        setData={setPayments}
        fiche={selectedFiche}
      />
    </>
  );
}

export default memo(FichesTable);
