function AmountBox({ title, data }) {
  return (
    <div className="flex flex-col gap-4 w-fit">
      <div className="shadow-md rounded-lg h-fit w-full">
        <div className="p-5 desktop:text-md mobile:text-xs font-semibold text-left text-gray-900 dark:text-slate-400 bg-white dark:bg-gray-800 w-full ">
          {title && title.toLocaleUpperCase("az")}
          <div className="flex justify-between">
            <p className="mt-1 text-2xl mobile:text-md font-normal text-gray-500 dark:text-slate-100 ">
              {data && data.TOTAL}{" "}
              <small className="desktop:text-sm mobile:text-xs">AZN</small>
            </p>
            <span class="h-fit mt-2 bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
              {data && data.STATUS === 0 ? "Gözlənilir" : "Təsdiqlənib"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AmountBox;
