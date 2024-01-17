import { memo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { notifyError, notifySuccess } from "../tools/Notify";
import { getItemLastCode, postNewItem } from "../../services/itemService";

function NewItem() {
  const { types } = useSelector((state) => state.types);
  const { token } = useSelector((state) => state.auth);

  const [code, setCode] = useState(null);
  const [name, setName] = useState(null);
  const [typeId, setTypeId] = useState(null);
  const [depId, setDepId] = useState(null);
  const [locationId, setLocationId] = useState(null);

  const refStatus = useRef();
  const refCode = useRef();
  const refName = useRef();
  const refType = useRef();
  const refLocation = useRef();
  const radio1Ref = useRef();
  const radio2Ref = useRef();

  async function handleStatus(e) {
    try {
      const code = await getItemLastCode(e.target.value);
      setCode(code[0].LAST);
      refCode.current.value = code[0].LAST;
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  }

  async function postDevice() {
    try {
      if (code && name && typeId && locationId && depId) {
        const data = {
          code,
          name,
          typeId,
          depId,
          locationId,
          userId: token.ID,
        };
        await postNewItem(data);
        notifySuccess("Cihaz uğurla əlavə edildi.");
        resetInputs();
      } else {
        notifyError("Xanaları doldurun!");
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  }

  function handleCode(e) {
    setCode(e.target.value.trim());
  }
  function handleName(e) {
    setName(e.target.value.trim());
  }
  function handleType(e) {
    setTypeId(e.target.value);
  }

  function resetInputs() {
    setCode(null);
    setName(null);
    setTypeId(null);
    setLocationId(null);
    setDepId(null);
    refCode.current.value = "";
    refName.current.value = "";
    refType.current.value = "DEFAULT";
    refLocation.current.value = "DEFAULT";
    refStatus.current.value = "DEFAULT";
    radio1Ref.current.checked = false;
    radio2Ref.current.checked = false;
  }

  return (
    <div className="flex flex-col shadow-md h-fit p-4 gap-4 desktop:text-sm mobile:text-xs bg-white dark:bg-gray-800 rounded-md desktop:w-fit mobile:w-full">
      <div className="flex flex-col gap-3 dark:text-slate-100">
        <p className="font-bold text-xs">YENİ CİHAZ</p>
        <div>
          <select
            className="bg-transparent border border-gray-300 dark:bg-gray-700 dark:border-slate-500 text-gray-900 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 mobile:w-full "
            onChange={handleStatus}
            defaultValue={"DEFAULT"}
            ref={refStatus}
          >
            <option disabled value="DEFAULT">
              Status
            </option>
            <option value={"MT"}>Yeni</option>
            <option value={"TG"}>İcarə</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Kod"
            ref={refCode}
            required
            className="bg-transparent border border-gray-300 text-gray-900 dark:border-slate-500 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2"
            onChange={handleCode}
          />
          <input
            type="text"
            placeholder="Ad"
            ref={refName}
            required
            className="bg-transparent border border-gray-300 dark:border-slate-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full mobile:w-full p-2 "
            onChange={handleName}
          />
        </div>
        <div className="flex gap-2 desktop:flex-row mobile:flex-col">
          <select
            className="bg-transparent border border-gray-300 dark:bg-gray-700 dark:border-slate-500 text-gray-900 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 mobile:w-full "
            required
            ref={refType}
            onChange={handleType}
            defaultValue={"DEFAULT"}
          >
            <option disabled value="DEFAULT">
              Tip
            </option>
            {types &&
              types.map((type) => (
                <option key={type.ID} value={type.ID}>
                  {type.NAME}
                </option>
              ))}
          </select>
          <select
            className="bg-transparent border border-gray-300 dark:bg-gray-700 dark:border-slate-500 text-gray-900 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 mobile:w-full "
            required
            name="item_location"
            onChange={(e) => setLocationId(e.target.value)}
            ref={refLocation}
            defaultValue={"DEFAULT"}
          >
            <option disabled value="DEFAULT">
              Lokasiya
            </option>
            <option key={1} value={1}>
              Ofis
            </option>
            <option key={2} value={2}>
              Anbar
            </option>
          </select>
        </div>
        <div className="flex items-center gap-6 border rounded-lg dark:border-slate-700 border-slate-200 p-2">
          <div className="flex items-center">
            <input
              id="default-radio-1"
              type="radio"
              value={13}
              onClick={(e) => setDepId(e.target.value)}
              name="department-radio"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800  dark:bg-gray-700 dark:border-gray-600"
              ref={radio1Ref}
            />
            <label
              htmlFor="default-radio-1"
              className="ml-2 font-medium text-gray-900 dark:text-gray-300"
            >
              Rezerv
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="default-radio-2"
              type="radio"
              value={14}
              onClick={(e) => setDepId(e.target.value)}
              name="department-radio"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              ref={radio2Ref}
            />
            <label
              htmlFor="default-radio-2"
              className="ml-2 font-medium text-gray-900 dark:text-gray-300"
            >
              Servis
            </label>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg py-2 px-6 w-fit self-end  "
        onClick={postDevice}
      >
        Əlavə et
      </button>
    </div>
  );
}

export default memo(NewItem);
