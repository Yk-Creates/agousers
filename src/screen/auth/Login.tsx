import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import useLogin from '../../hooks/useLogin';

const Login = ({navigation}: any) => {
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {mutate: login, isPending, isError, error} = useLogin();

  const handleSubmit = () => {
    login(
      {phoneNo, password},
      {
        onSuccess: () => {
          navigation.replace('home');
        },
      },
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={{margin: 20}}>
            <TouchableOpacity onPress={() => navigation.navigate('landing')}>
              <Image
                style={{width: 25, height: 25}}
                source={require('../../assets/images/back.png')}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
            <View style={{margin: 10}}>
              <Image
                resizeMode="contain"
                style={{width: 'auto', height: 280}}
                source={require('../../assets/images/login.png')}
              />
            </View>
            <View style={[styles.inputContainer, {marginTop: 10}]}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                placeholder="Enter phone number"
                placeholderTextColor={'#868585'}
                style={styles.input}
                value={phoneNo}
                onChangeText={setPhoneNo}
                keyboardType="phone-pad"
              />
            </View>
            <View style={[styles.inputContainer, {marginTop: 10}]}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Enter Password"
                  placeholderTextColor={'#868585'}
                  style={[styles.input, {flex: 1, borderWidth: 0}]}
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={{marginLeft: 10}}>
                  {passwordVisible ? (
                    <Image
                      resizeMode="contain"
                      style={{width: 20, height: 20}}
                      source={require('../../assets/images/hide.png')}
                    />
                  ) : (
                    <Image
                      resizeMode="contain"
                      style={{width: 20, height: 20}}
                      source={require('../../assets/images/visible.png')}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={{margin: 20}}>
          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                backgroundColor: 'black',
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
            onPress={handleSubmit}
            disabled={isPending}>
            {isPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={{fontFamily: 'Poppins-Medium', color: 'white'}}>
                Log in
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.register,
            {
              paddingBottom: 30,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 7,
            },
          ]}>
          <Text style={{fontFamily: 'Poppins-Medium', color: 'black'}}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('register')}>
            <Text style={{fontFamily: 'Poppins-Bold', color: 'black'}}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 30,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B8B8B8',
    borderRadius: 10,
    fontFamily: 'Poppins-Medium',
    padding: 10,
    paddingHorizontal: 15,
    color: 'black',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B8B8B8',
    borderRadius: 10,
    paddingRight: 10,
  },
  loginButton: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  register: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
});
