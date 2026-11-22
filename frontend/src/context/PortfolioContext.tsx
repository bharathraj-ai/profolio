import React, { createContext, useContext, useEffect, useState } from 'react';
import { PortfolioBundleData } from '../types/api';
import { getPortfolioBundle } from '../api/portfolioService';
import { setApiCache } from '../hooks/useApi';

interface PortfolioContextType {
  data: PortfolioBundleData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioBundleData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBundle = () => {
    setLoading(true);
    setError(null);
    getPortfolioBundle()
      .then((bundle) => {
        setData(bundle);
        // Pre-populate individual function caches for instant useApi lookups
        setApiCache('getProfile', bundle.profile);
        setApiCache('getEducation', bundle.education);
        setApiCache('getSkills', bundle.skills);
        setApiCache('getProjects', bundle.projects);
        setApiCache('getAchievements', bundle.achievements);
        setApiCache('getCertifications', bundle.certifications);
        setApiCache('getCodingProfiles', bundle.codingProfiles);
        setLoading(false);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message || 'Failed to load portfolio details';
        setError(msg);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBundle();
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, loading, error, refetch: fetchBundle }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio(): PortfolioContextType | null {
  return useContext(PortfolioContext);
}

