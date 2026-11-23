import React, { createContext, useContext, useEffect, useState } from 'react';
import { ProfileData } from '../types/api';
import { getProfile } from '../api/profileService';
import { setApiCache } from '../hooks/useApi';

/**
 * Lightweight context — fetches ONLY the profile on mount (above-the-fold
 * data for Hero/Navbar).  All other sections lazy-load their own data via
 * useLazyApi when they scroll into the viewport.
 */
interface PortfolioContextType {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = () => {
    setLoading(true);
    setError(null);
    getProfile()
      .then((data) => {
        setProfile(data);
        setApiCache('getProfile', data);
        setLoading(false);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message || 'Failed to load profile';
        setError(msg);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <PortfolioContext.Provider value={{ profile, loading, error, refetch: fetchProfile }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio(): PortfolioContextType | null {
  return useContext(PortfolioContext);
}
