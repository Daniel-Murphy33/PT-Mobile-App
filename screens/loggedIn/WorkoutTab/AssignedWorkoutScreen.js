import {
  Pressable,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import AssignedWorkoutCards from "../../../components/AssignedWorkoutCards";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const AssignedWorkoutScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.heading}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ right: 15 }}
        >
          <Ionicons name="arrow-back" size={30} color="#0792F9" />
        </TouchableOpacity>
        <Text style={styles.heading}>Workout List</Text>
        <Pressable>
          <Entypo name="menu" size={30} color="black" />
        </Pressable>
      </View>

      <AssignedWorkoutCards />
    </SafeAreaView>
  );
};

export default AssignedWorkoutScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  heading: {
    fontWeight: "900",
    fontStyle: "bold",
    fontSize: 30,
    flex: 1,
    marginTop: 20,
  },
});
