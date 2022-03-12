import {createContext} from 'react';

export interface ShowLoaderContextData {
  showLoader: boolean;
  setShowLoader: (showLoader: boolean) => void;
}

const showLoaderContextDefaultValue: ShowLoaderContextData = {
  showLoader: false,
  setShowLoader: () => null,
}

export const ShowLoaderContext = createContext<ShowLoaderContextData>(showLoaderContextDefaultValue)
