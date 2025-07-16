import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { setView } from "../redux/uiSlice";
import LoginView from "./firebase-ui/LoginView";
import MainView from "./MainView";
import { auth } from './firebase-ui/firebase';
import { readData } from "./firebase-ui/firebaseUtils";
import { setTheme } from "../redux/themeSlice";
import DashboardView from "./DashboardView";


const ViewSelector: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        // IMPORTANT: Always listen to auth state changes!
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                dispatch(setView('main'));
                try {
                    const themeValue = await readData(user.uid, 'theme');
                    if (themeValue) {
                        dispatch(setTheme(themeValue));
                    }
                } catch (error) {
                    console.error('Error fetching theme:', error);
                }
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
            {currentView === 'main' && <MainView />}
            {currentView === 'dashboard' && <DashboardView />}
        </div>
    );
};

export default ViewSelector;
