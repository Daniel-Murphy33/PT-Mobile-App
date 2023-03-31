import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { getAuth } from "firebase/auth";
import { doc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigation } from "@react-navigation/native";

const AddNutritionScreen = () => {
  const [date, setDate] = useState("");
  const [mealPlanName, setMealPlanName] = useState("");
  const [notes, setNotes] = useState("");
  const [meals, setMeals] = useState([
    { name: "", servingSize: "", calories: "", fat: "", carbohydrates: "", protein: "" },
  ]);

  const handleAddMeal = () => {
    setMeals([
      ...meals,
      { name: "", servingSize: "", calories: "", fat: "", carbohydrates: "", protein: "" },
    ]);
  };

  const handleRemoveMeal = (index) => {
    const newMeals = [...meals];
    newMeals.splice(index, 1);
    setMeals(newMeals);
  };

  const handleMealChange = (index, field, value) => {
    const newMeals = [...meals];
    newMeals[index][field] = value;
    setMeals(newMeals);
  };

  //Create in Firesotre
  const addNutrition = async () => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        const colRef = collection(docRef, "nutrition");
        addDoc(colRef, {
          date: date,
          notes: notes,
          mealPlanName: mealPlanName,
          meals: meals,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.log(e);
      }

      setDate("");
      setMealPlanName("");
      setMeals([{ name: "" }]);
      setNotes("");
      console.log(meals);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.title}>Record Nutrition</Text>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          nestedScrollEnabled={true}
        >
          <View style={styles.formWrapper}>
          <View style={styles.formBox}>
                <Text style={styles.label}>Date:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter date..."
                  placeholderTextColor={"grey"}
                  value={date}
                  onChangeText={setDate}
                />
              </View>

              <View style={styles.formBox}>
                <Text style={styles.label}>Meal Plan Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder={"Enter meal plan name..."}
                  placeholderTextColor={"grey"}
                  value={mealPlanName}
                  onChangeText={setMealPlanName}
                />
              </View>

              {meals.map((meal, index) => (
                <View key={index} style={styles.formBox}>
                  <Text style={styles.label}>Meal {index + 1} :</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter food name..."
                    placeholderTextColor={"grey"}
                    value={meal.name}
                    onChangeText={(text) =>
                      handleMealChange(index, "name", text)
                    }
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Enter serving size..."
                    placeholderTextColor={"grey"}
                    value={meal.servingSize}
                    onChangeText={(text) =>
                      handleMealChange(index, "servingSize", text)
                    }
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Enter calories..."
                    placeholderTextColor={"grey"}
                    keyboardType="numeric"
                    value={meal.calories}
                    onChangeText={(text) =>
                      handleMealChange(index, "calories", text)
                    }
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Enter fat..."
                    placeholderTextColor={"grey"}
                    keyboardType="numeric"
                    value={meal.fat}
                    onChangeText={(text) =>
                      handleMealChange(index, "fat", text)
                    }
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Enter carbohydrates..."
                    placeholderTextColor={"grey"}
                    keyboardType="numeric"
                    value={meal.carbohydrates}
                    onChangeText={(text) =>
                      handleMealChange(index, "carbohydrates", text)
                    }
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Enter protein..."
                    placeholderTextColor={"grey"}
                    keyboardType="numeric"
                    value={meal.protein}
                    onChangeText={(text) =>
                      handleMealChange(index, "protein", text)
                    }
                  />

                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddMeal}
                  >
                    <Text style={styles.addButtonText}>Add Meal</Text>
                  </TouchableOpacity>

                  {index > 0 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveMeal(index)}
                    >
                      <Text style={styles.removeButtonText}>Remove Meal</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <View style={styles.formBox}>
                <Text style={styles.label}>Notes:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter notes..."
                  placeholderTextColor={"grey"}
                  multiline={true}
                  value={notes}
                  onChangeText={setNotes}
                />
                
              </View>

              <TouchableOpacity style={styles.addButton} onPress={addNutrition}>
                <Text style={styles.addButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

export default AddNutritionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    margin: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formWrapper: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: "center",
  },
  formBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    marginBottom: 20,
  },
  title: {
    alignSelf: "center",
    fontSize: 23,
    fontWeight: "bold",
    padding: 15,
    marginBottom: 10,
  },
  dropdown: {
    marginTop: 8,
    marginBottom: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#0792F9",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  removeButton: {
    backgroundColor: "#FF5722",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  removeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  exerciseBox: {
    marginBottom: 10,
  },
});
