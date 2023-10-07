import {NavigationContainer} from '@react-navigation/native';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import ProductScreen from './src/screens/ProductScreen';
import DetailScreen from './src/screens/DetailScreen';
import {ProductContentType} from './src/store/ProductStore';
import ChartScreen from './src/screens/ChartScreen';

export type RootStackParamList = {
  ProductScreen: undefined;
  DetailScreen: {item: ProductContentType; index: number};
  ChartScreen: undefined;
};

export type PropScreen = {
  route: any;
  navigation: StackNavigationProp<RootStackParamList>;
};

function RouteApp() {
  const Stack = createStackNavigator<RootStackParamList>();
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ProductScreen">
          <Stack.Screen
            name="ProductScreen"
            component={ProductScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DetailScreen"
            component={DetailScreen}
            options={{headerTitle: 'Detail Produk'}}
          />
          <Stack.Screen
            name="ChartScreen"
            component={ChartScreen}
            options={{headerTitle: 'Keranjang '}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default RouteApp;
