import { memo, useState } from "react";
import { useSelector } from "react-redux";
import EditItemModal from "../modals/EditItemModal";

function ItemsTable() {
  const { items } = useSelector((state) => state.items);
  const { token } = useSelector((state) => state.auth);
  let [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState([]);

  return (
    <div className="w-full flex flex-col gap-4 max-h-screen">
      <div className="relative overflow-x-auto sm:rounded-lg w-full shadow-md">
        <table className="w-full mobile:text-xs desktop:text-sm text-left text-gray-500 dark:text-slate-300 rounded-l animate__animated animate__fadeIn">
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
              <th scope="col" className="px-6 py-3">
                Lokasiya
              </th>
              {token.ROLE === "ADMIN" && (
                <th scope="col" className="px-6 py-3 w-28"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {items &&
              items.map((item) => (
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
                  <td className="px-6 py-4">{item.LOCATION}</td>
                  {token.ROLE === "ADMIN" && (
                    <td className="px-6 py-4 ">
                      <button
                        className="text-slate-100 py-1 px-4 rounded-md dark:text-slate-100 bg-blue-600"
                        onClick={() => {
                          setCurrentItem(item);
                          setIsOpen(true);
                        }}
                      >
                        Düzəliş
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <EditItemModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        currentItem={currentItem}
      />
    </div>
  );
}

export default memo(ItemsTable);
