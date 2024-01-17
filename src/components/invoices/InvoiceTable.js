import { memo, useState } from "react";
import { notifyError, notifySuccess } from "../tools/Notify";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getInvoices } from "../../stores/invoicesSlice";
import EditInvoiceModal from "../modals/EditInvoiceModal";
import { removeInvoice } from "../../services/invoicesService";

function InvoiceTable({ invoices, edit }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  let [isOpen, setIsOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState([]);

  const handleInvoice = async (invoice) => {
    try {
      Swal.fire({
        title: "Silinmə",
        text: `'${invoice.CODE}' kodlu cihazın qaiməsi silinəcək`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sil",
        cancelButtonText: "İmtina",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await removeInvoice(invoice.ID);
          notifySuccess(`Qaimə uğurla silindi.`);
          dispatch(getInvoices());
        }
      });
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  return (
    <div>
      <div className="relative overflow-x-auto sm:rounded-lg w-full rounded-md shadow-md max-h-screen">
        <table className="w-full desktop:text-sm mobile:text-xs text-left text-gray-500 rounded-l shadow-md ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-slate-100">
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
                TARİX
              </th>
              <th scope="col" className="px-6 py-3">
                DOCCODE
              </th>
              <th scope="col" className="px-6 py-3">
                AÇIQLAMA
              </th>
              {edit && <th scope="col" className="px-6 py-3 w-28"></th>}
            </tr>
          </thead>
          <tbody className=" bg-white dark:bg-gray-800 dark:text-slate-300">
            {invoices &&
              invoices.map((invoice) => (
                <tr
                  key={invoice.ID}
                  className=" border-b dark:border-b-gray-500  hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 ">{invoice.ID}</td>

                  <th
                    scope="row"
                    className="px-6 py-4 font-bold text-gray-900 dark:text-slate-300 whitespace-nowrap"
                  >
                    {invoice.CODE}
                  </th>
                  <td className="px-6 py-4 ">{invoice.NAME}</td>
                  <td className="px-6 py-4">
                    {new Date(invoice.DATE).toLocaleDateString("az")}
                  </td>
                  <td className="px-6 py-4">{invoice.DOCCODE}</td>
                  <td className="px-6 py-4">{invoice.EXPLANATION}</td>
                  {edit && (
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        className="text-slate-100 py-1 px-4 rounded-md dark:text-slate-100 bg-blue-600"
                        onClick={() => {
                          setCurrentInvoice(invoice);
                          setIsOpen(true);
                        }}
                      >
                        düzəliş
                      </button>
                      {token.ROLE === "ADMIN" && edit && (
                        <button
                          className="font-bold dark:text-red-300 text-red-500"
                          onClick={() => handleInvoice(invoice)}
                        >
                          sil
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <EditInvoiceModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        currentItem={currentInvoice}
      />
    </div>
  );
}

export default memo(InvoiceTable);
