import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Button, Alert, Modal } from 'react-native';
import { getProject, unlockLocation, addLocation, getLocationsByProjectId } from '../../api';
import { IdProvider, useProjectId } from '../projectContext';
import { UsernameProvider, useUsername } from '../usernameContext';
import { CameraView, useCameraPermissions } from 'expo-camera';
import RenderHtml from 'react-native-render-html';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

/**
 * qrScanner, this tab should be reload everytime click in
 * @returns 
 */
export default function App() {
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const { project_id } = useProjectId();
  const { username } = useUsername();
  const [visited, setVisited] = useState([]);
  const [locations, setLocations] = useState([]);
  const [project, setProject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const screenWidth = Dimensions.get('window').width;

  // Cooldown to prevent rapid successive scans
  const cooldownTime = 2000; // 5 seconds
  const [cooldown, setCooldown] = useState(false);

  /**
   * Fetch required data for later process
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await getProject(project_id);
        const locationData = await getLocationsByProjectId(project_id);
        const participantData = await unlockLocation(project_id, username);

        if (projectData) {
          setProject(projectData[0]);
        }

        if (participantData && Array.isArray(participantData)) {
          const visitedLocations = participantData.map(record => record.location_id);
          setVisited(visitedLocations);
        }

        if (locationData) {
          setLocations(locationData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [project_id, username]);

  /**
   * UseFocusEffect so it reload everytime you click in
   */
  useFocusEffect(
    useCallback(() => {
      setScanned(true);
      return () => {
        // Disable scanning when the screen loses focus
        setScanned(true);
      };
    }, [])
  );

  /**
   * Request for permission from the user's camera
   */
  if (!permission) {
    return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  /**
   * Handle the scanning code 
   * This should handle cases of scanning code two times, scanning code from different project
   * If the code is available, a modal show say that you scanned successfully. 
   * @returns 
   */
  const handleBarCodeScanned = ({ type, data }) => {
    if (cooldown) return; // Prevent scanning if cooldown is active

    setScanned(true);
    setScannedData(data);

    const [scannedProjectId, scannedLocationId] = data.split(',').map(item => item.trim());

    if (scannedProjectId !== project_id.toString()) {
      Alert.alert("Error", "Scanned project does not match the current project.");
      setCooldown(true);
      setTimeout(() => setCooldown(false), cooldownTime); // Reset cooldown after delay
      return;
    }

    if (!(project.participant_scoring === "Number of Locations Entered")) {
      if (!visited.includes(scannedLocationId)) {
        const scannedLocation = locations.find(location => location.id === Number(scannedLocationId));
        let points = 0;
        if (project.participant_scoring === "Number of Scanned QR Codes") {
          points = scannedLocation ? scannedLocation.score_points : 0;
        }

        const trackData = {
          project_id: project_id,
          location_id: scannedLocationId,
          points: points,
          username: 's4759786',
          participant_username: username,
        };

        addLocation(trackData)
          .then(() => {
            setVisited(prevVisited => [...prevVisited, scannedLocationId]);

            if (scannedLocation) {
              setModalContent({
                name: scannedLocation.location_name,
                clue: scannedLocation.clue,
                content: scannedLocation.location_content,
              });
              setModalVisible(true);
              setScanned(true);
            }
          })
          .catch(error => {
            console.error("Error adding location:", error);
            Alert.alert("Error", "Failed to add location.");
            setScanned(true);
          });
      } else {
        Alert.alert("Info", "Location already visited.");
        setCooldown(true);
        setTimeout(() => setCooldown(false), cooldownTime); // Reset cooldown after delay
        return;
      }
    } else {
      Alert.alert("Info", "This project doesn't allow scanning");
      setCooldown(true);
      setTimeout(() => setCooldown(false), cooldownTime); // Reset cooldown after delay
      return;
    }
    setCooldown(true);
    setTimeout(() => {
      setCooldown(false);
    }, cooldownTime); // Reset cooldown after delay
  };

  /**
   * when scan QR code, it should show something like "Scanned Result:" Therefore you can check for information
   * Tap before scan
   */
  return (
    <IdProvider>
      <UsernameProvider>
        <View style={styles.container}>
          <CameraView 
            style={styles.camera} 
            type='front'
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
          {scanned && (
            <View style={styles.scanResultContainer}>
              <Text style={styles.scanResultText}>Scanned data: {scannedData}</Text>
              <Button title="Tap to Scan" onPress={() => setScanned(false)} />
            </View>
          )}
          {/* Modal show information about location */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text> Congratulations! You unlocked this location</Text>
                <Text style={styles.modalTitle}>{modalContent.name}</Text>
                <Text style={styles.modalClue}>Clue: {modalContent.clue}</Text>
                <RenderHtml
                  contentWidth={screenWidth}
                  source={{ html: modalContent.content || "<p>No content available</p>" }}
                  tagsStyles={{ p: { marginBottom: 10 }, h1: { fontSize: 24 } }}
                />
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </View>
      </UsernameProvider>
    </IdProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  scanResultContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 15,
  },
  scanResultText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalClue: {
    fontSize: 16,
    marginBottom: 10,
  },
});
