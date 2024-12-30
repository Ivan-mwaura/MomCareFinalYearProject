import { Stack } from "expo-router";
import Navbar from "./navbar";
import { Provider } from "react-redux";
import store from "../redux/store";

const PagesLayout = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Stack Navigator */}
      <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false, // We don't need individual headers because of the navbar
        }}
      />
      </Provider>
    </>
  );
};

export default PagesLayout;
