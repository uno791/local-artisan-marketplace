import React, { createContext, useContext, useState } from "react";
import { User } from "../Users/User";

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  username: string;
  setUsername: (username: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");

  return (
    <UserContext.Provider value={{ user, setUser, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
