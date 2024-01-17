import { memo, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { notifyError, notifySuccess } from "../tools/Notify";
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "../../stores/itemsSlice";
import { getReplacements } from "../../stores/replacementsSlice";
import { postNewReplacement } from "../../services/replacementsService";
import { getDepartments } from "../../stores/departmentsSlice";

function NewRepl() {
  const [id, setId] = useState(null);
  const [selectedItem, setSelectedItem] = useState({});
  const [fromId, setFromId] = useState(null);
  const [fromName, setFromName] = useState("");
  const [toId, setToId] = useState(null);
  const [date, setDate] = useState(null);

  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.items);
  const { departments } = useSelector((state) => state.departments);
  const { token } = useSelector((state) => state.auth);

  const refFrom = useRef();
  const refTo = useRef();
  const refDate = useRef();

  async function sendReplacement() {
    const data = {
      itemId: id,
      fromId,
      toId,
      date,
      userId: token.ID,
    };
    try {
      if (id && fromId && toId && date) {
        await postNewReplacement(data);
        notifySuccess("Yerdəyişmə uğurla əlavə edildi.");
        resetInputs();
        dispatch(getReplacements());
        dispatch(getItems());
      } else {
        notifyError("Xanaları doldurun!");
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  }

  function handleCode(e) {
    try {
      setSelectedItem(e);
      setFromId(e.DEPARTMENT_ID);
      setFromName(e.DEPARTMENT);
      setId(e.ID);
    } catch (error) {
      console.log(error);
    }
  }

  function handleDate(e) {
    const date = `${e.target.value} ${new Date().toLocaleTimeString("az")}`;
    setDate(date);
  }

  function handleTo(e) {
    setToId(e.target[e.target.options.selectedIndex].value);
  }

  function resetInputs() {
    refFrom.current.value = "";
    refTo.current.value = "DEFAULT";
    refDate.current.value = "";
    setSelectedItem({});
    setId(null);
    setFromId(null);
    setToId(null);
    setDate(null);
  }

  useEffect(() => {
    dispatch(getItems());
    dispatch(getDepartments());
  }, []);

  return (
    <div className="flex flex-col gap-2 desktop:w-fit mobile:w-full desktop:text-sm mobile:text-xs p-4 bg-white dark:bg-gray-800 shadow-md rounded-md h-fit">
      <p className="font-bold text-xs  dark:text-slate-100">YENİ YERDƏYİŞMƏ</p>
      <div className="flex gap-2">
        {" "}
        <Select
          placeholder="Cihazlar"
          options={items}
          getOptionLabel={(option) => option.CODE}
          getOptionValue={(option) => option.ID}
          className="w-full"
          onChange={handleCode}
        />
      </div>
      <div className="flex flex-col gap-2">
        <input
          className="bg-transparent border border-gray-300 dark:bg-gray-700 dark:text-slate-300 dark:border-gray-500 text-gray-900  rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 mobile:w-full"
          disabled
          type={"text"}
          value={selectedItem?.NAME ?? ""}
        />
        <div className="flex gap-2 mobile:w-full">
          <input
            className="bg-transparent border border-gray-300 dark:bg-gray-700 dark:text-slate-300 dark:border-gray-500 text-gray-900  rounded-md focus:ring-blue-500 focus:border-blue-500 block w-fit p-2 mobile:w-full"
            disabled
            type={"text"}
            placeholder="Haradan"
            value={fromName}
            ref={refFrom}
          />

          <select
            className="bg-transparent border border-gray-300 dark:bg-gray-700 dark:text-slate-300 dark:border-gray-500 text-gray-900  rounded-md focus:ring-blue-500 focus:border-blue-500 block w-fit p-2 mobile:w-full"
            onChange={handleTo}
            ref={refTo}
            defaultValue={"DEFAULT"}
          >
            <option disabled value={"DEFAULT"}>
              Haraya
            </option>
            {departments &&
              departments.map((department) => (
                <option key={department.ID} value={department.ID}>
                  {department.NAME}
                </option>
              ))}
          </select>
        </div>
      </div>
      <input
        type="date"
        id="default-input"
        placeholder="Tarix"
        className="bg-transparent border border-gray-300 dark:bg-gray-700 dark:text-slate-300 dark:border-gray-500 text-gray-900  rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
        onChange={handleDate}
        required
        ref={refDate}
      />

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg  py-2 px-6 desktop:w-fit self-end mobile:w-full"
        onClick={sendReplacement}
      >
        Əlavə et
      </button>
    </div>
  );
}

export default memo(NewRepl);
