import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to StoryPath</Text>
        <Text style={styles.subheadingText}>
          Explore Unlimited Location-based Experiences
        </Text>
      </View>

      {/* Description Section */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          With StoryPath, you can discover and create amazing location-based adventures.
          From city tours to treasure hunts, the possibilities are endless!
        </Text>
        <Text style={styles.help}>
          Plese go to Help in case you need more instructions!
        </Text>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.buttonText}>CREATE PROFILE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/projects')}
        >
          <Text style={styles.buttonText}>EXPLORE PROJECTS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/Help')}
        >
          <Text style={styles.buttonText}>HELP & INSTRUCTIONS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e57373',
    textAlign: 'center',
  },
  subheadingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  descriptionContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  help: {
    fontSize: 14,
    color: '#e57373',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#e57373',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
