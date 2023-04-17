import {
    Pressable,
    Text,
    View,
    StyleSheet,
    SafeAreaView,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { Entypo } from "@expo/vector-icons";
  import AssignedWorkoutCards from "../../../components/AssignedWorkoutCards";
  
  const AllWorkoutScreen = () => { 
    return (
      <SafeAreaView style={styles.heading}>
        <View style={styles.header}>
          {/* heading */}
          <Text style={styles.heading}>Workout List</Text>
          {/* delete all  */}
          <Pressable>
            <Entypo name="menu" size={30} color="black" />
          </Pressable>
        </View>
  
        <AssignedWorkoutCards/>
  
      </SafeAreaView>
    );
  };
  
  export default AllWorkoutScreen;
  
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
  