import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Login from '../screen/auth/Login';
import SignUp from '../screen/auth/Signup';
import Landing from '../screen/landing/Landing';

const Stack = createStackNavigator();
export default function AppNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="landing" component={Landing} />
      <Stack.Screen name="signup" component={SignUp} />
      <Stack.Screen name="login" component={Login} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
