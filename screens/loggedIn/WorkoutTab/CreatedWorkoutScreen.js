import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CreatedWorkout = ({ route, navigation }) => {
  const { day, exercises, name, trainingType, notes } = route.params;

  const handleExercisePress = (exercise) => {
    const currentIndex = exercises.findIndex((item) => item.id === exercise.id);
    navigation.navigate("CreatedExerciseScreen", { exercise, exercises, currentIndex });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#0792F9" />
        </TouchableOpacity>
        <TextInput style={styles.header} value={day} />
        <View style={{ width: 24 }}></View>
      </View>
      <View style={styles.workoutContainer}>
        <Text style={styles.workoutTitle}>{name} - {trainingType}</Text>
      </View>
      <View style={styles.workoutContainer}>
        {exercises.map((exercise, index) => (
          <TouchableOpacity key={index} style={styles.exerciseContainer} onPress={() => handleExercisePress(exercise)}>
            <Text style={styles.exerciseTitle}>Exercise {index + 1} - {exercise.name}</Text>
            <Text style={styles.exerciseInfo}>Sets x{exercise.sets} | Reps x{exercise.reps} | Weight: {exercise.weight}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.notesContainer}>
        <Text style={styles.notesTitle}>Notes:</Text>
        <Text style={styles.notesText}>{notes}</Text>
      </View>
    </ScrollView>
  );
};

export default CreatedWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#F2F2F2",
    marginTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginLeft: 10,
  },
  workoutContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  exerciseContainer: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 15,
    marginBottom: 25,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  exerciseInfo: {
    fontSize: 16,
    marginLeft: 20,
  },
  notesContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  notesText: {
    fontSize: 16,
  },
});