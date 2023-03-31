import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { MaterialCommunityIcons } from "@expo/vector-icons";
  import { useNavigation } from "@react-navigation/native";
  import { collection, doc, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
  import { db } from "../firebase";
  import { getAuth } from "firebase/auth";
  
  const WorkoutCards = () => {
    const user = getAuth().currentUser;
    const [workouts, setWorkouts] = useState([]);
    const navigation = useNavigation();
  
  // getting from firestore
  const GetWorkout = async () => {
      // get user
      if (user) {
        console.log(user.email)
        const colRef = collection(db, "workouts");
        const q = await query(colRef, where("client", "==", user.email));
        const subscriber = onSnapshot(q, (snapshot) => {
          let newWorkouts = [];
          snapshot.docs.forEach((doc) => {
            newWorkouts.push({ ...doc.data(), key: doc.id });
          });
          setWorkouts(newWorkouts);
          console.log(newWorkouts)
        });
        return () => subscriber();
      }
    };
  
    useEffect(() => {
      GetWorkout();
    }, []);
  
    return (
      <View style={{ height: '90%' }}>
          {/* List for rendering items  */}
        <FlatList
          data={workouts}
          key={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.exerciseContainer} onPress={() => navigation.navigate("CreatedWorkout", {
              day: item.day,
              exercises: item.exercises,
              id: item.id,
              name: item.name,
              trainingType: item.trainingType,
          })}>
              <Text style={styles.title}>{item.day}</Text>
              <Text style={styles.exerciseSetsReps}>
                {item.name} - {item.trainingType}
              </Text>
              {item.exercises.map((exercise, index) => (
                <Text key={index} style={styles.exerciseSetsReps}>
                  {exercise.name} - Sets x{exercise.sets} - Reps x{exercise.reps}
                </Text>
              ))}
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };
  
  export default WorkoutCards;
  
  const styles = StyleSheet.create({
      exerciseContainer: {
          backgroundColor: "#fff",
          padding: 20,
          marginVertical: 8,
          marginHorizontal: 16,
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
        title: {
          fontSize: 25,
          fontWeight: "bold",
        },
        exerciseSetsReps: {
          fontSize: 16.5,
          color: "gray",
          marginTop: 5,
          fontWeight: "bold",
        },
  });
  