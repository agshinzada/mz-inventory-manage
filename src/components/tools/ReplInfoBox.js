import { memo } from "react";

function ReplInfoBox({ data }) {
  return (
    <div className="shadow-md rounded-md h-fit max-h-[500px] overflow-y-auto relative desktop:w-fit mobile:w-[23rem]">
      <div className="p-5 text-md mobile:text-sm font-semibold text-left text-gray-900 dark:text-gray-300 bg-white dark:bg-gray-800 ">
        YERDƏYİŞMƏLƏR
      </div>
      <div className="overflow-y-auto">
        <table className="w-full desktop:text-sm mobile:text-xs text-left text-gray-500 dark:text-slate-300">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-slate-300">
            <tr>
              <th scope="col" className="py-3 px-6">
                KOD
              </th>
              <th scope="col" className="py-3 px-6">
                HARADAN
              </th>
              <th scope="col" className="py-3 px-6">
                HARAYA
              </th>
              <th scope="col" className="py-3 px-6">
                TARIX
              </th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.slice(0, 5).map((repl) => (
                <tr
                  className="bg-white border-b dark:border-b-slate-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800"
                  key={repl.ID}
                >
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 dark:text-slate-300 whitespace-nowrap"
                  >
                    {repl.CODE}
                  </th>
                  <td className="py-4 px-6">{repl.FROM}</td>
                  <td className="py-4 px-6">{repl.PLACED}</td>
                  <td className="py-4 px-6">
                    {new Date(repl.DATE).toLocaleDateString("az")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(ReplInfoBox);
