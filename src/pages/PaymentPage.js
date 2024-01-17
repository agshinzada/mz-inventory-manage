import { Tab } from "@headlessui/react";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFiches,
  getPayments,
  setLastFicheCode,
  setMonthlyFiches,
  setSearchedFiches,
  setSearchedPayments,
  setUnconfirmedFiches,
} from "../stores/paymentsSlice";

import FichesTable from "../components/payments/FichesTable";
import TableSearch from "../components/tools/TableSearch";
import TitleBox from "../components/tools/TitleBox";
import PaymentsTable from "../components/payments/PaymentsTable";
import { notifyError, notifySuccess } from "../components/tools/Notify";
import EditFicheModal from "../components/modals/EditFicheModal";
import AddFicheModal from "../components/modals/AddFicheModal";
import { setNonPriceInvoices } from "../stores/invoicesSlice";
import FichesModal from "../components/modals/FichesModal";
import InvoicesModal from "../components/modals/InvoicesModal";
import Swal from "sweetalert2";
import InvoiceTable from "../components/invoices/InvoiceTable";
import Select from "react-select";

import {
  getFichesByDateRange,
  getFichesByMonth,
  getFichesBySearch,
  getFichesByStatus,
  getLastFicheCode,
  getPaymentsByDateRange,
  getPaymentsBySearch,
  postNewPayment,
  putFicheStatus,
} from "../services/paymentsService";
import { getInvoiceWithNoPrice } from "../services/invoicesService";

