import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const AnalyticsScreen = () => {
  const userCred = getAuth().currentUser;
  const navigation = useNavigation();
  const [weightsData, setWeightsData] = useState([]);
  const [workoutsData, setWorkoutsData] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState({ weight: 0, date: "" });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [nutritionData, setNutritionData] = useState([]);
  const [user, setUser] = useState({});

  const fetchUserProfile = async () => {
    const userRef = doc(db, 'users',userCred.uid); 
    const userSnapshot = await getDoc(userRef);
    await setUser(userSnapshot.data());
  }

  const fetchUserWorkouts = () => {
    const workoutsRef = collection(db, "users", userCred.uid, "workouts");
    const q = query(workoutsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workouts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorkoutsData(workouts);
    });

    return unsubscribe;
  };

  const fetchUserNutrition = () => {
    const nutritionRef = collection(db, "users", userCred.uid, "nutrition");
    const q = query(nutritionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nutrition = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNutritionData(nutrition);
    });

    return unsubscribe;
  };

  const today = new Date();
  const todayNutrition = nutritionData.find((item) => {
    if (!item.createdAt) {
      return false;
    }
    const itemDate = item.createdAt.toDate();
    return (
      itemDate.getFullYear() === today.getFullYear() &&
      itemDate.getMonth() === today.getMonth() &&
      itemDate.getDate() === today.getDate()
    );
  });

  const completedWorkouts = workoutsData.filter(
    (workout) => workout.isCompleted
  ).length;
  const uncompletedWorkouts = workoutsData.length - completedWorkouts;

  const fetchUserWeights = () => {
    const weightsRef = collection(db, "users", userCred.uid, "weights");
    const q = query(weightsRef, orderBy("date", "desc"), limit(30));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const weights = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWeightsData(weights.reverse());
    });

    return unsubscribe;
  };

  const calculateTotals = (nutrition) => {
    let totalCalories = 0;
    let totalFat = 0;
    let totalProtein = 0;

    nutrition.meals.forEach((meal) => {
      totalCalories += parseFloat(meal.calories);
      totalFat += parseFloat(meal.fat);
      totalProtein += parseFloat(meal.protein);
    });

    return {
      totalCalories,
      totalFat,
      totalProtein,
    };
  };

  const calorieLimit = user && user.calorieLimit ? parseFloat(user.calorieLimit) : 0;

  const todayNutritionTotals = todayNutrition
    ? calculateTotals(todayNutrition)
    : null;


  useEffect(() => {
    const unsubscribeWeights = fetchUserWeights();
    const unsubscribeWorkouts = fetchUserWorkouts();
    const unsubscribeNutrition = fetchUserNutrition();
    fetchUserProfile(); 
    return () => {
      unsubscribeWeights();
      unsubscribeWorkouts();
      unsubscribeNutrition();
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Weight Progress</Text>
      <View style={styles.chartContainer}>
        {weightsData.length < 2 ? (
          <Text style={styles.message}>Enter more weights to see progress</Text>
        ) : (
          <LineChart
            data={{
              labels: weightsData.map((weightData, index) => `#${index + 1}`),
              datasets: [
                {
                  data: weightsData.map((weightData) => weightData.weight),
                },
              ],
            }}
            width={Dimensions.get("window").width - 20}
            height={300}
            yAxisSuffix="kg"
            onDataPointClick={({ index, x, y }) => {
              const screenWidth = Dimensions.get("window").width;
              const tooltipWidth = 80; 
              const padding = 10;

              let newX = x;
              if (x + tooltipWidth / 2 + padding > screenWidth) {
                newX = x - (x + tooltipWidth / 2 + padding - screenWidth);
              } else if (x - tooltipWidth / 2 - padding < 0) {
                newX = x + Math.abs(x - tooltipWidth / 2 - padding);
              }

              setTooltipData({
                weight: weightsData[index].weight,
                date: weightsData[index].date.toDate().toLocaleDateString(),
              });
              setTooltipPosition({ x: newX, y: y });
              setTooltipVisible(true);
            }}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(7, 146, 249, ${opacity})`,
              strokeWidth: 2,
              barPercentage: 0.5,
              decimalPlaces: 1,
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        )}
        {tooltipVisible && (
          <View
            style={[
              styles.tooltip,
              { top: tooltipPosition.y - 40, left: tooltipPosition.x - 50 },
            ]}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={() => setTooltipVisible(false)}
              activeOpacity={1}
            />

            <Text style={styles.tooltipText}>
              Weight: {tooltipData.weight} kg{"\n"}
              Date: {tooltipData.date}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.weightBtn}
          onPress={() => navigation.navigate("WeightHistory")}
        >
          <Text style={styles.weightBtnTxt}>View Weight History</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.workoutStatsContainer}>
        <Text style={styles.workoutStatsTitle}>Workout Stats</Text>
        <Text style={styles.workoutStatsText}>
          Completed Workouts: {completedWorkouts}
        </Text>
        <Text style={styles.workoutStatsText}>
          Incomple Workouts: {uncompletedWorkouts}
        </Text>
      </View>
      <View style={styles.nutritionCard}>
        <Text style={styles.nutritionCardTitle}>Today's Nutrition</Text>
        {todayNutritionTotals ? (
          <>
            <View style={styles.caloriesContainer}>
              <ProgressChart
                data={{
                  labels: ["Calories"],
                  data: [todayNutritionTotals.totalCalories / (calorieLimit || 1)],
                }}
                width={Dimensions.get("window").width}
                height={200}
                strokeWidth={8}
                radius={75}
                chartConfig={{
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: (opacity = 1) => `rgba(7, 146, 249, ${opacity})`,
                  strokeWidth: 2,
                  barPercentage: 0.5,
                }}
                hideLegend={true}
              />
              <Text style={styles.caloriesText}>
                {todayNutritionTotals.totalCalories} / {user.calorieLimit} kcal
              </Text>
            </View>
            <View style={styles.nutritionDetailsContainer}>
              <Text style={styles.nutritionCardText}>
                Fat: {todayNutritionTotals.totalFat}g
              </Text>
              <Text style={styles.nutritionCardText}>
                Protein: {todayNutritionTotals.totalProtein}g
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.nutritionCardText}>No data available</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    alignItems: "center",
    paddingTop: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "center",
  },
  chartContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
  },
  weightBtn: {
    backgroundColor: "#0792F9",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "70%",
    alignSelf: "center",
  },
  weightBtnTxt: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  message: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  workoutStatsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  workoutStatsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  workoutStatsText: {
    fontSize: 18,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tooltipText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  nutritionCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nutritionCardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  caloriesContainer: {
    alignItems: "center",
  },
  caloriesText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  nutritionDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  nutritionCardText: {
    fontSize: 18,
  },  
});
