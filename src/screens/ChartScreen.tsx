import React, {useEffect, useState} from 'react';
import {PropScreen, RootStackParamList} from '../../route';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  StyleSheet,
} from 'react-native';
import {ProductContentType} from '../store/ProductStore';
import {StackNavigationProp} from '@react-navigation/stack';
import {getChartStorage} from '../utils/asyncstorage';
import {observer} from 'mobx-react-lite';

function ChartScreen(data: PropScreen) {
  const [product, setProduct] = useState<ProductContentType[]>();

  useEffect(() => {
    getDataLocal();
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [data.navigation]);

  const getDataLocal = () => {
    getChartStorage()
      .then(v => {
        const JSONData: ProductContentType[] = JSON.parse(v ?? '');
        setProduct(JSONData);
      })
      .catch(e => console.info('<<<<<<<<<<<<< getDataLocal >>>>>>>>>>>>', e));
  };

  const handleBackButton = () => {
    data.navigation.reset({
      index: 0,
      routes: [{name: 'ProductScreen'}],
    });
    return true;
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView>
        {product?.map((item, index) => (
          <ItemProduct
            key={index}
            item={item}
            navigate={data.navigation}
            index={index}
          />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={{padding: 10, backgroundColor: 'teal', alignItems: 'center'}}>
        <Text style={{color: 'white'}}>Checkout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

type ItemType = {
  item: ProductContentType;
  navigate: StackNavigationProp<RootStackParamList>;
  index: number;
};
const ItemProduct = ({item, index, navigate}: ItemType) => {
  const convertRP = (text: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(text);
  };
  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'white',
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        borderRadius: 10,
        elevation: 8,
      }}
      onPress={() => onPushDetail(item, index, navigate)}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: 'teal',
          width: 40,
          height: 40,
          borderRadius: 40,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          {item.chart}
        </Text>
      </View>
      <Image
        source={{
          uri: item.downloadImageUri,
        }}
        style={{
          height: 120,
          width: 120,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          resizeMode: 'contain',
          borderRadius: 10,
        }}
      />
      <View
        style={{
          flex: 1,
          marginHorizontal: 10,
          justifyContent: 'flex-end',
          height: 120,
          paddingBottom: 10,
        }}>
        <Text
          style={{
            fontSize: 18,
          }}>
          {item.productName}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.textPrice}>{convertRP(item.price ?? 0)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const onPushDetail = (
  item: ProductContentType,
  index: number,
  navigate: StackNavigationProp<RootStackParamList>,
) => {
  navigate.push('DetailScreen', {item, index});
};

const styles = StyleSheet.create({
  textPrice: {
    fontSize: 18,
    color: 'teal',
  },
});

export default observer(ChartScreen);