function PaymentPage() {
  const { monthlyFiches, fiches, unconfirmedFiches } = useSelector(
    (state) => state.payments
  );
  const { nonPriceInvoices } = useSelector((state) => state.invoices);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // TABLE FILTER STATES
  const [fromDatePayment, setFromDatePayment] = useState(null);
  const [toDatePayment, setToDatePayment] = useState(null);
  const [fromDateFiche, setFromDateFiche] = useState(null);
  const [toDateFiche, setToDateFiche] = useState(null);

  // CREATE FICHE STATES
  const [ficheDate, setFicheDate] = useState(null);
  const [ficheType, setFicheType] = useState(null);
  const [ficheConfirmDate, setFicheConfirmDate] = useState(null);
  const [ficheId, setFicheId] = useState(null);

  // CREATE PAYMENTS STATES
  const [invoiceForAddPayment, setInvoiceForAddPayment] = useState(null);
  const [ficheForAddPayment, setFicheForAddPayment] = useState(null);
  const [paymentPrice, setPaymentPrice] = useState(null);
  const [paymentExplanation, setPaymentExplanation] = useState("");
  const [paymentDate, setPaymentDate] = useState(null);

  // CREATE PAYMENTS REFS
  const paymentInvoiceRef = useRef();
  const paymentFicheRef = useRef();
  const paymentPriceRef = useRef();
  const paymentExplRef = useRef();
  const paymentDateRef = useRef();
  const ficheConfirmDateRef = useRef();

  // MODAL STATES
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenInvoices, setIsOpenInvoices] = useState(false);
  const [isOpenFiches, setIsOpenFiches] = useState(false);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const getMontlyFiches = async () => {
    try {
      const data = await getFichesByMonth(null);
      dispatch(setMonthlyFiches(data));
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const getUnconfirmedFiches = async () => {
    try {
      const data = await getFichesByStatus(0);
      dispatch(setUnconfirmedFiches(data));
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const getInvoices = async () => {
    try {
      const data = await getInvoiceWithNoPrice();
      dispatch(setNonPriceInvoices(data));
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const handleLastCode = async () => {
    try {
      const data = await getLastFicheCode();
      const last = parseInt(data.LAST) + 1;
      dispatch(setLastFicheCode(last.toString().padStart(4, "0")));
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const searchPayment = async (e) => {
    try {
      const data = await getPaymentsBySearch(e.target.value);
      dispatch(setSearchedPayments(data));
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const searchFiche = async (e) => {
    try {
      const data = await getFichesBySearch(e.target.value);
      dispatch(setSearchedFiches(data));
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const handlePaymentFilterRange = async () => {
    try {
      if (fromDatePayment && toDatePayment) {
        const data = await getPaymentsByDateRange(
          fromDatePayment,
          toDatePayment
        );
        dispatch(setSearchedPayments(data));
      } else {
        notifyError("Xanaları doldurun!");
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const handleFicheFilterRange = async () => {
    try {
      if (fromDateFiche && toDateFiche) {
        const data = await getFichesByDateRange(fromDateFiche, toDateFiche);
        dispatch(setSearchedFiches(data));
      } else {
        notifyError("Xanaları doldurun!");
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const handleAddPayment = async (e) => {
    try {
      e.preventDefault();
      if (invoiceForAddPayment && ficheForAddPayment) {
        Swal.fire({
          title: "Yeni ödəniş",
          text: `Ödəniş əlavə edilsin?`,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
          cancelButtonText: "İmtina",
        }).then(async (result) => {
          if (result.isConfirmed) {
            postPayment();
            resetAddPaymentInputs();
          }
        });
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const handleConfirmFiche = async (e) => {
    try {
      if (ficheId && ficheConfirmDate) {
        Swal.fire({
          text: `Faktura və bağlı ödənişlər təsdiqlənəcək`,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
          cancelButtonText: "İmtina",
        }).then(async (result) => {
          if (result.isConfirmed) {
            putFiche(ficheId, ficheConfirmDate);
          }
        });
      } else {
        notifyError("Faktura və ya tarix seçilməyib!");
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const postPayment = async () => {
    try {
      const obj = {
        invoiceId: invoiceForAddPayment.ID,
        ficheId: ficheForAddPayment.ID,
        price: paymentPrice,
        explanation: paymentExplanation,
        date: paymentDate,
        userId: token.ID,
      };
      await postNewPayment(obj);
      notifySuccess("Ödəniş uğurla əlavə edildi!");
      dispatch(getPayments());
      dispatch(getFiches());
      getInvoices();
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const putFiche = async (id, date) => {
    try {
      const obj = {
        id,
        date,
      };
      const res = await putFicheStatus(obj);
      if (res.status === 200) {
        notifySuccess("Faktura təsdiqləndi!");
        dispatch(getFiches());
        getUnconfirmedFiches(0);
        resetFicheStatusInputs();
      }
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  };

  const resetAddPaymentInputs = async () => {
    paymentPriceRef.current.value = "";
    paymentExplRef.current.value = "";
    paymentDateRef.current.value = "";
    setInvoiceForAddPayment(null);
    setFicheForAddPayment(null);
    setPaymentPrice(null);
    setPaymentExplanation("");
    setPaymentDate(null);
  };

  const resetFicheStatusInputs = async () => {
    ficheConfirmDateRef.current.value = "";
    setFicheId(null);
    setFicheConfirmDate(null);
  };

  useEffect(() => {
    dispatch(getPayments());
    dispatch(getFiches());
    getMontlyFiches();
    getInvoices();
    getUnconfirmedFiches();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <TitleBox title="fakturalar" />
      <div className="w-full sm:px-0">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl mb-3 bg-slate-500 dark:bg-gray-500 p-1">
            <Tab
              key={1}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 desktop:text-sm mobile:text-xs font-medium leading-5 text-black",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 dark:ring-offset-0 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white dark:text-slate-100 dark:bg-gray-800 shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {"Cari ay üzrə fakturalar"}
            </Tab>
            <Tab
              key={2}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 desktop:text-sm mobile:text-xs font-medium leading-5 text-black",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 dark:ring-offset-0 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white dark:text-slate-100 dark:bg-gray-800 shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {"Ödənişsiz invoyslar"}
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel key={1}>
              <FichesTable fiches={monthlyFiches} />
            </Tab.Panel>
            <Tab.Panel key={2}>
              <InvoiceTable invoices={nonPriceInvoices} edit={false} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col bg-white dark:bg-gray-800 gap-3 border dark:border-gray-500 p-4 rounded-sm text-sm w-80">
          <label className="dark:text-white">Yeni faktura</label>
          <select
            className="bg-transparent border border-gray-300 dark:bg-gray-700 dark:border-slate-500 text-gray-900 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 mobile:w-full "
            required
            name="item_location"
            onChange={(e) => {
              setFicheType(e.target.value);
            }}
            defaultValue={"DEFAULT"}
          >
            <option disabled value="DEFAULT">
              Faktura tipi
            </option>
            <option key={1} value={1}>
              Ofis
            </option>
            <option key={2} value={2}>
              Anbar
            </option>
          </select>
          <input
            type="date"
            placeholder="Tarix"
            className="bg-transparent border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-500 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 "
            onChange={(e) =>
              setFicheDate(
                `${e.target.value} ${new Date().toLocaleTimeString("az")}`
              )
            }
          />
          <button
            type="submit"
            className="text-white text-sm h-fit disabled:bg-gray-500 bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium border border-gray-500 rounded-lg py-2 px-6 desktop:w-fit mobile:w-full"
            onClick={() => {
              if (ficheType && ficheDate) {
                handleLastCode();
                getInvoices();
                setIsOpenAdd(true);
              } else {
                notifyError("Parametrlər seçilməyib!");
              }
            }}
            disabled={ficheType && ficheDate ? false : true}
          >
            Yarat
          </button>
        </div>
        <form
          onSubmit={handleAddPayment}
          className="flex flex-col gap-3 border bg-white dark:bg-gray-800 dark:border-gray-500 p-4 rounded-sm text-sm w-80"
        >
          <label className="dark:text-white">Ödəniş əlavə et</label>
          <div className="relative flex">
            <input
              type="text"
              placeholder="Qaimə"
              disabled
              required
              defaultValue={
                invoiceForAddPayment &&
                `${invoiceForAddPayment.ID} - ${invoiceForAddPayment.CODE}`
              }
              ref={paymentInvoiceRef}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  block w-full py-2 px-2.5 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white "
            />
            <button
              type="button"
              className="absolute right-0 text-white text-sm h-fit bg-gray-600 hover:bg-gray-700  font-medium border border-gray-500 rounded-md py-2 px-6 w-fit"
              onClick={() => setIsOpenInvoices(true)}
            >
              Seç
            </button>
          </div>
          <div className="relative flex">
            <input
              type="text"
              placeholder="Faktura"
              disabled
              required
              defaultValue={
                ficheForAddPayment &&
                `${ficheForAddPayment.CODE} - ${ficheForAddPayment.NAME}`
              }
              ref={paymentFicheRef}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  block w-full py-2 px-2.5 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white "
            />
            <button
              type="button"
              className="absolute right-0 text-white text-sm h-fit bg-gray-600 hover:bg-gray-700  font-medium border border-gray-500 rounded-md py-2 px-6 w-fit"
              onClick={() => setIsOpenFiches(true)}
            >
              Seç
            </button>
          </div>
          <input
            type="number"
            step={"any"}
            placeholder="Məbləğ"
            required
            onChange={(e) => setPaymentPrice(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-2.5 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            disabled={!(invoiceForAddPayment && ficheForAddPayment)}
            ref={paymentPriceRef}
          />
          <input
            type="text"
            placeholder="Açıqlama"
            onChange={(e) => setPaymentExplanation(e.target.value.trim())}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-2.5 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            disabled={!(invoiceForAddPayment && ficheForAddPayment)}
            ref={paymentExplRef}
          />
          <input
            type="date"
            placeholder="Tarix"
            required
            onChange={(e) =>
              setPaymentDate(
                `${e.target.value} ${new Date().toLocaleTimeString("az")}`
              )
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-2.5 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            disabled={!(invoiceForAddPayment && ficheForAddPayment)}
            ref={paymentDateRef}
          />
          <button
            type="submit"
            className="text-white text-sm h-fit disabled:bg-gray-500 bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium border border-gray-500 rounded-lg py-2 px-6 desktop:w-fit mobile:w-full"
            disabled={!(invoiceForAddPayment && ficheForAddPayment)}
          >
            Əlavə et
          </button>
        </form>
        <div className="flex flex-col gap-3 border bg-white dark:bg-gray-800 dark:border-gray-500 p-4 rounded-sm text-sm w-80">
          <label className="dark:text-white">Fakturanın ödəniş statusu</label>
          <Select
            placeholder="Fakturalar"
            options={unconfirmedFiches}
            className="w-full"
            getOptionLabel={(option) => `${option.CODE} - ${option.NAME}`}
            getOptionValue={(option) => option.CODE}
            onChange={(e) => setFicheId(e.ID)}
          />
          <input
            type="date"
            placeholder="Tarix"
            className="bg-transparent border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-500 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-full p-2 "
            onChange={(e) => setFicheConfirmDate(e.target.value)}
            ref={ficheConfirmDateRef}
          />
          <button
            type="submit"
            className="text-white text-sm h-fit disabled:bg-gray-500 bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium border border-gray-500 rounded-lg py-2 px-6 desktop:w-fit mobile:w-full"
            onClick={handleConfirmFiche}
          >
            Dəyiş
          </button>
          <hr />
          <button
            type="submit"
            className="text-white text- h-fit disabled:bg-gray-500 bg-red-700 hover:bg-red-800 focus:ring-1 focus:ring-blue-300 font-medium border border-gray-500 rounded-lg py-1.5 px-4 desktop:w-fit mobile:w-full"
            onClick={() => {}}
          >
            Toplu güncəllə
          </button>
        </div>
      </div>

      <div className="flex gap-8 desktop:flex-row mobile:flex-col">
        <div className="flex flex-col gap-2 w-full">
          <div className="w-full">
            <label className="font-semibold dark:text-white mb-2">
              Fakturalar
            </label>
            <div className="flex desktop:items-center gap-4 desktop:flex-row mobile:flex-col mb-2">
              <TableSearch
                searchDevice={searchFiche}
                placeholder={"Ref və ya kod"}
              />
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  id="default-input"
                  placeholder="Tarix"
                  onChange={(e) => setFromDateFiche(e.target.value)}
                  className="bg-transparent border border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-500 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-fit mobile:w-full p-2 "
                />
                <span className="desktop:block mobile:hidden dark:text-slate-100">
                  to
                </span>
                <input
                  type="date"
                  id="default-input"
                  placeholder="Tarix"
                  onChange={(e) => setToDateFiche(e.target.value)}
                  className="bg-transparent border border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-500 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-fit mobile:w-full p-2 "
                />
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg py-2 px-6 desktop:w-fit mobile:w-full"
                  onClick={handleFicheFilterRange}
                >
                  axtar
                </button>
              </div>
            </div>
            <FichesTable fiches={fiches} />
          </div>
          <br />
          <div className="w-full">
            <label className="font-semibold dark:text-white mb-2">
              Ödənişlər
            </label>

            <div className="flex desktop:items-center gap-4 desktop:flex-row mobile:flex-col mb-2">
              <TableSearch
                searchDevice={searchPayment}
                placeholder={"Ref və ya kod"}
              />
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  id="default-input"
                  placeholder="Tarix"
                  onChange={(e) => setFromDatePayment(e.target.value)}
                  className="bg-transparent border border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-500 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-fit mobile:w-full p-2 "
                />
                <span className="desktop:block mobile:hidden dark:text-slate-100">
                  to
                </span>
                <input
                  type="date"
                  id="default-input"
                  placeholder="Tarix"
                  onChange={(e) => setToDatePayment(e.target.value)}
                  className="bg-transparent border border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-500 dark:text-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block desktop:w-fit mobile:w-full p-2 "
                />
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg py-2 px-6 desktop:w-fit mobile:w-full"
                  onClick={handlePaymentFilterRange}
                >
                  axtar
                </button>
              </div>
            </div>
            <PaymentsTable token={token} />
          </div>
        </div>
      </div>
      <EditFicheModal isOpen={isOpenEdit} setIsOpen={setIsOpenEdit} />
      <AddFicheModal
        isOpen={isOpenAdd}
        setIsOpen={setIsOpenAdd}
        type={ficheType}
        date={ficheDate}
        getInvoices={getInvoices}
      />
      <FichesModal
        isOpen={isOpenFiches}
        setIsOpen={setIsOpenFiches}
        setData={setFicheForAddPayment}
      />
      <InvoicesModal
        isOpen={isOpenInvoices}
        setIsOpen={setIsOpenInvoices}
        setData={setInvoiceForAddPayment}
      />
    </div>
  );
}

export default memo(PaymentPage);
