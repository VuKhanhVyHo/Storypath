import { View, Text, TextInput, Button, Alert } from 'react-native';
import React, { useState } from 'react';

/**
 * This file handle the editing profile 
 * @returns 
 */
export default function EditProfile({ username, onUsernameChange, onCloseEditProfile }) {
  const [name, setName] = useState(username || ''); 
  const [initialProfile, setInitialProfile] = useState({ name }); 
  const [isSaving, setIsSaving] = useState(false); 
  const [validationErrors, setValidationErrors] = useState([]); 

  function handleSave() {
    const errors = [];
    if (!name) errors.push('name');

    setValidationErrors(errors);

    if (errors.length > 0) {
      return; 
    }

    setIsSaving(true);
    setTimeout(() => {
      console.log('Profile saved:', { name });
      setInitialProfile({ name }); 
      onUsernameChange(name);
      setIsSaving(false);
      onCloseEditProfile();
    }, 1000);
  }

  function hasUnsavedChanges() {
    return name !== initialProfile.name;
  }

  function handleCancel() {
    if (hasUnsavedChanges()) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to discard them?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: onCloseEditProfile }, 
        ]
      );
    } else {
      onCloseEditProfile(); 
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Edit Profile</Text>
      <Text style={styles.label}>Username</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={[styles.input, validationErrors.includes('name') && styles.errorInput]}
        placeholder="Enter your username"
      />
      {validationErrors.includes('name') && <Text style={styles.errorText}>Username is required.</Text>}

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <Button title={isSaving ? 'Saving...' : 'Save Profile'} onPress={handleSave} disabled={isSaving} color="#ff6f61"/>
      </View>

      {/* Cancel Button */}
      <View style={styles.buttonContainer}>
        <Button onPress={handleCancel} title={hasUnsavedChanges() ? 'Cancel' : 'Close'} color="#ff6f61"/>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6f61',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
};
