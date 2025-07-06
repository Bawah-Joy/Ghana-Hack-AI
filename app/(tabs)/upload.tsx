import React, { useState } from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function upload() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (image) {
      // TODO: send image to prediction function or screen
      console.log("Submitted image:", image);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a Crop Image</Text>
      <Button title="Pick an image" onPress={pickImage} />
      {image && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <Button title="Submit" onPress={handleSubmit} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 18, marginBottom: 20 },
  previewContainer: { marginTop: 20, alignItems: "center" },
  image: { width: 200, height: 200, marginVertical: 10 },
});

// import React from "react";
// import { StyleSheet, Text, View } from "react-native";

// export default function upload() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Upload</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: "80%",
//   },
// });
