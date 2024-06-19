import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Login from '../screen/auth/Login';
import SignUp from '../screen/auth/Signup';
import Landing from '../screen/landing/Landing';
import Home from '../screen/tabs/Home';
import LoginListener from '../screen/auth/LoginListener';
import Ambulance from '../screen/tabs/Ambulance';
import Courier from '../screen/tabs/Courier';
import Profile from '../screen/tabs/Profile';
import cab from '../assets/images/cab.png';
import ambulance from '../assets/images/ambulance.png';
import courier from '../assets/images/courier.png';
import profile from '../assets/images/profile.png';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#919191',
        tabBarStyle: styles.tabBarStyle,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'home') {
            iconName = cab;
          } else if (route.name === 'ambulance') {
            iconName = ambulance;
          } else if (route.name === 'courier') {
            iconName = courier;
          } else if (route.name === 'profile') {
            iconName = profile;
          }

          return (
            <Image
              source={iconName}
              style={[
                styles.tabBarIconStyle,
                {tintColor: color, width: size, height: size},
              ]}
            />
          );
        },
      })}>
      <Tab.Screen name="home" component={Home} options={{headerShown: false}} />
      <Tab.Screen
        name="ambulance"
        component={Ambulance}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="courier"
        component={Courier}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

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
      <Stack.Screen name="hometab" component={HomeTabs} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#340092',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabBarIconStyle: {},
});
