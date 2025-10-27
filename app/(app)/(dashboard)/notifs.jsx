import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { StyledText as Text } from '../../../components/StyledText';
import { StyledCardButton as CardButton } from '../../../components/StyledCardButton';
import { StyledScrollView as ScrollView } from '../../../components/StyledScrollView';
import React, { useState } from 'react';
import notifications from '../../../data/notificationData.json';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';



function NotificationsTab() {
  const [notificationData, setNotificationData] = useState(notifications);

  const handleAccept = (id) => {
    setNotificationData((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, status: 'accepted' } : notif
      )
    );
  };

  const handleDecline = (id) => {
    setNotificationData((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, status: 'declined' } : notif
      )
    );
  };

  const handleRemove = (id) => {
    setNotificationData((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return '#4CAF50';
      case 'declined':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      default:
        return 'Pending';
    }
  };

  // Empty state fallback 
  if (notificationData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Notifications</Text>
        <Text style={styles.emptySubText}>You're all caught up!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      
      {notificationData.map((notification) => (
        <CardButton key={notification.id}>
          <View style={styles.notificationContent}>
            {/* Header */}
            <View style={styles.notificationHeader}>
              <View style={styles.headerLeft}>
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
                <Text style={styles.timestamp}>{notification.timestamp}</Text>
              </View>
              <TouchableOpacity
                style={styles.crossButton}
                onPress={() => handleRemove(notification.id)}
              >
                <Text style={styles.crossButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Ride Info */}
            <View style={styles.rideInfo}>
              <Text style={styles.rideDestination}>
                📍 {notification.ride.destination}
              </Text>
              <Text style={styles.rideDetails}>
                {notification.ride.transport} • {notification.ride.date} •{' '}
                {notification.ride.time}
              </Text>
            </View>

            {/* Action or Status */}
            {notification.status === 'pending' ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={() => handleAccept(notification.id)}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.declineButton]}
                  onPress={() => handleDecline(notification.id)}
                >
                  <Text style={styles.declineButtonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.statusContainer}>
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(notification.status) },
                  ]}
                >
                  {getStatusText(notification.status)}
                </Text>
              </View>
            )}
          </View>
        </CardButton>
      ))}
    </ScrollView>
  );
};

function ChatsTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.text}>Chats</Text>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function NotificationScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 15, fontWeight: '600' },
        tabBarIndicatorStyle: { backgroundColor: '#000000ff', height: 3 },
        tabBarActiveTintColor: '#000000ff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#f8f8f8' },
      }}
    >
      <Tab.Screen name="Notifications" component={NotificationsTab} />
      <Tab.Screen name="Chats" component={ChatsTab} />
    </Tab.Navigator>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 10,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 15,
    marginBottom: 20,
  },
  notificationContent: {
    width: '100%',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 10,
  },
  notificationMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  rideInfo: {
    marginBottom: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  rideDestination: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rideDetails: {
    fontSize: 12,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  declineButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  crossButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  // ✅ Empty state styles (from first version)
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 6,
  },

  //Tabs
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
  },
});



