import readXlsxFile from "read-excel-file";
import { memo, useState } from "react";
import axios from "axios";
import { notifyError, notifySuccess } from "../components/tools/Notify";
import TitleBox from "../components/tools/TitleBox";

function MazarinaPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputList, setInputList] = useState([]);
  const [targets, setTargets] = useState([]);
  const schema = {
    rut: {
      prop: "code",
      type: Number,
    },
    id: {
      prop: "id",
      type: Number,
    },
    began: {
      prop: "began_date",
      type: Date,
    },
    end: {
      prop: "end_date",
      type: Date,
    },
    vaxt: {
      prop: "vaxt",
      type: Number,
    },
    temiz: {
      prop: "temiz",
      type: Number,
    },
    bozuk: {
      prop: "bozuk",
      type: Number,
    },
  };

  const readExcel = () => {
    readXlsxFile(selectedFile, { schema }).then((rows) => {
      setInputList(rows.rows);
    });
  };

  const getTargets = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/targets`
    );
    setTargets(res.data);
  };
  const clearInputs = () => {
    setInputList([]);
  };
  const clearTargets = () => {
    setTargets([]);
  };

  const sendTargets = async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_URL_API_ROOT}/targets`,
      inputList
    );
    if (res.status === 200 && res.statusText === "OK") {
      notifySuccess("Hədəflər uğurla əlavə edildi.");
    } else {
      notifyError("Nə isə düzgün getmədi...");
    }
  };

  return (
    <div className="flex flex-col desktop:text-sm mobile:text-xs dark:text-slate-200">
      <TitleBox title="mazarina" />
      <p className="mb-8 ">Hədəflər</p>
      <div className="w-full ">
        <div className="flex flex-col gap-4 w-fit">
          <label htmlFor="fileReader">Faylı əlavə et</label>
          <div className="flex items-center gap-3">
            <input
              id="fileReader"
              type="file"
              required
              className="bg-transparent border border-gray-300 text-gray-900 =rounded-md focus:ring-blue-500 focus:border-blue-500 block w-fit p-2 d"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <button
              type="submit"
              className=" text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg =py-2 px-6 w-fit"
              onClick={clearInputs}
            >
              təmizlə
            </button>
          </div>
          <button
            type="submit"
            className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg =py-2 px-6 w-full"
            onClick={readExcel}
          >
            Yüklə
          </button>
        </div>
      </div>

      <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-10">
        <table className="w-full =text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="py-3 px-6">
                rut
              </th>
              <th scope="col" className="py-3 px-6">
                başlanğıc
              </th>
              <th scope="col" className="py-3 px-6">
                bitmə
              </th>
              <th scope="col" className="py-3 px-6">
                təmiz
              </th>
              <th scope="col" className="py-3 px-6">
                bozuk
              </th>
              <th scope="col" className="py-3 px-6">
                vaxt
              </th>
            </tr>
          </thead>
          <tbody>
            {inputList.map((input) => (
              <tr
                className="bg-white border-b  hover:bg-gray-50"
                key={input.id}
              >
                <th
                  scope="row"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
                >
                  {input.code}
                </th>
                <td className="py-4 px-6">
                  {new Date(input.began_date).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  {new Date(input.end_date).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">{input.temiz}</td>
                <td className="py-4 px-6">{input.bozuk}</td>
                <td className="py-4 px-6">{input.vaxt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="submit"
        className="self-end	text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg =py-2 px-6 w-60 mt-8"
        onClick={sendTargets}
      >
        Göndər
      </button>

      <div className="flex gap-3 items-center mt-8">
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg =py-2 px-6 w-60"
          onClick={getTargets}
        >
          Cari limitləri gətir
        </button>
        <button
          type="submit"
          className=" text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg =py-2 px-6 w-fit"
          onClick={clearTargets}
        >
          təmizlə
        </button>
      </div>

      <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-10">
        <table className="w-full =text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="py-3 px-6">
                rut
              </th>
              <th scope="col" className="py-3 px-6">
                başlanğıc
              </th>
              <th scope="col" className="py-3 px-6">
                bitmə
              </th>
              <th scope="col" className="py-3 px-6">
                təmiz
              </th>
              <th scope="col" className="py-3 px-6">
                bozuk
              </th>
              <th scope="col" className="py-3 px-6">
                vaxt
              </th>
            </tr>
          </thead>
          <tbody>
            {targets.map((input) => (
              <tr
                className="bg-white border-b  hover:bg-gray-50"
                key={input.id}
              >
                <th
                  scope="row"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
                >
                  {input.CODE}
                </th>
                <td className="py-4 px-6">
                  {new Date(input.BEGDATE).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  {new Date(input.ENDDATE).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">{input.TARGET_QAYTARMA_TEMIZ}</td>
                <td className="py-4 px-6">{input.TARGET_QAYTARMA_BOZUK}</td>
                <td className="py-4 px-6">{input.TARGET_QAYTARMA_VAXT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(MazarinaPage);
