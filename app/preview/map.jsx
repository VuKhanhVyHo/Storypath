import React, { useState, useCallback, useRef, useEffect } from "react";
import { StyleSheet, Appearance, View, SafeAreaView, Text, Modal, Button } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { IdProvider, useProjectId } from "../projectContext.js";
import { UsernameProvider, useUsername } from "../usernameContext.js";
import { getLocationsByProjectId, getProject, unlockLocation, addLocation } from "../../api.jsx";
import { useFocusEffect } from "@react-navigation/native";
import RenderHtml from 'react-native-render-html';
import { Dimensions } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    nearbyLocationSafeAreaView: {
        backgroundColor: "black",
    },
    nearbyLocationView: {
        padding: 20,
    },
    nearbyLocationText: {
        color: "white",
        lineHeight: 25,
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

const colorScheme = Appearance.getColorScheme();

function NearbyLocation({ location, distance }) {
    if (location) {
        return (
            <SafeAreaView style={styles.nearbyLocationSafeAreaView}>
                <View style={styles.nearbyLocationView}>
                    <Text style={styles.nearbyLocationText}>{location}</Text>
                    {distance?.nearby && (
                        <Text style={{ ...styles.nearbyLocationText, fontWeight: "bold" }}>
                            Within 100 Metres!
                        </Text>
                    )}
                </View>
            </SafeAreaView>
        );
    }
    return null;
}

/**
 * Show the map. This tab should be reloaded everytime users click in
 * @returns 
 */
export default function ShowMap() {
    const [project, setProject] = useState(null);
    const [dup, setDup] = useState([]);
    const [visited, setVisited] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const { username } = useUsername();
    const { project_id } = useProjectId();
    const lastTrackedLocation = useRef(null);
    const isInRange = useRef(false);
    const screenWidth = Dimensions.get('window').width;

    const [mapState, setMapState] = useState({
        locationPermission: false,
        locations: [],
        userLocation: {
            latitude: -27.5263381,
            longitude: 153.0954163,
        },
        nearbyLocation: {},
    });

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    console.log("Fetching data with Project ID:", project_id, "and Username:", username);
                    const projectData = await getProject(project_id);
                    const locationData = await getLocationsByProjectId(project_id);
                    const participantData = await unlockLocation(project_id, username);
    
                    setProject(projectData[0]);
    
                    if (projectData[0].homescreen_display === "Display all locations") {
                        setDup(locationData);
                    } else {
                        if (participantData && Array.isArray(participantData)) {
                            const visitedLocationIds = participantData.map((record) => record.location_id);
                            setVisited(visitedLocationIds);
                            setDup(locationData);
                        }
                    }
                    lastTrackedLocation.current = null;
                    isInRange.current = false;
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
    
            fetchData();
        }, [project_id, username])
    );    

    useFocusEffect(
        useCallback(() => {
            if (project && dup&& visited) {
                const updatedDup = project.homescreen_display === "Display all locations" || 
                project.participant_scoring === "Number of Locations Entered" ? (dup.map((location) => {
                    const latlong = location.location_position.replace(/[()]/g, "").split(",");
                    location.coordinates = {
                        latitude: parseFloat(latlong[0]),
                        longitude: parseFloat(latlong[1]),
                    };
                    return location;
                })): (dup.filter((location) => visited.includes(location.id)).map((location) => {
                    const latlong = location.location_position.replace(/[()]/g, "").split(",");
                    location.coordinates = {
                        latitude: parseFloat(latlong[0]),
                        longitude: parseFloat(latlong[1]),
                    };
                    return location;
                }));
    
                setMapState((prevState) => ({
                    ...prevState,
                    locations: updatedDup
                }));
            }
        }, [dup, project, visited])
    );

    useFocusEffect(
        useCallback(() => {
            async function requestLocationPermission() {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === "granted") {
                    setMapState((prevState) => ({
                        ...prevState,
                        locationPermission: true,
                    }));
                }
            }
            requestLocationPermission();
        }, [])
    );

    const handleCirclePress = (location) => {
        setModalContent({
            name: location.location_name,
            clue: location.clue,
            content: location.location_content,
        });
        setModalVisible(true);
    };

    const calculateDistance = useCallback(
        (userLocation) => {
            if (project && dup && project.participant_scoring === "Number of Locations Entered") {
                dup
                    .filter((location) => !visited.includes(location.id))
                    .forEach((location) => {
                        const metres = getDistance(userLocation, location.coordinates);
                        const isWithin100Meters = metres <= 100;

                        if (isWithin100Meters && lastTrackedLocation.current !== location.id && !isInRange.current) {
                            const trackData = {
                                project_id: project_id,
                                location_id: location.id,
                                points: location.score_points,
                                participant_username: username,
                                username: 's4759786',
                            };

                            addLocation(trackData)
                                .then(() => {
                                    console.log("Location tracked successfully for:", location.id);
                                    setVisited((prevVisited) => [...prevVisited, location.id]);
                                    lastTrackedLocation.current = location.id;
                                    isInRange.current = true;

                                    // Automatically show modal for the tracked location
                                    handleCirclePress(location);
                                })
                                .catch((error) => console.error("Error tracking location:", error));
                        } else if (!isWithin100Meters && isInRange.current && lastTrackedLocation.current === location.id) {
                            isInRange.current = false;
                        }
                    });
            }
        },
        [dup, project, visited, username, project_id]
    );

    useFocusEffect(
        useCallback(() => {
            let locationSubscription = null;

            if (mapState.locationPermission) {
                (async () => {
                    locationSubscription = await Location.watchPositionAsync(
                        {
                            accuracy: Location.Accuracy.High,
                            distanceInterval: 10,
                        },
                        (location) => {
                            const userLocation = {
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            };
                            calculateDistance(userLocation);
                            setMapState((prevState) => ({
                                ...prevState,
                                userLocation,
                            }));
                        }
                    );
                })();
            }

            return () => {
                if (locationSubscription) locationSubscription.remove();
            };
        }, [mapState.locationPermission, calculateDistance])
    );

    return (
        <>
            <IdProvider>
                <UsernameProvider>
                    <MapView
                        camera={{
                            center: mapState.userLocation,
                            pitch: 0,
                            heading: 0,
                            altitude: 3000,
                            zoom: 15,
                        }}
                        showsUserLocation={mapState.locationPermission}
                        style={styles.container}
                    >
                        {mapState.locations.map((location) => (
                            <>
                                <Circle
                                    key={location.id}
                                    center={location.coordinates}
                                    radius={100}
                                    strokeWidth={3}
                                    strokeColor="#A42DE8"
                                    fillColor={colorScheme === "dark" ? "rgba(128,0,128,0.5)" : "rgba(210,169,210,0.5)"}
                                />
                                <Marker
                                    coordinate={location.coordinates}
                                    onPress={() => handleCirclePress(location)}
                                    opacity={0} // Invisible marker
                                />
                            </>
                        ))}
                    </MapView>
                    <NearbyLocation
                        location={mapState.nearbyLocation?.name}
                        distance={mapState.nearbyLocation?.distance}
                    />
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
                </UsernameProvider>
            </IdProvider>
        </>
    );
}
