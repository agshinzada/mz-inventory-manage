import { memo, useEffect, useRef, useState } from "react";
import ItemsTable from "../components/items/ItemsTable";
import NewItem from "../components/items/NewItem";
import { useDispatch, useSelector } from "react-redux";
import { filterItems, getItems, setSearchedItems } from "../stores/itemsSlice";
import { getTypes } from "../stores/typesSlice";
import { getDepartments } from "../stores/departmentsSlice";
import Select from "react-select";
import { notifyError, notifySuccess } from "../components/tools/Notify";
import Swal from "sweetalert2";
import TableSearch from "../components/tools/TableSearch";
import TitleBox from "../components/tools/TitleBox";
import TypesModal from "../components/modals/TypesModal";
import DepartmentsModal from "../components/modals/DepartmentsModal";
import {
  changeItemStatus,
  getItemsByDateRange,
  getItemsBySearch,
} from "../services/itemService";

function ItemsPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.items);
  const { types } = useSelector((state) => state.types);
  const { departments } = useSelector((state) => state.departments);
  const { token } = useSelector((state) => state.auth);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOldItem, setSelectedOldItem] = useState(null);
  const [isOpenTypes, setIsOpenTypes] = useState(false);
  const [isOpenDepartments, setIsOpenDepartments] = useState(false);

  const [itemId, setItemId] = useState(null);
  const [typeId, setTypeId] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const refDep = useRef();
  const refType = useRef();
  const refCode = useRef();
  const refOldCode = useRef();

  const searchItem = async (e) => {
    try {
      const data = await getItemsBySearch(e.target.value);
      dispatch(setSearchedItems(data));
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const filterItem = async () => {
    try {
      if (!typeId || !departmentId) {
        notifyError("Xanaları doldurun!");
      } else {
        const data = await getItemsByDateRange(typeId, departmentId);
        dispatch(filterItems(data));
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const deactiveItem = () => {
    try {
      if (token.ROLE === "ADMIN") {
        if (itemId) {
          Swal.fire({
            title: "Deaktiv",
            text: `'${selectedItem.CODE}' kodlu cihazın statusu dəyişəcək`,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK",
            cancelButtonText: "İmtina",
          }).then(async (result) => {
            if (result.isConfirmed) {
              await changeItemStatus(itemId);
              notifySuccess("Cihaz deaktiv olundu!");
              dispatch(getItems());
              clearInputs();
            }
          });
        } else {
          notifyError("Cihaz seçilməyib!");
        }
        dispatch(getItems());
      } else {
        notifyError("Yetkiniz yoxdur!");
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const clearInputs = () => {
    try {
      setSelectedItem(null);
      setItemId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDepartment = async (e) => {
    setDepartmentId(e.target.value);
  };

  const handleType = async (e) => {
    setTypeId(e.target.value);
  };

  const clearFilterInputs = () => {
    refDep.current.value = "DEFAULT";
    refType.current.value = "DEFAULT";
    setTypeId(null);
    setDepartmentId(null);
    dispatch(getItems());
  };

  const handleCode = (e) => {
    try {
      setItemId(e.ID);
      setSelectedItem(items.find((item) => item.ID === e.ID));
    } catch (error) {
      console.log(error);
    }
  };

  async function handleOldCode(e) {
    try {
      setSelectedOldItem(items.find((item) => item.ID === e.ID));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    try {
      dispatch(getItems());
      dispatch(getTypes());
      dispatch(getDepartments());
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      <div className="flex gap-5 dekstop:mb-14 mobile:mb-7 desktop:flex-row mobile:flex-col">
        <TitleBox title="cihazlar" />
        <div className="flex gap-4 w-full desktop:flex-row mobile:flex-col">
          <NewItem />
          <div className="flex flex-col gap-2 bg-white p-4 desktop:w-96 mobile:w-full rounded-md shadow-md dark:bg-gray-800 desktop:text-sm mobile:text-xs">
            <label className="dark:text-white">Cihaz statusu dəyiş</label>

            <Select
              placeholder="Cihazlar"
              options={items}
              getOptionLabel={(option) => option.CODE}
              getOptionValue={(option) => option.ID}
              className="w-full"
              onChange={handleCode}
              ref={refCode}
            />
            <input
              className="bg-transparent border border-gray-300 text-gray-900 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 mobile:w-full"
              disabled
              type={"text"}
              value={
                selectedItem
                  ? `${selectedItem.NAME} - ${selectedItem.OLD_CODE}`
                  : ""
              }
            />
            <button
              type="submit"
              className="text-white mb-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg py-2 px-6 w-full"
              onClick={deactiveItem}
            >
              Deaktiv et
            </button>
            <hr />
            <div className="mt-4 flex flex-col gap-2">
              <label className="dark:text-white">Yeni kodu göstər</label>
              <Select
                placeholder="Cihazlar"
                options={items}
                getOptionLabel={(option) => option.OLD_CODE}
                getOptionValue={(option) => option.ID}
                className="w-full"
                onChange={handleOldCode}
                ref={refOldCode}
              />
              <input
                className="bg-transparent border border-gray-300 text-gray-900 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 mobile:w-full"
                disabled
                type={"text"}
                value={
                  selectedOldItem
                    ? `${selectedOldItem.NAME} - ${selectedOldItem.CODE}`
                    : ""
                }
              />
            </div>
          </div>

          <div className="flex desktop:flex-col mobile:flex-row mobile:flex-wrap desktop:text-sm mobile:text-xs gap-2">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg  py-2 px-6 w-fit h-fit"
              onClick={() => setIsOpenTypes(true)}
            >
              Cihaz tipləri
            </button>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg  py-2 px-6 w-fit h-fit"
              onClick={() => setIsOpenDepartments(true)}
            >
              Departamentlər
            </button>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg  py-2 px-6 w-fit h-fit"
            >
              Regionlar
            </button>
          </div>
        </div>
      </div>
      <div className="flex desktop:flex-row mobile:flex-col desktop:text-sm mobile:text-xs gap-3 desktop:mb-8 mobile:mb-4">
        <TableSearch searchDevice={searchItem} placeholder={"Kod və ya ad"} />
        <div className="flex desktop:gap-3 mobile:gap-2 desktop:w-fit mobile:w-full desktop:flex-row mobile:flex-col">
          <select
            className=" bg-white dark:bg-gray-800 border border-gray-300 dark:border-none outline-none text-gray-900 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-fit p-2 mobile:w-full"
            required
            onChange={handleDepartment}
            defaultValue={"DEFAULT"}
            ref={refDep}
          >
            <option disabled value="DEFAULT">
              Bölmə
            </option>
            {departments &&
              departments.map((department) => (
                <option key={department.ID} value={department.ID}>
                  {department.NAME}
                </option>
              ))}
          </select>
          <select
            className=" bg-white dark:bg-gray-800 border border-gray-300 dark:border-none outline-none text-gray-900 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-fit p-2 mobile:w-full"
            required
            onChange={handleType}
            defaultValue={"DEFAULT"}
            ref={refType}
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
          <button
            type="submit"
            className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg py-2 px-6 desktop:w-fit mobile:w-full"
            onClick={filterItem}
          >
            Axtar
          </button>
          <button
            type="submit"
            className=" text-white bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg py-2 px-6 desktop:w-fit mobile:w-full"
            onClick={clearFilterInputs}
          >
            Təmizlə
          </button>
        </div>
      </div>
      <ItemsTable />

      <TypesModal isOpen={isOpenTypes} setIsOpen={setIsOpenTypes} />
      <DepartmentsModal
        isOpen={isOpenDepartments}
        setIsOpen={setIsOpenDepartments}
      />
    </div>
  );
}

export default memo(ItemsPage);
