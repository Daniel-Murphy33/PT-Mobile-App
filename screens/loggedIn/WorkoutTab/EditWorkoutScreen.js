/**
 * EditWorkoutScreen.js
 * @author Daniel Murphy
 * @studentnumber C00247818
 * @license GNU Affero General Public License v3.0
 */

/**
 * Edit Workout Screen
 * @returns {React.Component}
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";


const EditWorkoutScreen = ({ route, navigation }) => {
  const { day, exercises, name, trainingType, notes, id } = route.params;

  const user = getAuth().currentUser;
  const [newDay, setNewDay] = useState(day);
  const [newName, setNewName] = useState(name);
  const [newTrainingType, setNewTrainingType] = useState(trainingType);
  const [newNotes, setNewNotes] = useState(notes);
  const [newExercises, setNewExercises] = useState([...exercises]);

  const handleSave = async () => {
    try {
      if (user) {
        const workoutDocRef = doc(db, `users/${user.uid}/workouts/${id}`);

        await updateDoc(workoutDocRef, {
          name: newName,
          day: newDay,
          trainingType: newTrainingType,
          notes: newNotes,
          exercises: newExercises,
          createdAt: serverTimestamp(),
        });
        console.log("Updated successfully");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating workout: ", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="#0792F9" />
          </TouchableOpacity>
          <Text style={styles.header}>Edit Workout</Text>
          <View style={{ width: 24 }}></View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Day:</Text>
          <TextInput
            style={styles.input}
            value={newDay}
            onChangeText={setNewDay}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Training Type:</Text>
          <TextInput
            style={styles.input}
            value={newTrainingType}
            onChangeText={setNewTrainingType}
          />
        </View>
        <View style={styles.exercisesContainer}>
          <Text style={styles.label}>Exercises:</Text>
          {newExercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
              <Text style={styles.exerciseLabel}>Exercise {index + 1}</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                  style={styles.input}
                  value={exercise.name}
                  onChangeText={(text) => {
                    const updatedExercises = [...newExercises];
                    updatedExercises[index].name = text;
                    setNewExercises(updatedExercises);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Sets:</Text>
                <TextInput
                  style={styles.input}
                  value={exercise.sets}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const updatedExercises = [...newExercises];
                    updatedExercises[index].sets = text;
                    setNewExercises(updatedExercises);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Reps:</Text>
                <TextInput
                  style={styles.input}
                  value={exercise.reps}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const updatedExercises = [...newExercises];
                    updatedExercises[index].reps = text;
                    setNewExercises(updatedExercises);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Weight:</Text>
                <TextInput
                  style={styles.input}
                  value={exercise.weight}
                  onChangeText={(text) => {
                    const updatedExercises = [...newExercises];
                    updatedExercises[index].weight = text;
                    setNewExercises(updatedExercises);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Video Link:</Text>
                <TextInput
                  style={styles.input}
                  value={exercise.videoLink}
                  onChangeText={(text) => {
                    const updatedExercises = [...newExercises];
                    updatedExercises[index].videoLink = text;
                    setNewExercises(updatedExercises);
                  }}
                />
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              const newExercise = {
                name: "",
                sets: "",
                reps: "",
                weight: "",
                videoLink: "",
              };
              setNewExercises([...newExercises, newExercise]);
            }}
          >
            <Text style={styles.addButtonLabel}>+ Add Exercise</Text>
          </TouchableOpacity>
          {newExercises.length > 0 && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                const newExercisesList = [...newExercises];
                newExercisesList.pop();
                setNewExercises(newExercisesList);
              }}
            >
              <Text style={styles.removeButtonLabel}>- Remove Exercise</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes:</Text>
          <TextInput
            style={styles.textArea}
            value={newNotes}
            onChangeText={setNewNotes}
            multiline
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditWorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    marginTop: 20,
    padding: 25,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  inputContainer: {
    marginBottom: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginLeft: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textArea: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: "#0792F9",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  exercisesContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  exerciseItem: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exerciseLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  exerciseInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#0792F9',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonLabel: {
    color: '#fff',
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#FF4136',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  removeButtonLabel: {
    color: '#fff',
    fontSize: 16,
  },  
});
