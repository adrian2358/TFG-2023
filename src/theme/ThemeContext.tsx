import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import {
  MD3DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
  MD3Theme as PaperTheme,
} from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';

type Theme = NavigationTheme &
  PaperTheme & {
    // add here extra theme props
    colors: MD3Colors & {
      expense: string;
      income: string;
    };
  };

const lightTheme: Theme = {
  ...NavigationDefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    expense: 'rgb(248, 79, 49)',
    income: 'rgb(35, 197, 82)',
  },
};

const darkTheme: Theme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme.colors,
    expense: 'rgba(248, 79, 49, .75)',
    income: 'rgba(35, 197, 82, .75)',
  },
};

type ThemeType = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  themeType: ThemeType;
  isDarkTheme: boolean;
  toggleThemeType: () => void;
  setThemeType: React.Dispatch<React.SetStateAction<ThemeType>>;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: lightTheme,
  themeType: 'light',
  isDarkTheme: false,
  setThemeType: () => {},
  toggleThemeType: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeContextProviderProps {
  children: React.ReactNode;
}

export const ThemeContextProvider = ({ children }: ThemeContextProviderProps) => {
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>(colorScheme || 'light');

  const toggleThemeType = useCallback(() => {
    setThemeType((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const isDarkTheme = themeType === 'dark';
  const theme = isDarkTheme ? darkTheme : lightTheme;

  useEffect(() => {
    setThemeType(colorScheme || themeType);
  }, [colorScheme]);

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
