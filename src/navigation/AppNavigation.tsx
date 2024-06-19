import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Login from '../screen/auth/Login';
import SignUp from '../screen/auth/Signup';
import Landing from '../screen/landing/Landing';
import Home from '../screen/tabs/Home';
import LoginListener from '../screen/auth/LoginListener';

const Stack = createStackNavigator();
export default function AppNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="check" component={LoginListener} />
      <Stack.Screen name="landing" component={Landing} />
      <Stack.Screen name="register" component={SignUp} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="home" component={Home} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
