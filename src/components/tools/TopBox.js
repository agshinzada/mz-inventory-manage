import { memo } from "react";

function TopBox({ title, data }) {
  return (
    <div className="flex flex-col gap-4 w-fit relative">
      <div className="shadow-md rounded-lg h-fit w-full">
        <div className="p-5 desktop:text-lg mobile:text-xs font-semibold text-left text-gray-900 dark:text-slate-400 bg-white dark:bg-gray-800 w-full ">
          <p className="mb-4">{title}</p>
          <ul className="flex flex-col gap-3">
            {data.map((element) => (
              <li key={element.id}>
                <div className="desktop:text-xl mobile:text-md font-normal text-gray-500 dark:text-slate-100 flex items-center justify-between gap-16">
                  <span>
                    {element.id}. {element.name}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    {element.amount} azn
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default memo(TopBox);
