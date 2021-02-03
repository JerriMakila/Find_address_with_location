import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, View, TextInput, Button, Alert, Text } from 'react-native';
import Mapview, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  
  const [coordinates, setCoordinates] = useState({
    longitude: 0,
    latitude: 0,
    title: ''
  });

  const fetchData = async () => {
    const addressString = address.toLowerCase().replace(" ", "+");

    try{
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${addressString}&key=`);
      const data = await response.json();

      if(data.results.length > 0){
        setCoordinates({
          longitude: data.results[0].geometry.location.lng,
          latitude: data.results[0].geometry.location.lat,
          title: data.results[0].formatted_address
        });

        setMessage('');
      } else {
        setMessage('The address was not found');
      }
    } catch(error){
      Alert.alert(error);
    }
  }

  useEffect(() => {
    const getLocation = async () => {
      let {status} = await Location.requestPermissionsAsync();

      if(status !== 'granted'){
        Alert.alert('No permission to access location');
      } else {
        let location = await Location.getCurrentPositionAsync({});
        setCoordinates({
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
          title: 'Your location'
        });
      }
    }
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Mapview
        style={styles.mapView}
        region={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.0100,
          longitudeDelta: 0.0060
        }}>
        <Marker
          coordinate={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
          }}
          title={coordinates.title} />
      </Mapview>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={address}
          onChangeText={address => setAddress(address)} />
        <Button onPress={fetchData} title='SHOW' />
        <View><Text style={{fontSize: 25}}>{message}</Text></View>
      </View>
      <StatusBar hidden={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-around',
    paddingBottom: 10
  },

  mapView: {
    flex: 5,
    height: '100%',
    width: '100%'
  },

  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    fontSize: 25,
    height: 35,
    paddingHorizontal:5,
    width: 250,
  }
});
