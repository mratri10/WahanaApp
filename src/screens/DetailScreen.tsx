import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {PropScreen, RootStackParamList} from '../../route';
import productStore, {ProductContentType} from '../store/ProductStore';
import {
  deleteChartStorage,
  getChartStorage,
  setChartStorage,
} from '../utils/asyncstorage';
import {StackNavigationProp} from '@react-navigation/stack';
import {cartIcon, closeIcon} from '../utils/imagelocal';

const {width, height} = Dimensions.get('screen');

function DetailScreen(data: PropScreen) {
  const itemData: ProductContentType = data.route.params.item;
  const indexData: number = data.route.params.index;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <ItemProduct item={itemData} index={indexData} />
      <ItemCalculate
        item={itemData}
        index={indexData}
        navigation={data.navigation}
      />
    </View>
  );
}

type ItemType = {
  item: ProductContentType;
  index: number;
};
const ItemProduct = ({item, index}: ItemType) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count < 0 || count == null || count == undefined) {
      setCount(0);
    }
  }, [count]);
  return (
    <View style={styles.content}>
      <Image
        source={{
          uri: item.downloadImageUri,
        }}
        style={{
          height: width - 100,
          width: width,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          resizeMode: 'contain',
          borderRadius: 10,
        }}
      />
      <View style={styles.divider} />
    </View>
  );
};

type TypeCalculate = {
  item: ProductContentType;
  index: number;
  navigation: StackNavigationProp<RootStackParamList>;
};
const ItemCalculate = ({item, navigation, index}: TypeCalculate) => {
  const [chart, setChart] = useState<number>();
  const [newProduct, setNewProduct] = useState<ProductContentType[]>();
  const [itemChart, setItemChart] = useState<ProductContentType>();

  useEffect(() => {
    getDataLocal();
  }, []);

  const getDataLocal = () => {
    getChartStorage()
      .then(v => {
        const JSONData: ProductContentType[] = JSON.parse(v ?? '');
        itemDataLocal(JSONData);
        setNewProduct(JSONData);
      })
      .catch(e => console.info('<<<<<<<<<<<<< getDataLocal >>>>>>>>>>>>', e));
  };
  const itemDataLocal = (data: ProductContentType[]) => {
    const newItem = data?.filter(i => i.id == item.id)[0];
    setChart(newItem?.chart);
    setItemChart(newItem);
  };

  const amount = (isPlus: boolean) => {
    const newChart = chart ?? 0;
    if (isPlus) {
      setChart(newChart + 1);
    } else if (newChart != 0) {
      setChart(newChart - 1);
      if (newChart == 1 && itemChart) {
        Alert.alert(
          'Hapus Product',
          'Apakah Kamu Yakin Hapus Product Ini dari Keranjang',
          [
            {text: 'Ya', onPress: onChartDelete},
            {text: 'Tidak', onPress: () => setChart(1)},
          ],
        );
      }
    }
  };
  const onChart = () => {
    item.chart = chart;
    setChartStorage(newProduct ?? [], item);

    Alert.alert(
      'Berhasil Masuk Keranjang',
      'Apakah Anda ingin pilih produk Lainnya',
      [
        {text: 'Ya', onPress: () => navigation.push('ProductScreen')},
        {text: 'Tidak', onPress: () => navigation.push('ChartScreen')},
      ],
    );
  };

  const btnDeleteChart = () => {
    Alert.alert(
      'Hapus Product',
      'Apakah Kamu Yakin Hapus Product Ini dari Keranjang',
      [{text: 'Ya', onPress: onChartDelete}, {text: 'Tidak'}],
    );
  };

  const onChartDelete = () => {
    item.chart = chart;
    deleteChartStorage(newProduct ?? [], item);
    setChart(0);
    navigation.reset({
      index: 0,
      routes: [{name: 'ProductScreen'}],
    });
  };
  const isChart = () => {
    return chart ?? 0;
  };
  return (
    <View style={styles.itemCal}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.productName}>{item.productName}</Text>
        <View style={styles.itemCalRow}>
          <TouchableOpacity
            style={styles.btnCount}
            onPress={() => amount(false)}>
            <Text style={styles.txtCount}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.inputCount}
            placeholder="0"
            keyboardType="numeric"
            value={chart ? chart?.toString() : ''}
            onChangeText={text => setChart(parseInt(text))}
          />
          <TouchableOpacity
            style={styles.btnCount}
            onPress={() => amount(true)}>
            <Text style={styles.txtCount}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 1}} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={[
            styles.btnChart,
            {backgroundColor: isChart() == 0 ? 'grey' : 'orange'},
          ]}
          onPress={isChart() != 0 ? btnDeleteChart : () => {}}>
          <Image source={closeIcon} style={styles.imageBTN} />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center',
            fontSize: 18,
          }}>
          {convertRP((item.price ?? 0) * (chart ?? 0))}
        </Text>
        <TouchableOpacity
          style={[
            styles.btnChart,
            {backgroundColor: isChart() == 0 ? 'grey' : 'teal'},
          ]}
          onPress={isChart() != 0 ? onChart : () => {}}>
          <Image source={cartIcon} style={styles.imageBTN} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const convertRP = (text: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(text);
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
  },
  itemCal: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
  },
  itemCalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnChart: {
    padding: 10,
    backgroundColor: 'teal',
    borderRadius: 8,
  },
  textChart: {
    color: 'white',
  },
  btnCount: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: 'teal',
    borderRadius: 8,
  },
  txtCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  inputCount: {
    width: 50,
    textAlign: 'center',
  },
  productName: {
    borderRadius: 10,
    fontSize: 18,
    color: 'black',
    margin: 20,
    flex: 1,
  },
  divider: {
    width: width,
    backgroundColor: '#3e3e3e',
    height: 4,
  },
  imageBTN: {
    width: 30,
    height: 30,
    alignItems: 'center',
    tintColor: 'white',
  },
});
export default DetailScreen;
