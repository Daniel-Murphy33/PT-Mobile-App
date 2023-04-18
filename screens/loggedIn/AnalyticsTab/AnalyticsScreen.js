import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
} from "victory-native";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { getAuth } from "firebase/auth";
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const AnalyticsScreen = () => {
  const userCred = getAuth().currentUser;
  const navigation = useNavigation();
  const [weightsData, setWeightsData] = useState([]);

  const fetchUserWeights = () => {
    const weightsRef = collection(db, "users", userCred.uid, "weights");
    const q = query(weightsRef, orderBy("date", "desc"), limit(30));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const weights = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(weights);
      setWeightsData(weights.reverse());
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchUserWeights();
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    // <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Weight Progress</Text>
      <View style={styles.chartContainer}>
        <VictoryChart theme={VictoryTheme.material} >
          <VictoryAxis
            label={"Weight"}
            dependentAxis
            style={{
              axisLabel: { fontSize: 20, padding: 30, fontWeight: "bold", },
              tickLabels: { fontSize: 15, padding: 5,  },
            }}
            tickLabelComponent={<VictoryLabel textAnchor="start" />}
          />
          <VictoryAxis
          label={"Date"}
            style={{
              axisLabel: { fontSize: 20, padding: 30, fontWeight: "bold", },
              tickLabels: { fontSize: 15, padding: 5,  },
            }}
          />
          <VictoryLine
            data={weightsData.map((weightData, index) => ({
              x: index,
              y: weightData.weight,
            }))}
            style={{
              data: { stroke: "#0792F9", strokeWidth: 8 },
            }}
          />
        </VictoryChart>
        <TouchableOpacity style={styles.weightBtn} onPress={() => navigation.navigate("WeightHistory")}>
          <Text style={styles.weightBtnTxt}>View Weight History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.weightBtn} onPress={() => navigation.navigate("PromptForm")}>
          <Text style={styles.weightBtnTxt}>Create AI generated Workout</Text>
        </TouchableOpacity>
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
    alignSelf: 'center',
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
    width: '70%',
    alignSelf: 'center',
  },
  weightBtnTxt: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

