import ReplTable from "../components/replacements/ReplTable";
import NewRepl from "../components/replacements/NewRepl";
import { memo, useEffect, useRef, useState } from "react";

import { useDispatch } from "react-redux";
import { getDepartments } from "../stores/departmentsSlice";
import {
  getReplacements,
  setSearchedReplacements,
} from "../stores/replacementsSlice";
import { notifyError } from "../components/tools/Notify";
import TableSearch from "../components/tools/TableSearch";
import TitleBox from "../components/tools/TitleBox";
import {
  getReplacementsByDateRange,
  getReplacementsBySearch,
} from "../services/replacementsService";

function ReplacementPage() {
  const dispatch = useDispatch();
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const refFromDate = useRef();
  const refToDate = useRef();

  const handleReplacement = async (e) => {
    try {
      const data = await getReplacementsBySearch(e.target.value);
      dispatch(setSearchedReplacements(data));
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const filterReplacements = async () => {
    try {
      if (dateFrom && dateTo) {
        const data = await getReplacementsByDateRange(dateFrom, dateTo);
        dispatch(setSearchedReplacements(data));
      } else {
        notifyError("Xanaları doldurun!");
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const clearFilter = () => {
    refFromDate.current.value = "";
    refToDate.current.value = "";
    setDateFrom(null);
    setDateTo(null);
    dispatch(getReplacements());
  };

  useEffect(() => {
    try {
      dispatch(getDepartments());
      dispatch(getReplacements());
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <TitleBox title="yerdəyişmələr" />
      <NewRepl />
      <div>
        <div className="flex gap-4 desktop:flex-row mobile:flex-col desktop:text-sm mobile:text-xs mb-4">
          <TableSearch
            searchDevice={handleReplacement}
            placeholder={"Ref və ya kod"}
          />
          <div className="flex gap-2 desktop:w-fit mobile:w-full desktop:flex-row mobile:flex-col">
            <input
              className=" bg-white border border-gray-300 dark:border-gray-500 dark:text-slate-300 dark:bg-gray-800 text-gray-900  rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-fit p-2 mobile:w-full"
              required
              type={"date"}
              onChange={(e) => setDateFrom(e.target.value)}
              ref={refFromDate}
            />
            <span className="self-center dark:text-slate-100 mobile:hidden desktop:block">
              to
            </span>
            <input
              className=" bg-white border border-gray-300 dark:border-gray-500 dark:text-slate-300 dark:bg-gray-800 text-gray-900  rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-fit p-2 mobile:w-full"
              required
              type={"date"}
              ref={refToDate}
              onChange={(e) => setDateTo(e.target.value)}
            />
            <button
              type="submit"
              className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg  px-4 py-2 desktop:w-fit mobile:w-full"
              onClick={filterReplacements}
            >
              axtar
            </button>
            <button
              type="submit"
              className=" text-white bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-4 py-2 desktop:w-fit mobile:w-full"
              onClick={clearFilter}
            >
              təmizlə
            </button>
          </div>
        </div>
        <ReplTable />
      </div>
    </div>
  );
}

export default memo(ReplacementPage);
