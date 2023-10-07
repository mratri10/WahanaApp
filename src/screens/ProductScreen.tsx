import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
  Dimensions,
  StyleSheet,
  TextInput,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {toJS} from 'mobx';
import {useStore} from '../store';
import {ProductContentType, ProductType} from '../store/ProductStore';
import {PropScreen, RootStackParamList} from '../../route';
import {StackNavigationProp} from '@react-navigation/stack';
import {getChartStorage} from '../utils/asyncstorage';
import {cartIcon, searchIcon} from '../utils/imagelocal';

const {width} = Dimensions.get('screen');

function ProductScreen({navigation}: PropScreen) {
  const [initproduct, setInitProduct] = useState<ProductContentType[]>([]);
  const [product, setProduct] = useState<ProductContentType[]>([]);
  const productStore = useStore('productStore');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadDataProduct();
  }, []);

  useEffect(() => {
    getDataProduct();
  }, [productStore.dataProduct]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [navigation]);

  const handleBackButton = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'ProductScreen'}],
    });
    return true;
  };

  const loadDataProduct = async () => {
    await productStore.getDataProduct();
    await getChartStorage();
  };
  const getDataProduct = () => {
    const _data = productStore.dataProduct;
    const db = toJS(_data);
    setInitProduct(db.message?.content ?? []);
    setProduct(db.message?.content ?? []);
  };
  const handleSearch = (event: string) => {
    if (event.length > 0) {
      console.log(event);
      const db = initproduct.filter(item =>
        item.productName?.toLowerCase().includes(event.toLocaleLowerCase()),
      );
      setProduct(db);
    } else {
      setProduct(initproduct);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#E3E3E3'}}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          alignItems: 'center',
          padding: 10,
          marginBottom: 12,
        }}>
        <View style={styles.inputSearch}>
          <Image source={searchIcon} style={styles.iconSearch} />
          <TextInput placeholder="Cari Produck" onChangeText={handleSearch} />
        </View>
        <TouchableOpacity
          onPress={() => navigation.push('ChartScreen')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: 40,
            height: 40,
          }}>
          <Image source={cartIcon} style={styles.iconCart} />
          {productStore.dataProductLocal.length ? (
            <Text style={styles.numCart}>
              {productStore.dataProductLocal.length}
            </Text>
          ) : (
            <View />
          )}
        </TouchableOpacity>
      </View>
      <FlatList
        data={product}
        numColumns={2}
        ItemSeparatorComponent={separatorComponent}
        contentContainerStyle={{marginRight: 12}}
        renderItem={({item, index}) => (
          <ItemProduct
            key={index}
            item={item}
            navigate={navigation}
            index={index}
          />
        )}
      />
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
      style={styles.itemContent}
      onPress={() => onPushDetail(item, index, navigate)}>
      <Image
        source={{
          uri: item.downloadImageUri,
        }}
        style={styles.itemImages}
      />
      <View style={{margin: 5}}>
        <Text style={styles.itemText}>{item.productName}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 10,
          }}>
          <Text style={styles.textPrice}>{convertRP(item.price ?? 0)}</Text>
          <Text style={styles.textStock}>{item.stock} stock</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const separatorComponent = () => <View style={styles.itemSeparator} />;

const onPushDetail = (
  item: ProductContentType,
  index: number,
  navigate: StackNavigationProp<RootStackParamList>,
) => {
  navigate.push('DetailScreen', {item, index});
};

const styles = StyleSheet.create({
  itemContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: width / 2 - 18,
    marginLeft: 12,
  },
  itemSeparator: {
    width: 0,
    height: 10,
  },
  itemImages: {
    height: width / 2,
    width: width / 2 - 18,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  itemText: {
    borderRadius: 10,
    fontSize: 18,
    color: 'black',
  },
  textPrice: {
    fontSize: 18,
    color: 'teal',
  },
  textStock: {
    fontSize: 11,
    color: 'black',
  },
  iconSearch: {
    width: 20,
    height: 20,
    tintColor: 'black',
  },
  iconCart: {
    width: 30,
    height: 30,
    tintColor: 'teal',
  },
  inputSearch: {
    flex: 1,
    backgroundColor: '#e3e3e3',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: 20,
  },
  numCart: {
    fontWeight: 'bold',
    fontSize: 11,
    color: 'white',
    backgroundColor: 'teal',
    borderRadius: 40,
    width: 20,
    height: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default observer(ProductScreen);
