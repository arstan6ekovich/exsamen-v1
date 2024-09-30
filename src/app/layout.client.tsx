"use client";
import SessionProvider from "@/provider/SessionProvider";
import { store } from "@/redux/store";
import { FC, ReactNode } from "react";
import { Provider } from "react-redux";
interface LayoutClientType {
  children: ReactNode;
}

const LayoutClient: FC<LayoutClientType> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default LayoutClient;
