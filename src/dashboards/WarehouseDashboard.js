import { memo, useEffect, useState } from "react";
import TitleBox from "../components/tools/TitleBox";
import InfoBox from "../components/tools/InfoBox";
import AmountBox from "../components/tools/AmountBox";
import ItemInfoBox from "../components/tools/ItemInfoBox";
import ReplInfoBox from "../components/tools/ReplInfoBox";
import { notifyError } from "../components/tools/Notify";
import { getReplacements } from "../stores/replacementsSlice";
import {
  getFichesByMonth,
  getTotalAmountByMonth,
} from "../services/paymentsService";
import { getItemsByDepartment, getNewItems } from "../services/itemService";
import { getItems } from "../stores/itemsSlice";
import { useDispatch, useSelector } from "react-redux";

function WarehouseDashboard() {
  const [serviceItems, setServiceItems] = useState([]);
  const [buferItems, setBuferItems] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [officeItems, setOfficeItems] = useState([]);
  const [monthlyFiches, setMonthlyFiches] = useState([]);
  const [currentAmount, setCurrentAmount] = useState([]);
  const [previousAmount, setPreviousAmount] = useState([]);
  const { replacements } = useSelector((state) => state.replacements);
  const { items } = useSelector((state) => state.items);
  const dispatch = useDispatch();

  async function handleServiceItems() {
    try {
      const data = await getItemsByDepartment(14, 2);
      setServiceItems(data);
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  }
  async function handleBuferItems() {
    try {
      const data = await getItemsByDepartment(19, 2);
      setBuferItems(data);
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  }

  async function handleItems() {
    try {
      dispatch(getItems());
      setOfficeItems(items.filter((item) => item.LOCATION_ID === 2));
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  }

  async function handleNewItems() {
    try {
      const data = await getNewItems(2);
      setNewItems(data);
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  }

  async function handleMonthlyFiches() {
    try {
      const data = await getFichesByMonth(2);
      setMonthlyFiches(data);
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  }

  async function handleCurrentAmount() {
    try {
      const data = await getTotalAmountByMonth(new Date().getMonth() + 1, 2);
      setCurrentAmount(data);
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  }

  async function handlePreviousAmount() {
    try {
      const data = await getTotalAmountByMonth(new Date().getMonth(), 2);
      setPreviousAmount(data);
    } catch (error) {
      notifyError("Sistem xətası!");
      console.log(error);
    }
  }

  useEffect(() => {
    try {
      handleServiceItems();
      handleBuferItems();
      dispatch(getReplacements());
      handleItems();
      handleNewItems();
      handleMonthlyFiches();
      handleCurrentAmount();
      handlePreviousAmount();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="flex gap-8 desktop:gap-14 mobile:gap-6 flex-wrap">
      <TitleBox title="anbar" />
      <div className="flex gap-3 flex-wrap">
        <InfoBox title={"Ümumi cihaz sayı"} data={officeItems} />
        <InfoBox title={"Yeni alınan cihaz sayı"} data={newItems} />
        <InfoBox title={"Cari ay üzrə faktura sayı"} data={monthlyFiches} />
        <AmountBox title={"Cari ay üzrə ödəniş məbləği"} data={currentAmount} />
        <AmountBox
          title={"Əvvəlki ay üzrə ödəniş məbləği"}
          data={previousAmount}
        />
      </div>
      <div className="flex gap-3 flex-wrap">
        <ItemInfoBox title={"Servisə gedəcək cihazlar"} data={buferItems} />
        <ItemInfoBox title={"Servisdəki cihazlar"} data={serviceItems} />
        <ReplInfoBox data={replacements} />
      </div>
    </div>
  );
}

export default memo(WarehouseDashboard);
