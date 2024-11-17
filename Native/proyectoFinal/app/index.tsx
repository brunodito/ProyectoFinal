import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Feed: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Register" component={RegisterPage} />
        </Stack.Navigator>
    );
};

export default App;
