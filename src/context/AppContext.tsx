
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { IpCalculationHistory } from "../types/ipCalculator";

type Language = "fr" | "en";
type Theme = "light" | "dark";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  history: IpCalculationHistory[];
  addToHistory: (entry: Omit<IpCalculationHistory, "id" | "timestamp">) => void;
  clearHistory: () => void;
  translations: Record<string, Record<string, string>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("fr");
  const [theme, setTheme] = useState<Theme>("light");
  const [history, setHistory] = useState<IpCalculationHistory[]>([]);

  // Charger l'historique depuis le localStorage au démarrage
  useEffect(() => {
    const savedHistory = localStorage.getItem("ipCalculatorHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Erreur lors du chargement de l'historique:", e);
      }
    }
    
    // Récupérer les préférences de langue et thème
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Utiliser les préférences du système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);
  
  // Mettre à jour le thème du document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem("theme", theme);
  }, [theme]);
  
  // Mettre à jour la langue
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Enregistrer l'historique à chaque modification
  useEffect(() => {
    localStorage.setItem("ipCalculatorHistory", JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  const addToHistory = (entry: Omit<IpCalculationHistory, "id" | "timestamp">) => {
    const newEntry: IpCalculationHistory = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    // Limiter l'historique aux 10 dernières entrées
    setHistory(prev => [newEntry, ...prev].slice(0, 10));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // Traductions
  const translations = {
    appTitle: {
      fr: "EasyWork - Calculateur de Sous-Réseau IP",
      en: "EasyWork - IP Subnet Calculator"
    },
    ipAddress: {
      fr: "Adresse IP",
      en: "IP Address"
    },
    subnetMask: {
      fr: "Masque de sous-réseau",
      en: "Subnet Mask"
    },
    calculate: {
      fr: "Calculer",
      en: "Calculate"
    },
    reset: {
      fr: "Réinitialiser",
      en: "Reset"
    },
    results: {
      fr: "Résultats",
      en: "Results"
    },
    history: {
      fr: "Historique",
      en: "History"
    },
    clearHistory: {
      fr: "Effacer l'historique",
      en: "Clear History"
    },
    noHistory: {
      fr: "Aucun calcul dans l'historique",
      en: "No calculations in history"
    },
    networkAddress: {
      fr: "Adresse réseau",
      en: "Network Address"
    },
    broadcastAddress: {
      fr: "Adresse de diffusion",
      en: "Broadcast Address"
    },
    firstUsableAddress: {
      fr: "Première adresse utilisable",
      en: "First Usable Address"
    },
    lastUsableAddress: {
      fr: "Dernière adresse utilisable",
      en: "Last Usable Address"
    },
    totalHosts: {
      fr: "Nombre total d'hôtes",
      en: "Total Hosts"
    },
    usableHosts: {
      fr: "Hôtes utilisables",
      en: "Usable Hosts"
    },
    ipClass: {
      fr: "Classe IP",
      en: "IP Class"
    },
    cidrNotation: {
      fr: "Notation CIDR",
      en: "CIDR Notation"
    },
    binaryIp: {
      fr: "IP en binaire",
      en: "Binary IP"
    },
    binaryMask: {
      fr: "Masque en binaire",
      en: "Binary Mask"
    },
    darkMode: {
      fr: "Mode sombre",
      en: "Dark Mode"
    },
    language: {
      fr: "Langue",
      en: "Language"
    },
    ipError: {
      fr: "Veuillez entrer une adresse IP valide (ex: 192.168.1.0)",
      en: "Please enter a valid IP address (e.g., 192.168.1.0)"
    },
    maskError: {
      fr: "Veuillez entrer un masque valide (ex: /24 ou 255.255.255.0)",
      en: "Please enter a valid subnet mask (e.g., /24 or 255.255.255.0)"
    },
    calculationSuccess: {
      fr: "Calcul effectué avec succès",
      en: "Calculation completed successfully"
    },
    copy: {
      fr: "Copier",
      en: "Copy"
    },
    copied: {
      fr: "Copié !",
      en: "Copied!"
    },
    ipRange: {
      fr: "Plage d'adresses",
      en: "IP Range"
    },
    calculatedAt: {
      fr: "Calculé le",
      en: "Calculated at"
    },
    settings: {
      fr: "Paramètres",
      en: "Settings"
    },
    binaryRepresentation: {
      fr: "Représentation binaire",
      en: "Binary Representation"
    },
    home: {
      fr: "Accueil",
      en: "Home"
    },
    moreInfo: {
      fr: "Plus d'informations",
      en: "More information"
    }
  };

  const value = {
    language,
    setLanguage,
    theme,
    setTheme,
    toggleTheme,
    history,
    addToHistory,
    clearHistory,
    translations
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
