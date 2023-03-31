import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useEffect } from "react";

const CreatedExerciseScreen = ({ route }) => {
  //gets params from last page
  const { exercise } = route.params;
  const navigation = useNavigation();
  const [videoId, setVideoId] = useState("");
  console.log(exercise.videoLink);

  const extractId = () => {
    if (exercise.videoLink) {
      const extractedId = exercise.videoLink.slice(-11);
      setVideoId(extractedId);
    }
  };

  useEffect(() => {
    extractId();
  }, []);

  return (
    <SafeAreaView>
      {videoId ? (
        <YoutubePlayer height={300} play={false} videoId={videoId} />
      ) : (
        <Text style={styles.title}></Text>
      )}

      <Text style={styles.title}>{exercise.name}</Text>
      <Text style={styles.sets}>x{exercise.sets} Sets</Text>
      <Text style={styles.sets}>x{exercise.reps} Reps</Text>
      <KeyboardAvoidingView></KeyboardAvoidingView>
      <TouchableOpacity style={styles.doneBtn} onPress={extractId}>
        <Text style={styles.btnText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.doneBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.btnText}>BACK</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CreatedExerciseScreen;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 370,
    backgroundColor: "black",
  },
  title: {
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 30,
    fontWeight: "bold",
  },
  sets: {
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 36,
    top: 25,
  },
  video: {
    top: 20,
  },
  doneBtn: {
    backgroundColor: "#0792F9",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
    borderRadius: 18,
    padding: 10,
    top: 155,
    width: 140,
  },
  prevBtn: {
    backgroundColor: "#4682B4",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 18,
    padding: 10,
    width: 140,
    right: 90,
  },
  nextBtn: {
    backgroundColor: "#4682B4",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
    borderRadius: 18,
    padding: 10,
    width: 140,
    left: 90,
    bottom: 58,
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    bottom: 70,
    backgroundColor: "lightgrey",
  },
});
