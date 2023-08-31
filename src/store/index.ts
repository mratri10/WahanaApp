import React from 'react';
import productStore from './ProductStore'
export const stores = Object.freeze({
    productStore,
})

export const storeContext = React.createContext(stores)
export const StoresProvider = storeContext.Provider;

export const useStores = () => React.useContext(storeContext);

export const useStore = <T extends keyof typeof stores>(
    store: T
): typeof stores[T] => React.useContext(storeContext)[store]  