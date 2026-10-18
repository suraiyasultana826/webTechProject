import "@/styles/globals.css";
import { store } from "@/Store/store";
import { Provider } from "react-redux";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { setUserData } from "@/Utils/UserSlice";
import "react-toastify/dist/ReactToastify.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  // Restore the logged-in user after a page refresh so every page
  // (not only those rendering the NavBar) can read it from the store.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (Cookies.get("token") && storedUser) {
      store.dispatch(setUserData(JSON.parse(storedUser)));
    }
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
