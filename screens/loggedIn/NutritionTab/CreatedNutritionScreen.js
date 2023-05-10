/**
 * CreatedNutritionScreen.js
 * @author Daniel Murphy
 * @studentnumber C00247818
 * @license GNU Affero General Public License v3.0
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

/**
 * Created Nutrition screen 
 * @returns {React.Component}
 */ 

const CreatedNutritionScreen = ({ route }) => {
  const { date, notes, meals, id, name } = route.params;
  const navigation = useNavigation();
  // console.log(id);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.arrowContainer}>
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
        <Text style={styles.mealPlanName}>{name}</Text>
        <View style={styles.dateContainer}>
          <MaterialCommunityIcons
            name="calendar-today"
            size={20}
            color="black"
          />
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
      <View style={styles.mealSection}>
      <TouchableOpacity
      style={styles.editButton}
        onPress={() =>
          navigation.navigate("EditNutrition", {
            date,
            name,
            meals,
            notes,
            id,
          })
        }
      >
        <Text style={styles.editButtonText}>Edit Meal Plan</Text>
      </TouchableOpacity>
        {meals.map((meal, index) => (
          <View key={index} style={styles.mealCard}>
            <Text style={styles.mealTitle}>Meal {index + 1}</Text>
            <View key={index} style={styles.foodItem}>
              <Text style={styles.foodName}>{meal.name} - {meal.servingSize}</Text>
              <Text style={styles.foodDetails}>
                {meal.calories} kcal | {meal.protein}g protein |{" "}
                {meal.carbohydrates}g carbs | {meal.fat}g fats
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.notesContainer}>
        <Text style={styles.notesTitle}>Notes:</Text>
        <Text style={styles.notesContent}>{notes}</Text>
      </View>
    </ScrollView>
  );
};

export default CreatedNutritionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 50,
    alignItems: "center",
  },
  mealPlanName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  editButton: {
    backgroundColor: "#0792F9",
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
    alignSelf: "flex-start",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  editButtonText: {
    textAlign: 'center',
    color: "white",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    marginLeft: 8,
    fontSize: 18,
  },
  mealSection: {
    marginTop: 20,
  },
  mealCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  foodItem: {
    marginBottom: 8,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  foodDetails: {
    fontSize: 14,
    color: "#888",
  },
  notesSection: {
    marginBottom: 32,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  notesContent: {
    fontSize: 16,
  },
  arrow: {
    position: "absolute",
    marginTop: 50,
    marginLeft: 10,
  },
  arrowContainer: {
    zIndex: 1,
  },
  notesContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
});
