import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { StyledTitle as Title } from '../../../components/StyledTitle'
import { StyledScrollView as ScrollView } from '../../../components/StyledScrollView'
import { StyledButton as Button } from '../../../components/StyledButton'
import MapSearchWrapper from '../../../components/MapSearchWrapper'
import { useRouter } from 'expo-router'
import { useRide } from '../../../context/RideContext'


export default function ChooseDest() {
  const router = useRouter()
  const [selectedPlace, setSelectedPlace] = useState(null)
  const { setRideData } = useRide();

  const handlePlaceSelected = (place) => {
    setSelectedPlace(place);
    setRideData(prevDetails => ({ ...prevDetails, destination: { name: place.formatted_address, coords: place.geometry.location } }));
  }

  return (
    <ScrollView>
      <Title>Select destination</Title>

      <MapSearchWrapper onPlaceSelected={handlePlaceSelected} searchQuery={selectedPlace?.formatted_address} style={{width: '100%'}}  />

        
      <View style={styles.buttonRow}>
        <Button
          title='Back'
          onPress={() => router.back()}
          style={{ width: '30%' }}
        ></Button>
        {selectedPlace && (
        <Button
          title='Next'
          onPress={() =>
            router.push('/(createRide)/timeDetails')
        }
        style={{width: '30%'}}>
        </Button>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto', 
    marginTop: 15,
    width: '100%',
  },
  rideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    flex: 1,
  },
  rideText: {
    fontSize: 14,
    flex: 1,
  },
  icon: {
    marginRight: 10
  }
});