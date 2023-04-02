import { Pressable, Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import NutritionCards from "../../../components/NutritionCards";
import { Ionicons } from "@expo/vector-icons";


const AllNutritionScreen = () => {
  //getting the user data
  const user = getAuth().currentUser;

  //setting the state
  const [plams, setPlans] = useState([]);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.heading}>
      <View style ={{zIndex: 1}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={30}
            color="#0792F9"
            style={styles.arrow}
          />
        </TouchableOpacity>
        </View>
      <View style={styles.header}>
        {/* heading */}
        <Text style={styles.heading}>Nutrition Plans</Text>
        {/* delete all  */}
        <Pressable>
          <Entypo name="menu" size={30} color="black" />
        </Pressable>
      </View>
      <NutritionCards /> 
    </SafeAreaView>
  );
};

export default AllNutritionScreen;

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 10,
  },
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
  arrow: {
    position: "absolute",
    top: 0,
    left: 10,
    
  },
  exerciseSetsReps: {
    fontSize: 16.5,
    color: "gray",
    marginTop: 5,
    fontWeight: "bold",
  },

  container: {
    backgroundColor: "lightgrey",
    padding: 10,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    borderRadius: 15,
    marginTop: 20,
  },

  innerContainer: {
    alignItems: "center",
    flexDirection: "column",
  },

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
    textAlign: 'center',
  },

  button: {
    backgroundColor: "#0792F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    // fontSize: 16,
  },

  noOfExercises: {
    fontSize: 20,
    fontWeight: "500",
    marginRight: 20,
  },

  input: {
    backgroundColor: "lightgrey",
    padding: 10,
    fontSize: 17,
    width: "90%",
    alignSelf: "center",
    marginTop: "auto",
    borderRadius: 10,
  },
});
