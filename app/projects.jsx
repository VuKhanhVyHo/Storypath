import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { getProjects, getParticipants } from '../api';

export default function ProjectsScreen() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // New state for pull-to-refresh
  const router = useRouter();
  const [participants, setParticipants] = useState([]);
  const isFocused = useIsFocused();

  const fetchProjects = async () => {
    try {
      setLoading(true); // Start loading
      const projectsData = await getProjects();
      const participantsData = await getParticipants();
      const publishedProjects = projectsData.filter(project => project.is_published === true);
      setProjects(publishedProjects);
      setParticipants(participantsData);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Separate function to handle refreshing logic
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        fetchProjects();
      }
    }, [isFocused])
  );

  const getUniqueParticipantCount = (projectId) => {
    const projectParticipants = participants.filter(participant => participant.project_id === projectId);
    const uniqueUsernames = new Set(projectParticipants.map(participant => participant.participant_username));
    return uniqueUsernames.size;
  };

  if (loading && !refreshing) { // Show the initial loading indicator only if not refreshing
    return <ActivityIndicator size="large" />;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.projectCard} onPress={() => router.push(`/preview/${item.id}`)}>
      <View style={styles.projectContent}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <View style={styles.participantsBadge}>
          <Text style={styles.participantsText}>Participants: {getUniqueParticipantCount(item.id)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Projects</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListFooterComponent={<View style={{ height: 50 }} />}
        refreshing={refreshing} // Set the refreshing state
        onRefresh={handleRefresh} // Set the pull-to-refresh handler
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  projectCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  projectContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  participantsBadge: {
    backgroundColor: '#f76c6c',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  participantsText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});