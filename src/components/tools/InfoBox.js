import { memo } from "react";

function InfoBox({ title, data }) {
  return (
    <div className="flex flex-col gap-4 w-fit relative">
      <div className="shadow-md rounded-lg h-fit w-full">
        <div className="p-5 desktop:text-md mobile:text-xs font-semibold text-left text-gray-900 dark:text-slate-400 bg-white dark:bg-gray-800 w-full ">
          {title && title.toLocaleUpperCase("az")}
          <p className="mt-1 text-2xl mobile:text-md font-normal text-gray-500 dark:text-slate-100 ">
            {data && data.length}{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(InfoBox);
