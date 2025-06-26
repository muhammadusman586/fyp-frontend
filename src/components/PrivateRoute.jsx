import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom"; 

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  console.log("PrivateRoute: Authentication check:", userInfo);

  if (!userInfo) {
    console.log("Redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  console.log("Rendering protected routes...");
  return <Outlet />;
};

export default PrivateRoute;
