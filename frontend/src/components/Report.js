import { useTheme } from "../ThemeContext";

export default function Report(){
    const { darkMode, setDarkMode } = useTheme();
    return<>
    <h1>Hello from reports page</h1>
    <button 
      onClick={() => setDarkMode(!darkMode)} 
      className="p-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded"
    >
      Toggle Theme
    </button>
    </>
}