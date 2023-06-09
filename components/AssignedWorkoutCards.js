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
  where,
  getDocs,
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
    <TouchableOpacity style={styles.deleteBtn} onPress={() => DeleteWorkout(item)}>
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

const DeleteWorkout = (item) => {
  const user = getAuth().currentUser;

  Alert.alert(
    "Delete Workout",
    "Are you sure you want to delete this workout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          const docRef = doc(db, "workouts", item.key);
          deleteDoc(docRef);
        },
      },
    ],
    { cancelable: false }
  );
};

const AssignedWorkoutCards = () => {
  const user = getAuth().currentUser;
  const [workouts, setWorkouts] = useState([]);
  const navigation = useNavigation();

  // getting from firestore
  const GetWorkout = async () => {
    if (user) {
      const colRef = collection(db, "workouts");
      const q = query(colRef);
      const subscriber = onSnapshot(q, (snapshot) => {
        let newWorkouts = [];
        snapshot.docs.forEach((doc) => {
          const workoutData = doc.data();
          // console.log("Fetched workout data:", workoutData);
  
          const clientsArray = workoutData.clients || [];
          if (
            workoutData.client === user.email ||
            clientsArray.some((client) => client.email === user.email)
          ) {
            newWorkouts.push({ ...workoutData, key: doc.id });
          }
        });
        setWorkouts(newWorkouts);
        // console.log("Filtered workouts:", newWorkouts);
      });
      return () => subscriber();
    }
  };
  
  useEffect(() => {
    GetWorkout();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        key={(item) => item.id}
        style={{ flex: 1, overflow: "scroll" }}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <Swipeable
              renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, item)
              }
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("CreatedWorkout", {
                    day: item.day,
                    exercises: item.exercises,
                    id: item.key,
                    name: item.name,
                    trainingType: item.trainingType,
                    notes: item.notes,
                    client: item.client,
                    isCompleted: item.isCompleted,
                    isAssigned: true,
                  })
                }
              >
                <View style={styles.header}>
                  <Text style={styles.workoutName}>{item.name}</Text>
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={24}
                    color="black"
                  />
                </View>
                <View style={styles.typeContainer}>
                  <Text style={styles.trainingType}>{item.trainingType}</Text>
                  <Text style={styles.day}>{item.day}</Text>
                </View>
              </TouchableOpacity>
            </Swipeable>
          </View>
        )}
      />
    </View>
  );
};
  
export default AssignedWorkoutCards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trainingType: {
    fontSize: 16,
  },
  day: {
    fontSize: 16,
  },
  deleteBtn: {
    justifyContent: "center",
  },
  deleteText: {
    marginRight: 15,
    fontWeight: "bold",
    fontSize: 12,
  },
});