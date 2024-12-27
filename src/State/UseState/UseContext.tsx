import React, { createContext, ReactNode, useState } from "react";
import { useCookies } from "react-cookie";
import { Location, useLocation } from "react-router-dom";

interface AppAlert {
  alert: boolean;
  type: string;
  msg: string;
}

interface AppLoading {
  load: boolean;
  color: string;
}

interface UseContextType {
  cookies: { [key: string]: any };
  setCookie: (name: "aegis", value: any, options?: any) => void;
  removeCookie: (name: "aegis", options?: any) => void;
  appAlert: AppAlert;
  setAppAlert: React.Dispatch<React.SetStateAction<AppAlert>>;
  appLoading: AppLoading;
  setAppLoading: React.Dispatch<React.SetStateAction<AppLoading>>;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  location: Location;
}

const UseContext = createContext<UseContextType | undefined>(undefined);

interface UseStateProps {
  children: ReactNode;
}

export const UseState = (props: UseStateProps) => {
  // use useCookies for stored and removed the token
  const [cookies, setCookie, removeCookie] = useCookies(["aegis"]);
  // useLocation to access the location
  const location = useLocation();

  // appAlert to display the successfully message on the window
  const [appAlert, setAppAlert] = useState<AppAlert>({
    alert: false,
    type: "success",
    msg: "this is success alert",
  });

  // for loading purpose
  const [appLoading, setAppLoading] = useState<AppLoading>({
    load: false,
    color: "#fff",
  });

  // for in progress bar
  const [progress, setProgress] = useState<number>(10);

  return (
    <UseContext.Provider
      value={{
        cookies,
        setCookie,
        removeCookie,
        appAlert,
        setAppAlert,
        appLoading,
        setAppLoading,
        progress,
        setProgress,
        location,
      }}
    >
      {props.children}
    </UseContext.Provider>
  );
};

export { UseState as default, UseContext };
