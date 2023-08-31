import { NavigationContainer } from "@react-navigation/native"
import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack"
import ProductScreen from "./src/screens/ProductScreen"
import DetailScreen from "./src/screens/DetailScreen"

export type RootStackParamList = {
    ProductScreen: undefined,
    DetailScreen: undefined
}

export type PropScreen = {
    navigation: StackNavigationProp<RootStackParamList>
}

function RouteApp() {
    const Stack = createStackNavigator<RootStackParamList>();
    return (
        <>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="ProductScreen">
                    <Stack.Screen
                        name="ProductScreen"
                        component={ProductScreen} />
                    <Stack.Screen
                        name="DetailScreen"
                        component={DetailScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}

export default RouteApp