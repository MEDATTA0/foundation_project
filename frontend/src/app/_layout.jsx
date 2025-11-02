import "../global.css";
import { Slot } from "expo-router";

/**
 * Root Layout
 * This is the root layout component that wraps all screens
 * Using the new scalable folder structure
 */
export default function Layout() {
  return <Slot />;
}
