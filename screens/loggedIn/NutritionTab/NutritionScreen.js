import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { collection, db, doc } from "../../../firebase";
import {
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import RecentNutritionCard from '../../../components/RecentNutritionCards'

const NutritionScreen = () => {
  const navigation = useNavigation();
  const user = getAuth().currentUser;
  const [userData, setUserData] = useState("");
  const uid = getAuth().currentUser.uid;

  // getting from firestore
  const GetNutrition = async () => {
    // get user
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const colRef = collection(docRef, "nutrition");
      const q = await query(colRef, orderBy("createdAt", "desc"), limit(3));

      const sub = await getDocs(q);
      sub.forEach((subs) => {
        console.log("Hello",subs.data());
      });
    }
  };

  const fetchUserProfile = async () => {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);
    await setUserData(userSnapshot.data());
  };

  useEffect(() => {
    GetNutrition();
    fetchUserProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Create a Meal Plan</Text>
        <MaterialIcons
          style={styles.icon}
          name="food-bank"
          size={45}
          color="#0792F9"
        />
        <Text style={styles.subTitle}>Add a Meal Plan</Text>
        <TouchableOpacity
          style={styles.createWorkoutBtn}
          onPress={() => navigation.navigate("AddNutrition")}
        >
          <Text style={styles.btnText}>Create Meal Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.ViewWorkoutBtn} 
          onPress={() => navigation.navigate("AllNutrition")}
        >
          <Text style={styles.btnText}>View Created Plans</Text>
        </TouchableOpacity>
        {userData.role === "client" && (
          <TouchableOpacity
            style={styles.ViewWorkoutBtn}
            onPress={() => navigation.navigate("AssignedWorkouts")}
          >
            <Text style={styles.btnText}>View Assigned Plans</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ height: "90%", marginTop: 60 }}>
        <RecentNutritionCard style={styles.card} />
      </View>
    </SafeAreaView>
  );
};

export default NutritionScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
    marginTop: 45,
    height: "90%",
  },
  title: {
    textAlign: "left",
    fontSize: 28,
    fontWeight: "bold",
    top: 45,
    left: 25,
  },
  subTitle: {
    textAlign: "left",
    fontSize: 20,
    marginTop: 20,
    marginLeft: 25,
  },
  icon: {
    alignSelf: "center",
    marginLeft: 240,
    marginTop: 5,
    marginBottom: 10,
  },
  createWorkoutBtn: {
    alignSelf: "center",
    marginTop: 40,
    backgroundColor: "#0792F9",
    width: "80%",
    height: 30,
    borderRadius: 20,
  },
  ViewWorkoutBtn: {
    alignSelf: "center",
    marginTop: 30,
    backgroundColor: "#0792F9",
    width: "80%",
    height: 30,
    borderRadius: 20,
    margin: 20,
  },
  btnText: {
    textAlign: "center",
    fontSize: 20,
    color: "white",
  },
});
