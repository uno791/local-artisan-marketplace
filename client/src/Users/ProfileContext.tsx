// src/contexts/ProfileContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import axios from "axios";
import profileImg from "../assets/profile.png";
import { useUser } from "../Users/UserContext";
import { baseURL } from "../config";

type SellerStatus = "none" | "pending" | "approved";

export interface ProfileData {
  postalCode: string;
  phone: string;
  image: string;
  sellerStatus: SellerStatus;
}

interface ProfileContextValue {
  profile: ProfileData;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined
);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const cacheKey = `profileData:${user?.username}`;

  const [profile, setProfile] = useState<ProfileData>({
    postalCode: "-",
    phone: "",
    image: profileImg,
    sellerStatus: "none",
  });

  // fetch and cache helper
  async function fetchProfile() {
    if (!user?.username) return;
    try {
      const res = await axios.get(`${baseURL}/getuser/${user.username}`);
      const art = await axios.get(`${baseURL}/artisan/${user.username}`);

      const newProfile: ProfileData = {
        postalCode: res.data.postal_code?.toString() || "-",
        phone: res.data.phone_no || "",
        image: res.data.user_pfp || profileImg,
        sellerStatus: art.data?.verified === 1 ? "approved" : "pending",
      };

      setProfile(newProfile);
      localStorage.setItem(cacheKey, JSON.stringify(newProfile));
    } catch (err) {
      console.error("❌ Failed to fetch profile:", err);
    }
  }

  // on mount or user change: load cache → fetch fresh once
  useEffect(() => {
    if (!user?.username) return;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setProfile(JSON.parse(cached));
    }
    fetchProfile();
  }, [user?.username]);

  return (
    <ProfileContext.Provider value={{ profile, refreshProfile: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return ctx;
}
