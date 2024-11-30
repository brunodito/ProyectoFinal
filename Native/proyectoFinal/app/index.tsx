import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import FeedPage from './FeedPage'; // Asegúrate de importar el componente FeedPage

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Feed: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen 
                name="Login" 
                component={LoginPage} 
                options={{ title: 'Iniciar Sesión' }} 
            />
            <Stack.Screen 
                name="Register" 
                component={RegisterPage} 
                options={{ title: 'Registrarse' }} 
            />
            <Stack.Screen 
                name="Feed" 
                component={FeedPage} 
                options={{ title: 'Feed' }} 
            />
        </Stack.Navigator>
    );
};

export default App;
