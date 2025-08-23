// components/ViewSelector.tsx
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { useEffect } from "react";
import LoginView from "./firebase-ui/LoginView";
import MainView from "./MainView";
import DashboardView from "./DashboardView";
import { auth } from "./firebase-ui/firebase";
import { handleAuthState, handleTokenRefresh } from "../utils/authHandlers";

const ViewSelector: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      void handleAuthState(dispatch, user);
    });

    const unsubToken = auth.onIdTokenChanged((user) => {
      void handleTokenRefresh(dispatch, user);
    });

    return () => { unsubAuth(); unsubToken(); };
  }, [dispatch]);

  const currentView = useSelector((s: RootState) => s.ui.currentView);

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      {currentView === "login" && <LoginView />}
      {currentView === "main" && <MainView />}
      {currentView === "dashboard" && <DashboardView />}
    </div>
  );
};

export default ViewSelector;
