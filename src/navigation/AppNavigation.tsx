import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

import ambulance from '../assets/images/ambulance.png';
import cab from '../assets/images/cab.png';
import courier from '../assets/images/courier.png';
import profile from '../assets/images/profile.png';

import Login from '../screen/auth/Login';
import LoginListener from '../screen/auth/LoginListener';
import SignUp from '../screen/auth/Signup';
import Landing from '../screen/landing/Landing';
import ActiveRequests from '../screen/profile/ActiveRequests';
import ActiveRequestsDetails from '../screen/profile/ActiveRequestsDetails';
import RequestsHistory from '../screen/profile/RequestsHistory';
import ArrivalAmbluanceHome from '../screen/tabs/ambulance/ArrivalAmbluanceHome';
import Courier from '../screen/tabs/courier/Courier';
import ArrivalHome from '../screen/tabs/home/ArrivalHome';
import CabPayment from '../screen/tabs/home/CabPayment';
import Profile from '../screen/tabs/profile/Profile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#919191',
        tabBarStyle: styles.tabBarStyle,
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'Cab') {
            iconName = cab;
          } else if (route.name === 'Ambulance') {
            iconName = ambulance;
          } else if (route.name === 'Courier') {
            iconName = courier;
          } else if (route.name === 'Profile') {
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
      <Tab.Screen name="Cab" component={ArrivalHome} options={{headerShown: false}} />
      <Tab.Screen
        name="Ambulance"
        component={ArrivalAmbluanceHome}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Courier"
        component={Courier}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Profile"
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
      <Stack.Screen
        name="arrivalhome"
        component={ArrivalHome}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="cabpayments"
        component={CabPayment}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen name="active-requests" component={ActiveRequests} />
      <Stack.Screen
        name="active-requests-details"
        component={ActiveRequestsDetails}
      />
      <Stack.Screen name="request-history" component={RequestsHistory} />
      <Stack.Screen
        name="arrival-ambulance-home"
        component={ArrivalAmbluanceHome}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#1B2024',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabBarIconStyle: {},
});
