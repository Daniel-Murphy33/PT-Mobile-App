import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  doc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
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
      onPress={() => DeleteUser(item)}
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

const DeleteUser = (item) => {
  const user = getAuth().currentUser;

  Alert.alert(
    'Delete Account',
    'Are you sure you want to delete this workout?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          const docRef = doc(db, "users", user.uid, "workouts", item.key);
          deleteDoc(docRef);
        },
      },
    ],
    { cancelable: false }
  );
};

const WorkoutCards = () => {


  const user = getAuth().currentUser;
  const [workouts, setWorkouts] = useState([]);
  const navigation = useNavigation();

  // getting from firestore
  const GetWorkout = async () => {
    // get user
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const colRef = collection(docRef, "workouts");
      const q = await query(colRef, orderBy("createdAt", "desc"));
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
      {/* List for rendering items  */}
      <FlatList
        data={workouts}
        key={(item) => item.id}
        style={{ flex: 1, overflow: "scroll" }} 
        renderItem={({ item }) => (
          <View>
            <Swipeable

              renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, item)
              }
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
                  notes: item.notes,
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
          </View>
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
  deleteBtn:{
    justifyContent:'center',
  }, 
  deleteText: {
    marginRight: 15,
    fontWeight:'bold',
    fontSize: 12,
  }, 
});
