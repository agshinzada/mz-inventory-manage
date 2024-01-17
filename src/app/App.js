import ItemsPage from "../pages/ItemsPage";

import "react-loading-skeleton/dist/skeleton.css";
import ReplacementPage from "../pages/ReplacementPage";
import InvoicesPage from "../pages/InvoicesPage";
import PaymentPage from "../pages/PaymentPage";
import EmployeesPage from "../pages/EmployeesPage";
import MazarinaPage from "../pages/MazarinaPage";
import Layout from "../layout/Layout";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AdminRoute from "../components/AdminRoute";
import DashboardLayout from "../layout/DashboardLayout";
import OfficeDashboard from "../dashboards/OfficeDashboard";
import WarehouseDashboard from "../dashboards/WarehouseDashboard";
import TransportsDashboard from "../dashboards/TransportsDashboard";
import { useIdleTimer } from "react-idle-timer";
import NotFound from "../pages/NotFound";
import { notifyError } from "../components/tools/Notify";
import { logout } from "../stores/authSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { urlRoot } from "..";
function App() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onIdle = async () => {
    const res = await axios.post(
      `${urlRoot}/logout/activity?id=${token.activityId}`
    );
    if (res.status === 200 && res.statusText === "OK") {
      dispatch(logout());
      navigate("/auth/login");
    } else {
      notifyError("Server error!");
    }
  };

  useIdleTimer({
    onIdle,
    timeout: 600_000,
    throttle: 500,
  });

  return (
    <div className="flex">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="dashboard"
            element={
              <AdminRoute>
                <DashboardLayout />
              </AdminRoute>
            }
          >
            <Route index element={<OfficeDashboard />} />
            <Route path="warehouse" element={<WarehouseDashboard />} />
            <Route path="transport" element={<TransportsDashboard />} />
          </Route>

          <Route
            path="items"
            element={
              <AdminRoute>
                <ItemsPage />
              </AdminRoute>
            }
          />
          <Route
            path="replacements"
            element={
              <AdminRoute>
                <ReplacementPage />
              </AdminRoute>
            }
          />
          <Route
            path="invoices"
            element={
              <AdminRoute>
                <InvoicesPage />
              </AdminRoute>
            }
          />
          <Route
            path="payments"
            element={
              <AdminRoute>
                <PaymentPage />
              </AdminRoute>
            }
          />
          <Route
            path="employees"
            element={
              <AdminRoute>
                <EmployeesPage />
              </AdminRoute>
            }
          />
          <Route
            path="mazarina"
            element={
              <AdminRoute>
                <MazarinaPage />
              </AdminRoute>
            }
          />
        </Route>
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
