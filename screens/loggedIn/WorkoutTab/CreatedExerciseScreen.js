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
  const { exercise, exercises, currentIndex } = route.params;
  const navigation = useNavigation();
  const [videoId, setVideoId] = useState("");
  console.log(exercise.videoLink);

  const extractId = () => {
    if (exercise.videoLink) {
      const extractedId = exercise.videoLink.slice(-11);
      setVideoId(extractedId);
    }
  };

  const handleNextExercise = () => {
    if (currentIndex < exercises.length - 1) {
      navigation.push("CreatedExerciseScreen", {
        exercise: exercises[currentIndex + 1],
        exercises,
        currentIndex: currentIndex + 1,
      });
    }
  };

  const handlePreviousExercise = () => {
    navigation.goBack();
  };

  useEffect(() => {
    extractId();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {videoId ? (
        <YoutubePlayer height={300} play={false} videoId={videoId} />
      ) : (
        <Text style={styles.title}></Text>
      )}

      <Text style={styles.title}>{exercise.name}</Text>
      <Text style={styles.sets}>x{exercise.sets} Sets</Text>
      <Text style={styles.sets}>x{exercise.reps} Reps</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.prevBtn}
          onPress={handlePreviousExercise}
        >
          <Text style={styles.btnText}>PREVIOUS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNextExercise}>
          <Text style={styles.btnText}>NEXT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.exitBtn}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={styles.btnText}
            onPress={() => navigation.navigate("AllWorkout")}
          >
            EXIT
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreatedExerciseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "black",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  sets: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  video: {
    top: 20,
  },
  doneBtn: {
    backgroundColor: "#0792F9",
    marginTop: 20,
    borderRadius: 18,
    padding: 10,
    width: 140,
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  prevBtn: {
    backgroundColor: "#4682B4",
    borderRadius: 18,
    padding: 10,
    width: 140,
    marginBottom: 20,
  },
  nextBtn: {
    backgroundColor: "#4682B4",
    borderRadius: 18,
    padding: 10,
    width: 140,
    marginTop: 20,
  },
  exitBtn: {
    backgroundColor: "#FF0000",
    borderRadius: 18,
    padding: 10,
    width: 140,
    marginTop: 20,
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
