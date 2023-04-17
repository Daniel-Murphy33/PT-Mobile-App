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
        const docRef = doc(db, "users", user.uid, "nutrition", item.key);
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

const DeleteUser = (item) => {
  const user = getAuth().currentUser;

  Alert.alert(
    "Delete Account",
    "Are you sure you want to delete this meal plan?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          const docRef = doc(db, "users", user.uid, "nutrition", item.key);
          deleteDoc(docRef);
        },
      },
    ],
    { cancelable: false }
  );
};

const AssignedNutritionCards = () => {
  const user = getAuth().currentUser;
  const [nutrition, setNutrition] = useState([]);
  const navigation = useNavigation();

  // getting from firestore
  const GetNutrition = async () => {
    // get user
    if (user) {
      const colRef = collection(db, "nutrition"); 
      const q = await query(colRef, where("client", "==", user.email));
      const subscriber = onSnapshot(q, (snapshot) => {
        let newNutrition = [];
        snapshot.docs.forEach((doc) => {
          newNutrition.push({ ...doc.data(), key: doc.id });
        });
        setNutrition(newNutrition);
        console.log(newNutrition);
      });
      return () => subscriber();
    }
  };

  useEffect(() => {
    GetNutrition();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={nutrition}
        keyExtractor={(item) => item.key}
        style={{ flex: 1, overflow: "scroll" }}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.cardContainer}>
            <Swipeable
              renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, item)
              }
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("CreatedNutrition", {
                    date: item.date,
                    notes: item.notes,
                    meals: item.meals,
                    id: item.key,
                    name: item.mealPlanName,
                  })
                }
              >
                <Text style={styles.mealPlanName}>{item.mealPlanName}</Text>
                <View style={styles.dateContainer}>
                  <MaterialCommunityIcons
                    name="calendar-today"
                    size={20}
                    color="black"
                  />
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              </TouchableOpacity>
            </Swipeable>
          </View>
        )}
      />
    </View>
  );
};

export default AssignedNutritionCards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
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
  mealPlanName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    marginLeft: 8,
    fontSize: 16,
  },
});