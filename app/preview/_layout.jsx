import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

/**
 * Tabs are for homscreen, map and qrscanner. 
 * @returns 
 */
export default function PreviewTabs() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6F61',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      {/* Tab for the dynamic [id] route */}
      <Tabs.Screen
        name="[id]"
        options={{
          tabBarIcon: ({ color }) => <Feather name="list" size={24} color={color} />,
          tabBarLabel: 'Project Home',
          headerTitle: 'Project Home',
        }}
      />

      {/* Tab for the map view */}
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ color }) => <Feather name="map-pin" size={24} color={color} />,
          tabBarLabel: 'Map',
          headerTitle: 'Map View',
        }}
      />

      {/* Tab for the QR Scanner */}
      <Tabs.Screen
        name="qrScanner"
        options={{
          tabBarIcon: ({ color }) => <Feather name="camera" size={24} color={color} />,
          tabBarLabel: 'QR Scanner',
          headerTitle: 'QR Code Scanner',
        }}
      />
    </Tabs>
  );
}
