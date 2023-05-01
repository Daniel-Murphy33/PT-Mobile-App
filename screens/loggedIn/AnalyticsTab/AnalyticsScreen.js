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
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import ToolTip from "react-native-tooltip";

const AnalyticsScreen = () => {
  const userCred = getAuth().currentUser;
  const navigation = useNavigation();
  const [weightsData, setWeightsData] = useState([]);
  const [workoutsData, setWorkoutsData] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState({ weight: 0, date: "" });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    const unsubscribeWeights = fetchUserWeights();
    const unsubscribeWorkouts = fetchUserWorkouts();
    return () => {
      unsubscribeWeights();
      unsubscribeWorkouts();
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
              const tooltipWidth = 100; // You can adjust this value based on the tooltip size.
              const padding = 10;
            
              let newX = x;
              if (x + tooltipWidth / 2 + padding > screenWidth) {
                newX = x - (x + tooltipWidth / 2 + padding - screenWidth);
              } else if (x - tooltipWidth / 2 - padding < 0) {
                newX = x + (Math.abs(x - tooltipWidth / 2 - padding));
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
          Uncompleted Workouts: {uncompletedWorkouts}
        </Text>
      </View>
    </ScrollView>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
});
