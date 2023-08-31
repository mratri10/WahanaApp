import React, { useEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';

function ProductScreen() {

    const productStore = useStore('productStore')

    useEffect(() => {
        loadDataProduct()
    }, [])

    useEffect(() => {
        console.log("+++++++++++++++++++++ ", productStore.dataProduct.message)
    }, [productStore.dataProduct])

    const loadDataProduct = async () => {
        await productStore.getDataProduct()
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#ddd', }}>
            {/* <Flatlist/> */}
        </View>
    )
}




export default observer(ProductScreen)