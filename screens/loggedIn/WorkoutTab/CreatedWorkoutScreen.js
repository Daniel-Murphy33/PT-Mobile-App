/**
 * CreatedWorkoutScreen.js
 * @author Daniel Murphy
 * @studentnumber C00247818
 * @license GNU Affero General Public License v3.0
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

/**
 * CreatedWorkoutScreen.js
 * @author Daniel Murphy
 * @studentnumber C00247818
 * @license GNU Affero General Public License v3.0
 */

const CreatedWorkout = ({ route, navigation }) => {
  const { day, exercises, name, trainingType, notes, id, isCompleted, isAssigned } = route.params;
  const [completed, setCompleted] = useState(isCompleted);
  const user = getAuth().currentUser;
  

  const handleCompleteWorkout = async () => {
    try {
      if (user) {
        let workoutDocRef;
        
        // Check if the workout is assigned or user-created
        if (isAssigned) {
          workoutDocRef = doc(db, `workouts/${id}`);
        } else {
          workoutDocRef = doc(db, `users/${user.uid}/workouts/${id}`);
        }
  
        const newCompletionStatus = !completed;
        await updateDoc(workoutDocRef, {
          isCompleted: newCompletionStatus,
          completedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error marking workout as complete: ", error);
    }
    setCompleted(!completed);
  };  
  
  const handleExercisePress = (exercise) => {
    const currentIndex = exercises.findIndex((item) => item.id === exercise.id);
    navigation.navigate("CreatedExerciseScreen", {
      exercise,
      exercises,
      currentIndex,
    });
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#0792F9" />
        </TouchableOpacity>
        <Text style={styles.header}>{day}</Text>
        <View style={{ width: 24 }}></View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("Edit Workout", {
              day,
              id,
              exercises,
              name,
              trainingType,
              notes,
            })
          }
        >
          <Text style={styles.editButtonText}>Edit Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCompleteWorkout}>
          <View style={styles.completedContainer}>
            <Ionicons
              name={completed ? "checkmark-circle" : "checkmark-circle-outline"}
              size={30}
              color={completed ? "green" : "gray"}
            />
            <Text style={styles.checkTxt}>Completed</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.workoutContainer}>
        <Text style={styles.workoutTitle}>
          {name} - {trainingType}
        </Text>
      </View>
      <View style={styles.exercisesContainer}>
        {exercises.map((exercise, index) => (
          <TouchableOpacity
            key={index}
            style={styles.exerciseContainer}
            onPress={() => handleExercisePress(exercise)}
          >
            <Text style={styles.exerciseTitle}>
              Exercise {index + 1} - {exercise.name}
            </Text>
            <Text style={styles.exerciseInfo}>
              Sets x{exercise.sets} | Reps x{exercise.reps} | Weight:{" "}
              {exercise.weight}
            </Text>
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
  exercisesContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseContainer: {
    marginVertical: 10,
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
  editButton: {
    backgroundColor: "#0792F9",
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
    alignSelf: "flex-start",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  editButtonText: {
    textAlign: "center",
    color: "white",
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
  checkTxt: {
    marginLeft: 5,
  },
  completedContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
});
