import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { getRedirectResult } from "firebase/auth";
import { setView } from "../redux/uiSlice";
import LoginView from "./firebase-ui/LoginView";
import SignupView from "./firebase-ui/SignupView";
import MainView from "./MainView";
import { auth } from './firebase-ui/firebase';

const ViewSelector: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                dispatch(setView('main'));
            } else {
                dispatch(setView('login'));
            }
        });
        return () => unsubscribe();
    }, [dispatch]);

    const currentView = useSelector((state: RootState) => state.ui.currentView);
    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            {currentView === 'login' && <LoginView />}
            {currentView === 'signup' && <SignupView />}
            {currentView === 'main' && <MainView />}
        </div>
    );
};

export default ViewSelector;
