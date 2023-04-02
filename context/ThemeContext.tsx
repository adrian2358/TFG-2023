import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  Theme as NavigationTheme,
} from "@react-navigation/native";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import {
  MD3DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
  MD3Theme as PaperTheme,
} from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";

export type Theme = NavigationTheme &
  PaperTheme & {
    // add here extra theme props
    colors: MD3Colors & {
      expenseColor: string;
      incomeColor: string;
    };
  };

const lightTheme: Theme = {
  ...NavigationDefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    expenseColor: "rgb(186, 26, 26)",
    incomeColor: "rgb(1, 110, 33)",
  },
};

const darkTheme: Theme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme.colors,
    expenseColor: "rgb(255, 180, 171)",
    incomeColor: "rgb(126, 219, 127)",
  },
};

export type ThemeType = "dark" | "light";

export interface ThemeContextValue {
  theme: Theme;
  themeType: ThemeType;
  isDarkTheme: boolean;
  toggleThemeType: () => void;
  setThemeType: React.Dispatch<React.SetStateAction<ThemeType>>;
}

export const ThemeContext = React.createContext<ThemeContextValue>({
  theme: lightTheme,
  themeType: "light",
  isDarkTheme: false,
  setThemeType: () => {},
  toggleThemeType: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export interface ThemeContextProviderProps {
  children: React.ReactNode;
}

export const ThemeContextProvider = ({
  children,
}: ThemeContextProviderProps) => {
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>(colorScheme || "light");

  const toggleThemeType = useCallback(() => {
    setThemeType((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const isDarkTheme = useMemo(() => themeType === "dark", [themeType]);
  const theme = useMemo(
    () => (isDarkTheme ? darkTheme : lightTheme),
    [isDarkTheme]
  );

  return (
    <PaperProvider theme={theme}>
      <ThemeContext.Provider
        value={{
          theme,
          themeType,
          isDarkTheme,
          setThemeType,
          toggleThemeType,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </PaperProvider>
  );
};
