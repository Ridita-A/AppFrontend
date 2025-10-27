import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { StyledFauxSearch as Search } from '../../../components/StyledFauxSearch';
import { StyledTitle as Title } from '../../../components/StyledTitle';
import { StyledScrollView as ScrollView } from '../../../components/StyledScrollView';
import { StyledCardButton as Button } from '../../../components/StyledCardButton';
import { StyledText as Text } from '../../../components/StyledText';
import rides from '../../../data/rideData.json';
import users from '../../../data/userData.json';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRide } from '../../../context/RideContext';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyledButton } from '../../../components/StyledButton';
import ProfileImage from '../../../components/ProfileImage';

export default function EditRide() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { setRideData } = useRide();

  const ride = rides.find((r) => r.id === parseInt(id));
  console.log('Ride partners:', ride.partners);
  const [fare, setFare] = useState(ride.fare);
  const [transport, setTransport] = useState(ride.transport);
  const [partners, setPartners] = useState(ride.partners);
  const [showCarOptions, setShowCarOptions] = useState(false);

  const carOptions = ['Uber', 'Pathao', 'Private Car'];

  const findUserByHandle = (handle) => users.find(u => u.handle === handle);

  const [preferences, setPreferences] = useState({
      numPartners: ride.numPartners || 1,
      gender: ride.gender || 'Any',
      otherNotes: ''
    });

  useEffect(() => {
      setPreferences(p => ({ ...p, numPartners: 1 }));
  }, [transport]);

  const maxPartners = transport === 'Car' ? 4 : transport === 'CNG' ? 3 : 10;

  const handleSave = () => {
    //save updated ride data
    let fareValue = fare.toString().trim();
    if (fareValue === '' || isNaN(fareValue) || parseFloat(fareValue) < 0) {
      fareValue = 'TBA';
    } else {
      fareValue = parseFloat(fareValue).toFixed(2);
    }
    console.log("Ride data saved!");
    router.push(`/(dashboard)/(rides)/${id}`);
  };

  const handleRemovePartner = (partnerToRemove) => {
    setPartners(partners.filter(partner => partner.handle !== partnerToRemove.handle));
  };

  const handleAddPartner = () => {
    // For now, just log to console. In a real app, this would navigate to a search screen.
    console.log("Add partner");
  };

  return (
    <ScrollView style={{paddingHorizontal: 20}}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push(`/(dashboard)/(rides)/${id}`)}>
        <FontAwesome style={{marginRight: 10}} name="chevron-left" size={14} color="black" />
        <Text style={{fontSize: 16, fontWeight: 'semibold'}}>Back</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        <Title>Edit your ride</Title>

        <View style={styles.inputContainer}>
          <Text style={styles.formText}>Preferred gender</Text>
          <View style={{ flexDirection: 'row', marginVertical: 5 }}>
            {['Any', 'Male', 'Female'].map(opt => (
              <TouchableOpacity
                key={opt}
                onPress={() => setPreferences(p => ({ ...p, gender: opt }))}
                style={[styles.pill, preferences.gender === opt && styles.pillActive]}>
                <Text style={[styles.pillText, preferences.gender === opt && styles.pillTextActive]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.formText}>Number of ride partners</Text>
          <View style={styles.numericInputContainer}>
            <TouchableOpacity onPress={() => setPreferences(p => ({ ...p, numPartners: Math.max(1, p.numPartners - 1) }))} style={styles.numericButton}>
              <Text style={styles.numericButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.numericValue}>{preferences.numPartners}</Text>
            <TouchableOpacity onPress={() => setPreferences(p => ({ ...p, numPartners: Math.min(maxPartners, p.numPartners + 1 )}))} style={styles.numericButton}>
              <Text style={styles.numericButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.formText}>Transport</Text>
          <Button onPress={() => {setTransport('Car'); setShowCarOptions(!showCarOptions);}} style={transport === 'Car' ? styles.selectedCard : {}}>
            <View style={styles.transportRow}>
              <Text style={styles.transportIcon}>🚗</Text>
              <Text style={styles.transportText}>{carOptions.includes(transport) ? transport : 'Car'}</Text>
              <Ionicons name={showCarOptions ? "chevron-up" : "chevron-down"} size={18} color="black" style={{marginLeft: 'auto'}} />
            </View>
          </Button>
          {showCarOptions && (
            <View style={styles.dropdownContainer}>
              {carOptions.map((option) => (
                <Button key={option} onPress={() => {setTransport(option); setShowCarOptions(false);}} style={transport === option ? styles.selectedCard : {}} >
                  <Text style={styles.transportText}>{option}</Text>
                </Button>
              ))}
            </View>
          )}
          <Button onPress={() => setTransport('CNG')} style={transport === 'CNG' ? styles.selectedCard : {}}>
            <View style={styles.transportRow}>
              <Text style={styles.transportIcon}>🛺</Text>
              <Text style={styles.transportText}>CNG</Text>
            </View>
          </Button>
          <Button onPress={() => setTransport('Bus')} style={transport === 'Bus' ? styles.selectedCard : {}}>
            <View style={styles.transportRow}>
              <Text style={styles.transportIcon}>🚌</Text>
              <Text style={styles.transportText}>Bus</Text>
            </View>
          </Button>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.formText}>Fare</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10,}}>
            <TextInput
              style={styles.fareInput}
              placeholder={ride.fare ? ride.fare.toString() : 'Enter fare...'}
              placeholderTextColor={ride.fare ? '#888' : '#000'}
              keyboardType='numeric'
              value={fare}
              onChangeText={(text) => setFare(text.replace(/[^0-9.]/g, ''))}
            ></TextInput>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.formText}>Other</Text>
          <TextInput
            style={styles.input}
            value={preferences.otherNotes}
            onChangeText={(text) => setPreferences(p => ({ ...p, preferences: text }))}
            placeholder='Add notes (optional)'
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.formText}>Ride passengers</Text>
          {partners.map((partnerData, index) => {
            const partner = findUserByHandle(partnerData.handle);
            return (
              <View key={index} style={styles.creatorContainer}>
                <TouchableOpacity
                  style={styles.creatorRow}
                  onPress={() => router.push(`/user/${partner.handle}`)}
                >
                  <ProfileImage profilePicture={partner.profilePicture} name={partner.name} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
                  <View>
                    <Text style={styles.creatorName}>{partner.name}</Text>
                    <Text style={styles.handle}>{partner.handle}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemovePartner(partner)}>
                  <Ionicons name="remove-circle" size={24} color="#e63e4c" />
                </TouchableOpacity>
              </View>
            );
          })}
          <StyledButton onPress={handleAddPartner} style={{backgroundColor: '#000000', marginTop: 10}} title="Add Partner" />
        </View>

        <View style={styles.buttonContainer}>
          <View style={{flex: 1}}>
            <Button onPress={handleSave}><Text style={{textAlign: 'center'}}>Save</Text></Button>
          </View>
          <View style={{flex: 1}}>
            <Button onPress={() => router.back()} style={{backgroundColor: '#E4E4E4'}}><Text style={{textAlign: 'center'}}>Cancel</Text></Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#fff',
    padding: 14,
    marginVertical: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    gap: 10,
  },
  inputContainer: {
    marginVertical: 10,
  },
  formText: {
    fontSize: 16,
    fontWeight: 'semibold',
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 8,
    backgroundColor: '#fff',
    marginTop: 5
  },
  pillActive: {
    backgroundColor: '#1f1f1f',
    borderColor: '#1f1f1f'
  },
  pillText: {
    fontSize: 14
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: 'bold'
  },
  creatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    width: '70%',
  },
  handle: {
    color: '#888',
    fontSize: 13,
    flex: 1,
  },
  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transportIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  transportText: {
    fontSize: 16,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#1f1f1f',
  },
  numericInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  numericButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  numericButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  numericValue: {
    fontSize: 16,
    marginHorizontal: 15,
  },
  fareInput: {
    width: '50%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular'
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});