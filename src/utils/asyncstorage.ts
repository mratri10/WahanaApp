import AsyncStorage from '@react-native-async-storage/async-storage';
import productStore, { ProductContentType } from '../store/ProductStore'

export const setChartStorage = async (oldData: ProductContentType[], newItem: ProductContentType) => {
    const index = oldData.findIndex(
        (product) => product.id === newItem.id
    );
    let data = []
    if (index !== undefined && index !== -1) {
        oldData[index] = newItem;
        data = oldData
    } else {
        oldData.push(newItem)
        data = oldData
    }

    await AsyncStorage.setItem('ChartProduct', JSON.stringify(data))
}

export const deleteChartStorage = async (oldData: ProductContentType[], newItem: ProductContentType) => {
    const index = oldData.findIndex(
        (product) => product.id === newItem.id
    );
    let data = []
    if (index !== undefined && index !== -1) {
        oldData.splice(index, 1);
        data = oldData
    } else {
        data = oldData
    }

    await AsyncStorage.setItem('ChartProduct', JSON.stringify(data))
}
export const getChartStorage = async () => {
    const fetchData = await AsyncStorage.getItem('ChartProduct');
    await AsyncStorage.getItem('ChartProduct').then(v => {
        const JSONData: ProductContentType[] = JSON.parse(v ?? "")
        productStore.saveDataLocal(JSONData)
    })
    return fetchData
}