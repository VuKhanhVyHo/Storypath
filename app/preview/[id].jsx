import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { getProject, getLocationsByProjectId, unlockLocation } from '../../api';
import { convertDeltaToHtml } from 'quill-delta-to-html';
import { useProjectId } from '../projectContext';
import { UsernameProvider, useUsername } from '../usernameContext';

/**
 * This tab is the homescreen, showing information about projects and locations
 * @returns 
 */
export default function ProjectDetail() {
  const route = useRoute();
  const { id } = route.params;
  const [project, setProject] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxScore, setMaxScore] = useState(0);
  const { setProjectId } = useProjectId();
  const { username } = useUsername();
  const [points, setPoints] = useState(0); 
  const [visited, setVisited] = useState([]); 
  const screenWidth = Dimensions.get('window').width;

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const projectData = await getProject(id);
      const locationData = await getLocationsByProjectId(id);
      const participantData = await unlockLocation(id, username);

      if (projectData) {
        setProject(projectData[0]);
        setProjectId(id);
      }

      if (locationData) {
        setLocations(locationData);
        // Handle "Not Scored" case
        if (projectData[0]?.participant_scoring === "") {
          setMaxScore(0);
        } else {
          const totalScore = locationData.reduce((sum, location) => sum + Number(location.score_points), 0);
          setMaxScore(totalScore);
        }
      }

      if (participantData && Array.isArray(participantData)) {
        const totalPoints = participantData.reduce((sum, record) => sum + Number(record.points || 0), 0);
        setPoints(totalPoints);
        setVisited(participantData.map(record => record.location_id));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProjectData();
    }, [id, username])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#FF6F61" style={styles.loading} />;
  }

  const renderContent = (content) => {
    if (typeof content === 'object') {
      content = convertDeltaToHtml(content);
    }
    return (
      <RenderHtml
        contentWidth={screenWidth}
        source={{ html: content }}
        tagsStyles={{ p: { marginBottom: 10 }, h1: { fontSize: 24 } }}
      />
    );
  };

  /**
   * Render information about locations that user unlocked (or all if the project is Display all locations)
   * @param {*} param0 
   * @returns the view 
   */
  const renderLocationItem = ({ item }) => (
    <View style={styles.locationContainer}>
      <Text style={styles.locationTitle}>{item.location_name}</Text>
      <Text style={styles.subTitle}>Clue:</Text>
      {renderContent(item.clue || "No clue available")}
      <Text style={styles.subTitle}>Content:</Text>
      {renderContent(item.location_content || "No content available")}
    </View>
  );

  // Display trackedLocations if homescreen_display is "Display initial clue"
  // Otherwise, display all locations
  const trackedLocations = locations.filter(location => visited.includes(location.id));
  const listData = project?.homescreen_display === "Display all locations" ? locations : trackedLocations;

  /**
   * The UI
   */
  return (
    <UsernameProvider>
      <FlatList
        data={listData}
        renderItem={renderLocationItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <>
            {project && (
              <>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{project.title}</Text>
                </View>
                <View style={styles.instructionsContainer}>
                  <Text style={styles.instructionsTitle}>Instructions</Text>
                  {renderContent(project.instructions)}
                  {project.homescreen_display === "" && (
                    <View>
                      <Text style={styles.sectionTitle}>Initial Clue</Text>
                      {renderContent(project.initial_clue)}
                    </View>
                  )}
                </View>
              </>
            )}
          </>
        )}
        ListFooterComponent={() => (
          <View style={styles.scoreContainer}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Points</Text>
              <Text style={styles.scoreValue}>{points} / {maxScore}</Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Locations Visited</Text>
              <Text style={styles.scoreValue}>{visited.length} / {locations.length}</Text>
            </View>
          </View>
        )}
      />
    </UsernameProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    backgroundColor: '#FF6F61',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructionsContainer: {
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
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  locationContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6F61',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  scoreBox: {
    backgroundColor: '#FF6F61',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '45%',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  scoreValue: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});
