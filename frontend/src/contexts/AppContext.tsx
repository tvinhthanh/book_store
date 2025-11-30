/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import { usersApi } from "../services/users.service";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContextType = {
  showToast: (toast: ToastMessage) => void;
  isLoggedIn: boolean;
  userId: string | null;
  role: string | null;
  searchData: any[];
  setListSearch: (results: any[]) => void;
  setUserData: (id: string, role: string) => void;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastMessage | undefined>();

  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [searchData, setSearchData] = useState<any[]>([]);
  // console.log(userId, role);
  // validate token -> GET /api/users/me
  const { isError, isLoading } = useQuery(
    "validateToken",
    () => usersApi.getMe(),
    {
      retry: false,
      onSuccess: (data: any) => {
        if (data?.id_user) setUserId(data.id_user);
        if (data?.role) setRole(data.role);
      },
      onError: () => {
        setUserId(null);
        setRole(null);
      },
    }
  );

  const isLoggedIn = !isError && !isLoading;

  const setUserData = (id: string, role: string) => {
    setUserId(id);
    setRole(role);
  };

  const setListSearch = (results: any[]) => {
    setSearchData(results);
  };

  return (
    <AppContext.Provider
      value={{
        showToast: (msg) => setToast(msg),
        isLoggedIn,
        userId,
        role,
        searchData,
        setListSearch,
        setUserData,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used in provider");
  return ctx;
};
