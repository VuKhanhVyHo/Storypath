import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Help() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>In case you need </Text>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Testing?</Text>
          <Text style={styles.sectionContent}>Please find the testing.pdf document I attached.</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>How to play?</Text>
          <Text style={styles.sectionContent}>Step 1: Create Profile / Change Username.</Text>
          <Text style={styles.sectionContent}>Step 2: Select a Project you want.</Text>
          <Text style={styles.sectionContent}>Step 3: Solve the Puzzle to gain points (no rewards yay).</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Homescreen shows nothing?</Text>
          <Text style={styles.sectionContent}>
          <Text style={styles.sectionContent}>Projects have different modes, for some it display all locations, for some they are not. By default the map only show you unlocked locations,
          but if the project set to display all locations then they may display even the location those are not unlocked yet.</Text>
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Scan QR code and Location Entry?</Text>
          <Text style={styles.sectionContent}>
            Please make sure you read the note in homescreen before start going to solve the puzzles. Some projects allow 
            users gain points by scanning QR code, for some you have to go and seek for it until stand in the radius of that 
            location. For case require you to stand in the radius, locations are not marked or trigger until you click in tab map. 
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Issues and Bugs?</Text>
          <Text style={styles.sectionContent}>
             Feel free to feedback, I will try to fix it (after exams). I rushed this project so it's not perfect, 
             especially UI, I wish I had more time to make it better. Hope these explanation can help you somehow.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={() => router.back()} title="Go Back" color="#FF6F61" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: '#FF6F61',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F61',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
