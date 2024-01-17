import { memo } from "react";

function ItemInfoBox({ title, data }) {
  return (
    <div className="shadow-md rounded-md h-fit max-h-[500px] overflow-y-auto relative desktop:w-fit mobile:w-full">
      <div className="p-5 text-md mobile:text-sm font-semibold text-left text-gray-900 dark:text-gray-300 bg-white dark:bg-gray-800 ">
        {title.toLocaleUpperCase("az")}
        <p className="mt-1 text-sm mobile:text-lg font-normal text-gray-500 dark:text-gray-100">
          {data.length > 0 && data.length}
        </p>
      </div>
      <div className="overflow-y-auto">
        <table className="w-full desktop:text-sm mobile:text-xs text-left text-gray-500 dark:text-slate-300">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-slate-300">
            <tr>
              <th scope="col" className="py-3 px-6">
                KOD
              </th>
              <th scope="col" className="py-3 px-6">
                AD
              </th>
              <th scope="col" className="py-3 px-6">
                TİP
              </th>
            </tr>
          </thead>
          <tbody className="desktop:text-sm mobile:text-xs ">
            {data.length > 0 &&
              data.map((item) => (
                <tr
                  className="bg-white border-b dark:border-b-slate-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800"
                  key={item.ID}
                >
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 dark:text-slate-300 whitespace-nowrap "
                  >
                    {item.CODE}
                  </th>
                  <td className="py-4 px-6">{item.NAME}</td>
                  <td className="py-4 px-6">{item.TYPE}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(ItemInfoBox);
