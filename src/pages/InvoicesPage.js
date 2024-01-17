import NewInvoice from "../components/invoices/NewInvoice";
import InvoiceTable from "../components/invoices/InvoiceTable";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInvoices, setSearchedInvoices } from "../stores/invoicesSlice";
import axios from "axios";
import { urlRoot } from "..";
import { notifyError } from "../components/tools/Notify";
import TableSearch from "../components/tools/TableSearch";
import TitleBox from "../components/tools/TitleBox";

function InvoicesPage() {
  const dispatch = useDispatch();
  const { invoices } = useSelector((state) => state.invoices);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const refFromDate = useRef();
  const refToDate = useRef();

  const searchInvoice = async (e) => {
    try {
      const res = await axios.get(
        `${urlRoot}/items/invoices/search?q=${e.target.value}`
      );
      if (res.status === 200 && res.statusText === "OK") {
        dispatch(setSearchedInvoices(res.data));
      } else {
        notifyError(`Xəta: ${res.statusText}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRange = async () => {
    try {
      if (dateFrom && dateTo) {
        const res = await axios.get(
          `${urlRoot}/items/invoices/filter?f=${dateFrom}&&t=${dateTo}`
        );
        if (res.status === 200 && res.statusText === "OK") {
          dispatch(setSearchedInvoices(res.data));
        } else {
          notifyError(`Xəta: ${res.statusText}`);
        }
      } else {
        notifyError("Fields are required");
      }
    } catch (error) {
      notifyError(`Xəta: ${error.message}`);

      console.log(error);
    }
  };

  const clearFilter = () => {
    refFromDate.current.value = "";
    refToDate.current.value = "";
    setDateFrom(null);
    setDateTo(null);
    dispatch(getInvoices());
  };

  useEffect(() => {
    dispatch(getInvoices());
  }, []);

  return (
    <div className="flex flex-col gap-8 desktop:text-sm mobile:text-xs">
      <TitleBox title="qaimələr" />
      <NewInvoice />
      <div>
        <div className="flex gap-4 desktop:flex-row mobile:flex-col mb-4">
          <TableSearch
            searchDevice={searchInvoice}
            placeholder={"Ref və ya kod"}
          />
          <div className="flex items-center gap-3 desktop:flex-row mobile:flex-col desktop:w-fit mobile:w-full">
            <div className="flex items-center gap-2">
              <input
                type="date"
                id="default-input"
                placeholder="Tarix"
                onChange={(e) => setDateFrom(e.target.value)}
                ref={refFromDate}
                className="bg-transparent border border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-500 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
              />
              <span className="desktop:block mobile:hidden dark:text-slate-100">
                to
              </span>
              <input
                type="date"
                id="default-input"
                placeholder="Tarix"
                onChange={(e) => setDateTo(e.target.value)}
                ref={refToDate}
                className="bg-transparent border border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-500 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
              />
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg py-2 px-6 w-full"
              onClick={handleRange}
            >
              axtar
            </button>
            <button
              type="submit"
              className="text-white bg-gray-600 hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg py-2 px-6 w-full"
              onClick={clearFilter}
            >
              təmizlə
            </button>
          </div>
        </div>
        <InvoiceTable invoices={invoices} edit={true} />
      </div>
    </div>
  );
}

export default memo(InvoicesPage);
