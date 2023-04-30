import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";

const TeamScreen = ({ route }) => {
  const { id, name, members } = route.params;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AssignAll")}>
        <Text style={styles.buttonText}>Assign All</Text>
      </TouchableOpacity>
      <FlatList
        data={members}
        renderItem={({ item: member }) => (
        <View style={styles.memberContainer}>
            <TouchableOpacity style={styles.cardContainer} onPress={() =>
                navigation.navigate("SingleClient", {
                  name: member.name,
                  email: member.email,
                })
              }>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberEmail}>{member.email}</Text>
            </TouchableOpacity>
        </View>
        )}
      />
    </SafeAreaView>
  );
};

export default TeamScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 15,
    alignSelf: "center",
  },
  memberContainer: {
    justifyContent: "center",
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
    marginHorizontal: 16,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  memberEmail: {
    fontSize: 16,
    color: "#666",
  },
  cardContainer: {
    backgroundColor: "#fff",
    padding: 20,
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
  button: {
    width: "40%",
    backgroundColor: "#0792F9",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});
