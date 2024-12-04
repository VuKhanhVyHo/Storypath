import React, { useState } from "react";
import { SafeAreaView, View, Image, Dimensions, Text, Button, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    photoFullView: {
        marginBottom: 20,
    },
    photoEmptyView: {
        borderWidth: 3,
        borderRadius: 10,
        borderColor: "#999",
        borderStyle: "dashed",
        width: "100%",
        height: height / 2,
        marginBottom: 20,
    },
    photoFullImage: {
        width: "100%",
        height: height / 2,
        borderRadius: 10,
    },
    buttonView: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    selectedImageContainer: {
        marginTop: 20,
    },
});

// Main ImagePickerScreen component
export default function ImagePickerScreen({ onImageSelect, onCloseImage }) {
    // State to hold the selected image details
    const [selectedImage, setSelectedImage] = useState(null);

    // Function to handle image selection using the Image Picker
    async function handleSelectImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        // If the user selects an image, update the state
        if (!result.canceled && result.assets?.length > 0) {
            setSelectedImage(result.assets[0]);
        }
    }

    // Function to remove the selected image
    function handleRemoveImage() {
        setSelectedImage(null);
    }

    // Function to save the selected image
    function handleSaveImage() {
        if (selectedImage) {
            onImageSelect(selectedImage); 
            onCloseImage();
        }
    }

    const hasPhoto = Boolean(selectedImage);

    function Photo() {
        return hasPhoto ? (
            <View style={styles.photoFullView}>
                <Image
                    style={styles.photoFullImage}
                    resizeMode="cover"
                    source={{ uri: selectedImage.uri }}
                />
            </View>
        ) : (
            <View style={styles.photoEmptyView} />
        );
    }

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Photo />
                <View style={styles.buttonView}>
                    <Button
                        onPress={handleSelectImage}
                        title={hasPhoto ? "Change Photo" : "Add Photo"}
                    />
                    {hasPhoto && <Button onPress={handleRemoveImage} title="Remove Photo" />}
                </View>

                {selectedImage && (
                    <View style={styles.selectedImageContainer}>
                        <Text>Selected image: {selectedImage.uri}</Text>
                        <Button title="Save Image" onPress={handleSaveImage} />
                    </View>
                )}

                {/* Optionally, you could add a "Cancel" button */}
                <Button title="Cancel" onPress={onCloseImage} />
            </View>
        </SafeAreaView>
    );
}
