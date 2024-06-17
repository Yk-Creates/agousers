import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigation from './src/navigation/AppNavigation';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
const queryClient = new QueryClient();
const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </QueryClientProvider>
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
