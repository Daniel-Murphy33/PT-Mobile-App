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
import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { Swipeable } from "react-native-gesture-handler";
import { Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

//for swiping
const renderRightActions = (progress, dragX, item) => {

  const user = getAuth().currentUser;

  const trans = dragX.interpolate({
    inputRange: [0, 50, 100, 101],
    outputRange: [0, 0, 0, 1],
  });
  return (
    <TouchableOpacity
      style={styles.deleteBtn}
      onPress={() => {
        const docRef = doc(db, "users", user.uid, "workouts", item.key);
        deleteDoc(docRef);
      }}
    >
      <Ionicons name="trash-bin" size={40} color="red" />
      <Animated.Text
        style={[
          styles.deleteText,
          {
            transform: [{ translateX: trans }],
          },
        ]}
      >
        Delete
      </Animated.Text>
    </TouchableOpacity>
  );
};



const RecentWorkoutCard = () => {
  const user = getAuth().currentUser;
  const [workouts, setWorkouts] = useState([]);
  const navigation = useNavigation();

  // getting from firestore
  const GetWorkout = async () => {
    // get user
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const colRef = collection(docRef, "workouts");
      const q = await query(
        colRef,
        orderBy("createdAt", "desc"),
        limit(3),
        // Add a where clause to filter by documents created within the last 3 items
        where("createdAt", ">", new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
      );
      const subscriber = onSnapshot(q, (snapshot) => {
        let newWorkouts = [];
        snapshot.docs.forEach((doc) => {
          newWorkouts.push({ ...doc.data(), key: doc.id });
        });
        setWorkouts(newWorkouts);
        console.log(newWorkouts);
      });
      return () => subscriber();
    }
  };

  useEffect(() => {
    GetWorkout();
  }, []);

  return (
    <View style={{ height: "90%" }}>
      <Text style={styles.title2}>Recent Workouts</Text>
      {/* List for rendering items  */}
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.key}
        style={{ flex: 1, overflow: "scroll" }} 
        renderItem={({ item }) => (
          <Swipeable
            style={{ height: "90%" }}
            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
          >
            <TouchableOpacity
              style={styles.exerciseContainer}
              onPress={() =>
                navigation.navigate("CreatedWorkout", {
                  day: item.day,
                  exercises: item.exercises,
                  id: item.id,
                  name: item.name,
                  trainingType: item.trainingType,
                })
              }
            >
              <Text style={styles.title}>{item.day}</Text>
              <Text style={styles.exerciseSetsReps}>
                {item.name} - {item.trainingType}
              </Text>
              {item.exercises.map((exercise, index) => (
                <Text key={index} style={styles.exerciseSetsReps}>
                  {exercise.name} - Sets x{exercise.sets} - Reps x
                  {exercise.reps}
                </Text>
              ))}
            </TouchableOpacity>
          </Swipeable>
        )}        
      />
    </View>
  );
};

export default RecentWorkoutCard;

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
  title2: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 20,
  },
  exerciseSetsReps: {
    fontSize: 16.5,
    color: "gray",
    marginTop: 5,
    fontWeight: "bold",
  },
  deleteBtn:{
    justifyContent:'center',
  }, 
  deleteText: {
    marginRight: 15,
    fontWeight:'bold',
    fontSize: 12,
  },
});
