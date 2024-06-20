import React, {useState, useRef} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  ImageBackground,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const ArrivalHome = ({route, navigation}) => {
  const {startLat, startLong, startAdd} = route.params;
  const [endAddress, setEndAddress] = useState('');
  const [endLatitude, setEndLatitude] = useState(null);
  const [endLongitude, setEndLongitude] = useState(null);
  const [isEndLocationSelected, setIsEndLocationSelected] = useState(false);
  const heightAnim = useRef(new Animated.Value(400)).current;

  const handleEndFocus = () => {
    Animated.timing(heightAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleEndBlur = () => {
    if (!endAddress) {
      Animated.timing(heightAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleEndPress = (data, details = null) => {
    if (details) {
      const {lat, lng} = details.geometry.location;
      setEndAddress(data.description);
      setEndLatitude(lat);
      setEndLongitude(lng);
      setIsEndLocationSelected(true);
      Animated.timing(heightAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      console.error('Details are null');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.backgroundImage}
        imageStyle={{opacity: 0.2}}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center', gap: 5}}
            onPress={() => navigation.goBack()}>
            <Image
              style={styles.backIcon}
              source={require('../../../assets/images/back-stick.png')}
            />
            <Text style={styles.headerText}>back</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Set Arrival Location</Text>
        </View>
        <View style={styles.content}>
          <Animated.View style={[styles.container, {height: heightAnim}]}>
            <View
              style={{
                width: '100%',
                borderWidth: 1,
                padding: 12,
                borderRadius: 15,
                paddingHorizontal: 10,
                flexDirection: 'row',
                gap: 10,
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/images/search.png')}
              />
              <Text style={{fontFamily: 'Poppins-Medium', color: 'black'}}>
                {startAdd.length > 20
                  ? `${startAdd.substring(0, 20)}...`
                  : startAdd}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 15,
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'space-between',
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/images/dots.png')}
              />
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/images/dots.png')}
              />
            </View>
            <GooglePlacesAutocomplete
              placeholder="Enter end address"
              onPress={handleEndPress}
              onFocus={handleEndFocus}
              onBlur={handleEndBlur}
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
            {endAddress && (
              <View style={styles.locationDetails}>
                <Text style={{fontFamily: 'Poppins-Medium'}}>
                  End Address:{' '}
                  <Text style={{fontFamily: 'Poppins-Regular'}}>
                    {' '}
                    {endAddress}
                  </Text>
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={[
                styles.goButton,
                {backgroundColor: isEndLocationSelected ? '#340092' : '#ccc'},
              ]}
              onPress={() => {
                // Handle the next step with start and end locations
              }}
              disabled={!isEndLocationSelected}>
              <Image
                style={styles.arrowIcon}
                source={require('../../../assets/images/right-arrow-white.png')}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ArrivalHome;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 30,
    alignItems: 'center',
  },
  backIcon: {
    width: 15,
    height: 15,
  },
  headerText: {
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: 17,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  goButton: {
    position: 'absolute',
    bottom: -30,
    left: '50%',
    marginLeft: -10,
    width: '18%',
    height: 50,
    backgroundColor: '#ccc',
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
  addressDetails: {
    padding: 20,
    alignItems: 'center',
  },
});
