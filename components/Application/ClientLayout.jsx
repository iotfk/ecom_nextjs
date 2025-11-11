'use client'

import { ToastContainer } from "react-toastify";
import GlobalProvider from "@/components/Application/GlobalProvider";

export default function ClientLayout({ children }) {
  return (
    <GlobalProvider>
      <ToastContainer />
      {children}
    </GlobalProvider>
  );
}
