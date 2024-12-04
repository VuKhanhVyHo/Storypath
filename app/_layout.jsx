import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useUsername, UsernameProvider } from './usernameContext'; // Use the context
import { useProjectId, IdProvider } from './projectContext';

// Custom Drawer Content Component
const CustomDrawerContent = (props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { username } = useUsername();
  const {project_id} = useProjectId();

  useEffect(() => {
    console.log('Current Path', pathname);
  }, [pathname]);

  return (
    <DrawerContentScrollView {...props}>
      {/* User Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.currentUser}>Current User: {username}</Text>
      </View>

      {/* Drawer Items */}
      <DrawerItem
        icon={({ color, size }) => (
          <Feather name="home" size={size} color={pathname === '/' ? '#fff' : '#000'} />
        )}
        label={'Welcome'}
        labelStyle={[styles.navItemLabel, { color: pathname === '/' ? '#fff' : '#000' }]}
        style={{ backgroundColor: pathname === '/' ? '#FF6F61' : '#fff' }} // Changed color to match screenshot
        onPress={() => router.push('/')}
      />

      <DrawerItem
        icon={({ color, size }) => (
          <FontAwesome name="user" size={size} color={pathname === '/profile' ? '#fff' : '#000'} />
        )}
        label={'Profile'}
        labelStyle={[styles.navItemLabel, { color: pathname === '/profile' ? '#fff' : '#000' }]}
        style={{ backgroundColor: pathname === '/profile' ? '#FF6F61' : '#fff' }} // Changed color to match screenshot
        onPress={() => router.push('/profile')}
      />

      <DrawerItem
        icon={({ color, size }) => (
          <MaterialIcons name="work" size={size} color={pathname === '/projects' ? '#fff' : '#000'} />
        )}
        label={'Projects'}
        labelStyle={[styles.navItemLabel, { color: pathname === '/projects' ? '#fff' : '#000' }]}
        style={{ backgroundColor: pathname === '/projects' ? '#FF6F61' : '#fff' }} // Changed color to match screenshot
        onPress={() => router.push('/projects')}
      />

      <DrawerItem
        icon={({ color, size }) => (
          <Feather name="info" size={size} color={pathname === '/Help' ? '#fff' : '#000'} />
        )}
        label={'Help'}
        labelStyle={[styles.navItemLabel, { color: pathname === '/Help' ? '#fff' : '#000' }]}
        style={{ backgroundColor: pathname === '/Help' ? '#FF6F61' : '#fff' }} // Changed color to match screenshot
        onPress={() => router.push('/Help')}
      />
    </DrawerContentScrollView>
  );
};

// Main Layout with Drawer
export default function Layout() {
  const { username, setUsername } = useUsername();

  useEffect(() => {
    setUsername('participant_username'); // Set initial username
  }, []);

  return (
    <IdProvider>
    <UsernameProvider>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} username={username} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="index" options={{ headerShown: true, headerTitle: 'Welcome' }} />
        <Drawer.Screen name="Help" options={{ headerShown: true, headerTitle: '' }} />
        <Drawer.Screen name="profile" options={{ headerShown: true, headerTitle: 'Profile' }} />
        <Drawer.Screen name="projects" options={{ headerShown: true, headerTitle: 'Projects' }} />
      </Drawer>
    </UsernameProvider>
    </IdProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  infoContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  currentUser: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6F61', // Updated to match screenshot color scheme
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#FF6F61', // Updated button color to match screenshot
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
