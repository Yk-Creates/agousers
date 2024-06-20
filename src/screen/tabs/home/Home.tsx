

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const Home = ({navigation}: any) => {
  const [initialLocation, setInitialLocation] = useState({});
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isLocationSelected, setIsLocationSelected] = useState(false);


  const heightAnim = useRef(new Animated.Value(300)).current; // Initial height

  const handleFocus = () => {
    setIsInputFocused(true);
    Animated.timing(heightAnim, {
      toValue: 200,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (!address) {
      setIsInputFocused(false);
      Animated.timing(heightAnim, {
        toValue: 300, // Reset to initial height
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };



  const handlePress = (data, details = null) => {
    if (details) {
      const {lat, lng} = details.geometry.location;
      setInitialLocation(details.geometry.location);
      setAddress(data.description);
      setLatitude(lat);
      setLongitude(lng);
      setIsLocationSelected(true);
      Animated.timing(heightAnim, {
        toValue: 150,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      console.error('Details are null');
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Reset state when the screen is focused
      setInitialLocation({});
      setAddress('');
      setLatitude(null);
      setLongitude(null);
      setIsLocationSelected(false);
      Animated.timing(heightAnim, {
        toValue: 300, // Ensure height resets to 300
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, [heightAnim]),
  );

  return (
    <ImageBackground
      source={require('../../../assets/images/background.png')}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{opacity: 0.2}}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../../../assets/images/ago.png')}
        />
      </View>
      <Animated.View style={[styles.container, {height: heightAnim}]}>
        {/* <TouchableOpacity
          style={{
            width: '100%',
          }}> */}


        <GooglePlacesAutocomplete
          placeholder="Enter start address"
          onPress={handlePress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          query={{
            key: 'AIzaSyC8zy45f-dWZWg0P4A9mGAZjNlMYTnJRvI',
            language: 'en',
          }}
          fetchDetails={true}
          onFail={error => console.error(error)}
          styles={{
            textInputContainer: styles.inputContainer,
            textInput: styles.input,
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          renderLeftButton={() => (
            <Image
              style={styles.searchIcon}
              source={require('../../../assets/images/search.png')}
            />
          )}
        />
        {address && (
          <View style={styles.locationDetails}>
            <Text style={{fontFamily: 'Poppins-Medium'}}>
              Start Address:{' '}
              <Text style={{fontFamily: 'Poppins-Regular'}}>{address}</Text>
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.goButton,
            {backgroundColor: isLocationSelected ? '#340092' : '#ccc'},
          ]}
          onPress={() =>
            navigation.navigate('arrivalhome',  {
              startLat: latitude,
              startLong: longitude,
              startAdd: address,
              // date: date.toLocaleDateString(),
            })
          }
          disabled={!isLocationSelected}>
          <Image
            style={styles.arrowIcon}
            source={require('../../../assets/images/right-arrow-white.png')}
          />
        </TouchableOpacity>
      </Animated.View>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingTop: 15,
    height: 40,
    paddingLeft: 10,
    borderRadius: 5,
    fontFamily: 'Poppins-Medium',
  },
  searchIcon: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  locationDetails: {
    marginTop: 20,
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 150,
    width: 150,
  },
  goButton: {
    position: 'absolute',
    bottom: -30,
    left: '50%',
    marginLeft: -10,
    width: '18%',
    height: 50,
    backgroundColor: '#ccc', // Initial disabled color
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  arrowIcon: {
    width: 25,
    height: 25,
    padding: -60,
  },
});
