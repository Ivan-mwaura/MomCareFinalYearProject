import { ExpoRoot } from "expo-router";


export default function App() {
  const ctx = require.context("./app"); // Loads all routes from the `app/` directory
  return <ExpoRoot context={ctx} />;
}
