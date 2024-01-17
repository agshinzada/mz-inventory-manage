import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { getInvoices, setDocCodes } from "../../stores/invoicesSlice";
import { getItems } from "../../stores/itemsSlice";
import { notifyError, notifySuccess } from "../tools/Notify";
import {
  getInvoiceDocCodes,
  postNewInvoice,
} from "../../services/invoicesService";
import { postNewReplacement } from "../../services/replacementsService";

function NewService() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.items);
  const { docCodes } = useSelector((state) => state.invoices);
  const { token } = useSelector((state) => state.auth);

  const [selectedItem, setSelectedItem] = useState({});
  const [date, setDate] = useState(null);
  const [docId, setDocId] = useState(null);
  const [locId, setLocId] = useState(null);
  const [exp, setExp] = useState("");
  const [checked, setChecked] = useState(true);

  const refDate = useRef();
  const refDoc = useRef();
  const refExp = useRef();
  const refLocation = useRef();

  const handleDocCodes = async () => {
    try {
      const data = await getInvoiceDocCodes();
      dispatch(setDocCodes(data));
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  async function submitInvoice() {
    try {
      if (selectedItem && date && docId && locId) {
        const data = {
          itemId: selectedItem.ID,
          docId,
          locId,
          date,
          exp,
          userId: token.ID,
        };
        await postNewInvoice(data);
        notifySuccess("Qaimə uğurla əlavə edildi");
        if (checked) {
          if (locId === 1) {
            await postNewReplacement({
              fromId: 19,
              toId: 14,
              date,
              itemId: selectedItem.ID,
              userId: token.ID,
            });
          } else {
            await postNewReplacement({
              fromId: 12,
              toId: 14,
              date,
              itemId: selectedItem.ID,
              userId: token.ID,
            });
          }
          setTimeout(() => {
            notifySuccess("Yerdəyişmə uğurla əlavə edildi");
          }, 1500);
        }
        resetInputs();
        dispatch(getInvoices());
      } else {
        notifyError("Xanaları doldurun!");
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  }

  const handleDate = (e) => {
    const date = `${e.target.value} ${new Date().toLocaleTimeString("az")}`;
    setDate(date);
  };

  const resetInputs = () => {
    refDate.current.value = "";
    refDoc.current.value = "DEFAULT";
    refExp.current.value = "";
    refLocation.current.value = "DEFAULT";
    setSelectedItem({});
    setDate(null);
    setDocId(null);
    setLocId(null);
    setExp("");
  };

  useEffect(() => {
    handleDocCodes();
    dispatch(getItems());
  }, []);

  return (
    <div className="flex flex-col gap-2 desktop:w-fit min-w-[350px]  bg-white dark:bg-gray-800 p-4 rounded-md shadow-md h-fit mobile:w-full desktop:text-sm mobile:text-xs">
      <p className="font-bold text-xs dark:text-slate-100 ">YENİ QAİMƏ</p>
      <div className="flex flex-col gap-2">
        <Select
          placeholder="Cihazlar"
          options={items}
          getOptionLabel={(option) => option.CODE}
          getOptionValue={(option) => option.ID}
          className="w-full"
          onChange={(e) => setSelectedItem(e)}
        />
        <input
          type="text"
          id="default-input"
          disabled
          value={selectedItem?.NAME ?? ""}
          className="bg-transparent border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-500 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
        />
      </div>
      <div className="flex gap-1">
        <input
          type="date"
          id="default-input"
          placeholder="Tarix"
          className="bg-transparent border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-500 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 "
          onChange={handleDate}
          ref={refDate}
        />
        <select
          className="bg-transparent border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-500 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 mobile:w-full "
          required
          defaultValue={"DEFAULT"}
          onChange={(e) => setDocId(e.target.value)}
          ref={refDoc}
        >
          <option disabled value="DEFAULT">
            Qaimə tipi
          </option>
          {docCodes.map((doc) => (
            <option key={doc.ID} value={doc.ID}>
              {doc.NAME}
            </option>
          ))}
        </select>
      </div>
      <select
        className="bg-transparent border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-500 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 mobile:w-full "
        required
        defaultValue={"DEFAULT"}
        onChange={(e) => setLocId(parseInt(e.target.value))}
        ref={refLocation}
      >
        <option disabled value="DEFAULT">
          Lokasiya
        </option>
        <option key={1} value={1}>
          OFİS
        </option>
        <option key={2} value={2}>
          ANBAR
        </option>
      </select>
      <input
        type="text"
        placeholder="Açıqlama"
        className="bg-transparent border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-500 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
        onChange={(e) => setExp(e.target.value)}
        ref={refExp}
      />
      <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
        <input
          id="bordered-checkbox-2"
          defaultChecked={checked}
          type="checkbox"
          onChange={(e) => setChecked(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="bordered-checkbox-2"
          className="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Yerdəyişmə
        </label>
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg py-2 px-6 w-fit self-end  "
        onClick={submitInvoice}
      >
        Əlavə et
      </button>
    </div>
  );
}

export default memo(NewService);
