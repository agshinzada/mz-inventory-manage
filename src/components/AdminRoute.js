import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { notifyError } from "./tools/Notify";

function AdminRoute({ children }) {
  const { token } = useSelector((state) => state.auth);
  if (!token) {
    return <Navigate to="/auth/login" />;
  } else if (token.ROLE === "ADMIN" || token.ROLE === "MODERATOR") {
    return children;
  } else {
    notifyError("Siz bu səhifəyə yetkiniz yoxdur!");
  }
}

export default AdminRoute;
