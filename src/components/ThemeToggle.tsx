import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setTheme } from '../redux/themeSlice';
import { auth } from './firebase-ui/firebase';
import { writeData } from './firebase-ui/firebaseUtils';
import { Checkbox, Slider, Switch } from '../styles/ThemeToggle.style';

const ThemeToggle = () => {
    const dispatch = useDispatch();
    const currentTheme = useSelector((state: RootState) => state.theme.theme);

    const toggleTheme = async () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        dispatch(setTheme(newTheme));

        // Save to Firestore
        const user = auth.currentUser;
        if (user) {
            try {
                await writeData(user.uid, 'theme', newTheme);
                console.log('Theme saved to Firestore');
            } catch (error) {
                console.error('Error saving theme:', error);
            }
        }
    };

    const isChecked = currentTheme === 'dark';

  return (
    <Switch>
      <Checkbox
        type="checkbox"
        checked={isChecked}
        onChange={toggleTheme}
      />
      <Slider checked={isChecked} />
    </Switch>
  );
};

export default ThemeToggle;