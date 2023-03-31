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

const AddWorkoutScreen = () => {
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
  const [notes, setNotes] = useState("");

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
          notes: notes,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.log(e);
      }

      setDay("");
      setName("");
      setExercises([{ name: "" }]);
      setNotes("");
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

            <View style={[styles.formBox, {zIndex:1,}]}>
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

            {exercises.map((exercise, index) => (
              <View key={index} style={styles.formBox}>
                <Text style={styles.label}>Exercise {index + 1} :</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter exercise name..."
                  placeholderTextColor={"grey"}
                  value={exercise.name}
                  onChangeText={(text) =>
                    handleExerciseChange(index, "name", text)
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter sets..."
                  placeholderTextColor={"grey"}
                  keyboardType="numeric"
                  value={exercise.sets}
                  onChangeText={(text) =>
                    handleExerciseChange(index, "sets", text)
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter reps..."
                  placeholderTextColor={"grey"}
                  keyboardType="numeric"
                  value={exercise.reps}
                  onChangeText={(text) =>
                    handleExerciseChange(index, "reps", text)
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter weight..."
                  placeholderTextColor={"grey"}
                  value={exercise.weight}
                  onChangeText={(text) =>
                    handleExerciseChange(index, "weight", text)
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter video link..."
                  placeholderTextColor={"grey"}
                  value={exercise.videoLink}
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
                value={notes}
                onChangeText={setNotes}
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

export default AddWorkoutScreen;

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
  overlay: {
    zIndex: 9999,
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
