/**
 * EditUserScreen.js
 * @author Daniel Murphy
 * @studentnumber C00247818
 * @license GNU Affero General Public License v3.0
 */

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, ScrollView } from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigation } from "@react-navigation/native";

/**
 * Edit User Profile Screen
 * @returns {React.Component}
 */

const EditUserScreen = () => {
  const userCred = getAuth().currentUser;
  const [user, setUser] = useState({});
  const navigation = useNavigation();
  const [newFirstName, setNewFirstName] = useState(user.firstName);
  const [newLastName, setNewLastName] = useState(user.lastName);
  const [newAge, setNewAge] = useState(user.age);
  const [newCurrentWeight, setNewCurrentWeight] = useState(user.currentWeight);
  const [newGoalWeight, setNewGoalWeight] = useState(user.goalWeight);
  const [newCalorieLimit, setNewCalorieLimit] = useState(user.calorieLimit);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userRef = doc(db, "users", userCred.uid);
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();
      setNewFirstName(userData.firstName || "");
      setNewLastName(userData.lastName || "");
      setNewAge(userData.age || "");
      setNewCurrentWeight(userData.currentWeight || "");
      setNewGoalWeight(userData.goalWeight || "");
      setNewCalorieLimit(userData.calorieLimit || "");
    };
    fetchUserProfile();
  }, []);

  const addWeightEntry = async () => {
    try {
      const weightEntry = {
        date: new Date(),
        weight: newCurrentWeight,
      };
      await setDoc(doc(db, `users/${userCred.uid}/weights`, weightEntry.date.toISOString()), weightEntry);
      // console.log("Weight entry added");
    } catch (error) {
      console.error("Error adding weight entry: ", error);
    }
  };
  

  const handleSave = async () => {
    try {
      if (user) {
        const docRef = doc(db, `users/${userCred.uid}`);
  
        await updateDoc(docRef, {
          firstName: newFirstName,
          lastName: newLastName,
          age: newAge,
          currentWeight: newCurrentWeight,
          goalWeight: newGoalWeight,
          calorieLimit: newCalorieLimit,
        });
  
        // Add a new weight entry if the current weight has changed
        if (newCurrentWeight !== user.currentWeight) {
          await addWeightEntry();
        }
          navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating workout: ", error);
    }
  };  
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.formTitle}>Edit User Profile</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={newFirstName}
            onChangeText={setNewFirstName}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={newLastName}
            onChangeText={setNewLastName}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={newAge}
            onChangeText={setNewAge}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Current Weight</Text>
          <TextInput
            style={styles.input}
            value={newCurrentWeight}
            onChangeText={setNewCurrentWeight}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Goal Weight</Text>
          <TextInput
            style={styles.input}
            value={newGoalWeight}
            onChangeText={setNewGoalWeight}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Daily Calorie Allowance</Text>
          <TextInput
            style={styles.input}
            value={newCalorieLimit}
            onChangeText={setNewCalorieLimit}
          />
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.submitButtonContainer}
            onPress={handleSave}
          >
            <Text style={styles.submitButton}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    width: "80%",
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
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#444",
  },
  submitButtonContainer: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#0792F9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButton: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },  
});
