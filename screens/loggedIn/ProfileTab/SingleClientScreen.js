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
  Button,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { getAuth } from "firebase/auth";
import {
  doc,
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect } from "react";

const FormOne = () => {
  //navigation through screens
  const navigation = useNavigation();

  //for changing metric system
  const [weightUnitOpen, setWeightUnitOpen] = useState(false);
  const [weightUnitValue, setWeightUnitValue] = useState("kg");
  const [weightUnitItems, setWeightUnitItems] = useState([
    { label: "kg", value: "kg" },
    { label: "lbs", value: "lbs" },
  ]);

  // for dropdown
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Strength", value: "Strength" },
    { label: "Fitness", value: "Fitness" },
    { label: "Hybrid", value: "Hybrid" },
  ]);

  const [day, setDay] = useState("");
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: "", reps: "", weight: "", videoLink: "" },
  ]);

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      { name: "", sets: "", reps: "", weight: "", videoLink: "" },
    ]);
  };

  const handleRemoveExercise = (index) => {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  //Create in Firesotre
  const AddWorkout = async () => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        const colRef = collection(docRef, "workouts");
        addDoc(colRef, {
          day: day,
          name: name,
          trainingType: value,
          exercises: exercises,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.log(e);
      }

      setDay("");
      setName("");
      setExercises([{ name: "" }]);
      console.log(exercises);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.title}>Create Workout</Text>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          nestedScrollEnabled={true}
        >
          <View style={styles.formWrapper}>
            <View style={styles.formBox}>
              <Text style={styles.label}>Day :</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter day..."
                placeholderTextColor={"grey"}
                value={day}
                onChangeText={setDay}
              />
            </View>

            <View style={styles.formBox}>
              <Text style={styles.label}>Workout Name :</Text>
              <TextInput
                style={styles.input}
                placeholder={"Enter workout name..."}
                placeholderTextColor={"grey"}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={[styles.formBox, { zIndex: 1 }]}>
              <Text style={styles.label}>Select Training Type :</Text>
              <DropDownPicker
                style={styles.input}
                overlayStyle={styles.overlay}
                placeholder={"Select Training Type"}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                required={true}
                listMode="SCROLLVIEW"
                modal
              />
            </View>

            {exercises.map((meal, index) => (
              <View key={index} style={styles.formBox}>
                <Text style={styles.sectionTitle}>Exercise {index + 1}</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter exercise name..."
                  placeholderTextColor={"grey"}
                  value={meal.name}
                  onChangeText={(text) =>
                    handleExerciseChange(index, "name", text)
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter sets..."
                  placeholderTextColor={"grey"}
                  keyboardType="numeric"
                  value={meal.sets}
                  onChangeText={(text) =>
                    handleExerciseChange(index, "sets", text)
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter reps..."
                  placeholderTextColor={"grey"}
                  keyboardType="numeric"
                  value={meal.reps}
                  onChangeText={(text) =>
                    handleExerciseChange(index, "reps", text)
                  }
                />

                <TextInput
                  style={styles.weightInput}
                  placeholder="Enter weight..."
                  placeholderTextColor={"grey"}
                  value={meal.weight}
                  onChangeText={(text) =>
                    handleExerciseChange(index, "weight", text)
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter video link..."
                  placeholderTextColor={"grey"}
                  value={meal.videoLink}
                  onChangeText={(text) =>
                    handleExerciseChange(index, "videoLink", text)
                  }
                />

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddExercise}
                >
                  <Text style={styles.addButtonText}>Add Exersie</Text>
                </TouchableOpacity>

                {index > 0 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveExercise(index)}
                  >
                    <Text style={styles.removeButtonText}>Remove Exercise</Text>
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
              />
            </View>

            <TouchableOpacity style={styles.addButton} onPress={AddWorkout}>
              <Text style={styles.addButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const FormTwo = () => {
  const [date, setDate] = useState("");
  const [mealPlanName, setMealPlanName] = useState("");
  const [meals, setMeals] = useState([
    {
      name: "",
      servingSize: "",
      calories: "",
      fat: "",
      carbohydrates: "",
      protein: "",
    },
  ]);

  const handleAddMeal = () => {
    setMeals([
      ...meals,
      {
        name: "",
        servingSize: "",
        calories: "",
        fat: "",
        carbohydrates: "",
        protein: "",
      },
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
                <Text style={styles.sectionTitle}>Meal {index + 1}</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter food name..."
                  placeholderTextColor={"grey"}
                  value={meal.name}
                  onChangeText={(text) => handleMealChange(index, "name", text)}
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
                  onChangeText={(text) => handleMealChange(index, "fat", text)}
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

const SingleClientScreen = () => {
  const [showFormOne, setShowFormOne] = useState(true);

  const toggleForm = () => {
    setShowFormOne(!showFormOne);
  };

  return (
    <View style={styles.container}>
      {showFormOne ? <FormOne /> : <FormTwo />}
      <View style={styles.buttonContainer}>
        <Button
          style={{ marginBottom: 20 }}
          title={showFormOne ? "Show Nutrition" : "Show Workout"}
          onPress={toggleForm}
        />
      </View>
    </View>
  );
};

export default SingleClientScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  weightUnitPicker: {
    width: 100,
    margin: 5,
    marginLeft: 10,
    backgroundColor: 'white',
  },
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
