import React from "react";
import { Stack } from "expo-router";
import Navbar from "./navbar";
import { Provider } from "react-redux";
import store from "../redux/store";
import ProtectedRoute from "../ProtectedRoute";

const PagesLayout = () => {
  return (
    <>
      <Navbar />
      <Provider store={store}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "none",
          }}
        />
      </Provider>
    </>
  );
};

export default PagesLayout;
