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
    <View style={styles.container}>
      <Text style={styles.title}>Recent Workouts</Text>
      {/* List for rendering items */}
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.key}
        style={{ flex: 1, overflow: "scroll", }}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={(progress, dragX) =>
              renderRightActions(progress, dragX, item)
            }
          >
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() =>
                navigation.navigate("CreatedWorkout", {
                  day: item.day,
                  notes: item.notes,
                  exercises: item.exercises,
                  id: item.key,
                  name: item.name,
                  trainingType: item.trainingType,
                })
              }
            >
              <View style={styles.card}>
                <Text style={styles.workoutName}>{item.name}</Text>
                <View style={styles.dateContainer}>
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={16}
                    color="gray"
                  />
                  <Text style={styles.date}>{item.day}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}
      />
    </View>
  );
};

export default RecentWorkoutCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 10,
    height: '90%',
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 20,
  },
  cardContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "black",
    marginLeft: 20,
    marginRight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 18,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  date: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  deleteBtn: {
    justifyContent: 'center',
  },
  deleteText: {
    marginRight: 15,
    fontWeight: 'bold',
    fontSize: 12,
  },
});