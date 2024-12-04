import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import ImagePickerScreen from '../components/imagePicker'; // Import the ImagePicker component
import EditProfile from '../components/editProfile'; // Import the EditProfile component
import { useUsername } from './usernameContext'; // Use the context

export default function Profile() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null);
  const { username, setUsername } = useUsername();
  const [isPickerVisible, setPickerVisible] = useState(false); 
  const [isUserEditing, setUserEditing] = useState(false); 

  function handleImageChange(image) {
    setProfileImage(image);
  }

  function toggleImagePicker() {
    setPickerVisible(!isPickerVisible);
  }

  function handleUsernameChange(username) {
    setUsername(username);
  }

  function toggleUserEditing() {
    setUserEditing(!isUserEditing);
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <Text style={styles.profileHeader}>Your Profile</Text>

      {/* Image Picker Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.imageWrapper} onPress={toggleImagePicker}>
          {profileImage ? (
            <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
          ) : (
            <View style={styles.defaultImageWrapper}>
              <Image source={require('../assets/images/splash.png')} style={styles.defaultImage} />
            </View>
          )}
          <Text style={styles.tapText}>Tap to add photo</Text>
        </TouchableOpacity>
      </View>

      {/* Image Picker Modal */}
      <Modal visible={isPickerVisible} animationType="slide" onRequestClose={toggleImagePicker}>
        <ImagePickerScreen onImageSelect={handleImageChange} onCloseImage={toggleImagePicker} />
      </Modal>

      {/* Username Section */}
      <View style={styles.inputWrapper}>
        <TouchableOpacity onPress={toggleUserEditing}>
          <Text style={styles.inputText}>{username ? username : 'participant_username'}</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Username Modal */}
      <Modal visible={isUserEditing} animationType="slide" onRequestClose={toggleUserEditing}>
        <EditProfile username={username} onUsernameChange={handleUsernameChange} onCloseEditProfile={toggleUserEditing} />
      </Modal>

      {/* Go Back Button */}
      <View style={styles.buttonWrapper}>
        <Button title="Go Back" onPress={() => router.back()} color={'#FF6F61'} />
      </View>
    </View>
  );
}

// Stylesheet for the Profile Screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,
  },
  profileHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6F61', // Updated color to match design
    marginBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  defaultImageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  tapText: {
    position: 'absolute',
    color: '#c3c3c3',
    fontSize: 12,
    bottom: 5,
    textAlign: 'center',
  },
  inputWrapper: {
    width: '80%',
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  inputText: {
    fontSize: 16,
    color: '#8c8c8c',
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '80%',
    marginTop: 30,
  },
});
