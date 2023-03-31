import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CreatedWorkout = ({ route, navigation }) => {
  const { day, exercises, name, trainingType, notes } = route.params;

  const handleExercisePress = (exercise) => {
    navigation.navigate("CreatedExerciseScreen", { exercise });
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
            <Text style={styles.exerciseInfo}>Sets x{exercise.sets} - Reps x{exercise.reps} - Weight: {exercise.weight}</Text>
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
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  header: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginLeft: 10,
    marginTop: 13,
  },
  workoutContainer: {
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  workoutTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  exerciseContainer: {
    marginVertical: 20,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  exerciseInfo: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  notesContainer: {
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 10,
    marginVertical: 5,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  notesText: {
    fontSize: 14,
  },
});
