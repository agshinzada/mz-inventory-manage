import { memo, useState } from "react";
import { notifyError, notifySuccess } from "../tools/Notify";

import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { getReplacements } from "../../stores/replacementsSlice";
import EditReplacementModal from "../modals/EditReplacementModal";
import { removeReplacement } from "../../services/replacementsService";

function ReplTable() {
  const dispatch = useDispatch();
  const { replacements } = useSelector((state) => state.replacements);
  const { token } = useSelector((state) => state.auth);
  let [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState([]);

  const handleReplacement = async (repl) => {
    try {
      Swal.fire({
        title: "Silinmə",
        text: `'${repl.CODE}' kodlu cihazın yerdəyişməsi silinəcək`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sil",
        cancelButtonText: "İmtina",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await removeReplacement(repl.ID);
          notifySuccess(`Yerdəyişmə uğurla silindi.`);
          dispatch(getReplacements());
        }
      });
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg w-full max-h-screen">
      <div className="relative overflow-x-auto sm:rounded-lg w-full">
        <table className="w-full desktop:text-sm mobile:text-xs text-left text-gray-500 rounded-l">
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
                HARADAN
              </th>
              <th scope="col" className="px-6 py-3">
                HARAYA
              </th>
              <th scope="col" className="px-6 py-3">
                TARİX
              </th>

              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {replacements.map((replacement) => (
              <tr
                key={replacement.ID}
                className="bg-white dark:bg-gray-800 dark:text-slate-300 border-b dark:border-b-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4">{replacement.ID}</td>

                <th
                  scope="row"
                  className="px-6 py-4 font-bold text-gray-900 dark:text-slate-300"
                >
                  {replacement.CODE}
                </th>
                <td className="px-6 py-4">{replacement.NAME}</td>
                <td className="px-6 py-4">{replacement.FROM}</td>
                <td className="px-6 py-4">{replacement.PLACED}</td>
                <td className="px-6 py-4">
                  {new Date(replacement.DATE).toLocaleDateString("az")}
                </td>

                <td className="px-6 py-4 float-right">
                  <button
                    className="text-slate-100 py-1 px-4 mr-4 rounded-md dark:text-slate-100 bg-blue-600"
                    onClick={() => {
                      setCurrentItem(replacement);
                      setIsOpen(true);
                    }}
                  >
                    Düzəliş
                  </button>
                  {token.ROLE === "ADMIN" && (
                    <button
                      className="font-bold text-red-300"
                      onClick={() => handleReplacement(replacement)}
                    >
                      Sil
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EditReplacementModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        currentItem={currentItem}
      />
    </div>
  );
}

export default memo(ReplTable);
