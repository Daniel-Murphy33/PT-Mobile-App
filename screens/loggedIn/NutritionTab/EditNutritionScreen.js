/**
 * EditNutritionScreen.js
 * @author Daniel Murphy
 * @studentnumber C00247818
 * @license GNU Affero General Public License v3.0
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
import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";

/**
 * Edit Nutrition screen 
 * @returns {React.Component}
 */ 

const EditNutritionScreen = ({ route, navigation }) => {
  const { date, meals, name, notes, id } = route.params;

  const user = getAuth().currentUser;
  const [newDate, setNewDate] = useState(date);
  const [newName, setNewName] = useState(name);
  const [newMeals, setNewMeals] = useState([...meals]);
  const [newNotes, setNewNotes] = useState(notes);

  const handleSave = async () => {
    try {
      if (user) {
        const docRef = doc(db, `users/${user.uid}/nutrition/${id}`);

        await setDoc(docRef, {
          mealPlanName: newName,
          date: newDate,
          notes: newNotes,
          meals: newMeals,
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
          <Text style={styles.header}>Edit Meal Plan</Text>
          <View style={{ width: 24 }}></View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date:</Text>
          <TextInput
            style={styles.input}
            value={newDate}
            onChangeText={setNewDate}
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
        <View style={styles.exercisesContainer}>
          <Text style={styles.label}>Meals:</Text>
          {newMeals.map((meal, index) => (
            <View key={index} style={styles.exerciseItem}>
              <Text style={styles.exerciseLabel}>Meal {index + 1}</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                  style={styles.input}
                  value={meal.name}
                  onChangeText={(text) => {
                    const updatedMeals = [...newMeals];
                    updatedMeals[index].name = text;
                    setNewMeals(updatedMeals);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Serving Size:</Text>
                <TextInput
                  style={styles.input}
                  value={meal.servingSize}
                  onChangeText={(text) => {
                    const updatedMeals = [...newMeals];
                    updatedMeals[index].servingSize = text;
                    setNewMeals(updatedMeals);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Calories:</Text>
                <TextInput
                  style={styles.input}
                  value={meal.calories}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const updatedMeals = [...newMeals];
                    updatedMeals[index].calories = text;
                    setNewMeals(updatedMeals);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Fat:</Text>
                <TextInput
                  style={styles.input}
                  value={meal.fat}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const updatedMeals = [...newMeals];
                    updatedMeals[index].fat = text;
                    setNewMeals(updatedMeals);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Carbohydrates:</Text>
                <TextInput
                  style={styles.input}
                  value={meal.carbohydrates}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const updatedMeals = [...newMeals];
                    updatedMeals[index].carbohydrates = text;
                    setNewMeals(updatedMeals);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Protein:</Text>
                <TextInput
                  style={styles.input}
                  value={meal.protein}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const updatedMeals = [...newMeals];
                    updatedMeals[index].protein = text;
                    setNewMeals(updatedMeals);
                  }}
                />
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              const newMeal = {
                name: "",
                servingSize: "",
                calories: "",
                carbohydrates: "",
                fat: "",
                protein: "",
              };
              setNewMeals([...newMeals, newMeal]);
            }}
          >
            <Text style={styles.addButtonLabel}>+ Add Meal</Text>
          </TouchableOpacity>
          {newMeals.length > 0 && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                const newMealsList = [...newMeals];
                newMealsList.pop();
                setNewMeals(newMealsList);
              }}
            >
              <Text style={styles.removeButtonLabel}>- Remove Meal</Text>
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

export default EditNutritionScreen;

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
