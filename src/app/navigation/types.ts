import type { NavigatorScreenParams } from '@react-navigation/native';


export type TabParamList = {
  Home?: undefined;
  Diary?: undefined;
  Reports?: undefined;
  Profile?: undefined;
};


export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}