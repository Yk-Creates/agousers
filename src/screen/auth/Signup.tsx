import { useState } from 'react';
import {
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
import useSignup from '../../hooks/useSignup';


const SignUp = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { mutate: signup, isError, error , isPending,} = useSignup();

  const handleSubmit = () => {
    console.log("Submitting signup with data:", { name, phoneNo, password });
    signup(
      { name, phoneNo, password },
      {
        onSuccess: () => {
          console.log("Signup successful");
          navigation.replace('home');
        },
        onError: (error) => {
          console.error("Signup failed with error:", error);
        },
      }
    );
  };
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={{margin: 20}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                style={{width: 25, height: 25}}
                source={require('../../assets/images/back.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{margin: 10, marginHorizontal: 30}}>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 25,
                color: 'black',
              }}>
              Let's Get Started!
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 12,
                color: 'black',
              }}>
              Fill the form to continue
            </Text>
          </View>
          {/* login fields */}
          <View style={{flex: 1, alignContent: 'center', marginTop: 60}}>
            <View style={[styles.inputContainer, {marginTop: 10}]}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                placeholder="Enter Name"
                placeholderTextColor={'#868585'}
                style={styles.input}
                value={name}
                onChangeText={setName}
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
          onPress={handleSubmit}
            style={[styles.loginButton, {backgroundColor: 'black'}]}
            
            >
            <Text style={{fontFamily: 'Poppins-Medium', color: 'white'}}>
              Register
            </Text>
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
          <Text style={{fontFamily: 'Poppins-Medium'}}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('login')}>
            <Text style={{fontFamily: 'Poppins-Bold'}}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 30,
    // marginVertical: 7,
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
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B8B8B8',
    borderRadius: 10,
    paddingRight: 10,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginButton: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    // marginTop: 10,
  },
  register: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
    // marginTop: 10,
  },
});
