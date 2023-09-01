import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {toJS} from 'mobx';
import {useStore} from '../store';
import {ProductContentType, ProductType} from '../store/ProductStore';

function ProductScreen() {
  const [product, setProduct] = useState<ProductType>();
  const [db, setDB] = useState<ProductContentType[]>([]);

  const productStore = useStore('productStore');

  useEffect(() => {
    loadDataProduct();
  }, []);

  useEffect(() => {
    getDataProduct();
  }, [productStore.dataProduct]);

  const loadDataProduct = async () => {
    await productStore.getDataProduct();
  };
  const getDataProduct = () => {
    const _data = productStore.dataProduct;
    setProduct(toJS(_data));
  };

  const updateData = (item: ProductContentType) => {
    // console.log('++++++++++++ ', item);
    const newDB = [...new Set([...db, item])];
    setDB(newDB);
  };
  return (
    <View style={{flex: 1, backgroundColor: '#ddd'}}>
      <FlatList
        data={product?.message?.content}
        renderItem={({item, index}) => {
          return (
            <ItemProduct item={item} index={index} onChange={updateData} />
          );
        }}
      />
      <TouchableOpacity
        onPress={() => console.log('++++++++++++++++ ', db)}
        style={{
          backgroundColor: 'blue',
          margin: 20,
          alignItems: 'center',
          padding: 15,
          borderRadius: 10,
        }}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>Kirim</Text>
      </TouchableOpacity>
    </View>
  );
}
type ItemType = {
  item: ProductContentType;
  index: number;
  onChange: (v: ProductContentType) => void;
};
const ItemProduct = ({item, index, onChange}: ItemType) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count < 0 || count == null || count == undefined) {
      setCount(0);
    }
  }, [count]);
  return (
    <View
      style={{
        backgroundColor: 'white',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Image
        source={{
          uri: item.downloadImageUri,
        }}
        style={{
          height: 120,
          width: 120,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
        }}
      />
      <View style={{flex: 1, margin: 10}}>
        <TextInput
          style={{borderRadius: 10, borderWidth: 1, textAlign: 'center'}}
          placeholder="Masukan Nama Barang"
          onChangeText={text => {
            item.title = text;
            onChange(item);
          }}
        />
        <Text style={{marginTop: 10}}>Jumlah</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.buttonCount}
            onPress={() => {
              item.count = count + 1;
              setCount(count + 1);
              onChange(item);
            }}>
            <Text style={styles.textButton}>+</Text>
          </TouchableOpacity>
          <TextInput
            style={{
              borderRadius: 10,
              borderWidth: 1,
              textAlign: 'center',
              flex: 1,
              marginHorizontal: 10,
            }}
            value={count.toString()}
            placeholder="0"
            keyboardType="numeric"
            onChangeText={v => {
              if (v.length > 0) {
                item.count = parseInt(v);
                setCount(parseInt(v));
                onChange(item);
              } else {
                item.count = 0;
                setCount(0);
                onChange(item);
              }
            }}
          />
          <TouchableOpacity
            style={styles.buttonCount}
            onPress={() => {
              item.count = count - 1;
              setCount(count + -1);
              onChange(item);
            }}>
            <Text style={styles.textButton}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textButton: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonCount: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default observer(ProductScreen);
