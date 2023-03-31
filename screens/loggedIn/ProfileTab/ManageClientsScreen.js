import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "react-native";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { db } from "../../../firebase";

const ManageClientsScreen = () => {
  const navigation = useNavigation();
  const user = getAuth().currentUser;

  const [clients, setClients] = useState("");

  const CLIENTS = [
    { id: 1, name: "John Doe", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com" },
    { id: 4, name: "John Doe", email: "john.doe@example.com" },
    { id: 5, name: "Jane Smith", email: "jane.smith@example.com" },
    { id: 6, name: "Bob Johnson", email: "bob.johnson@example.com" },
    { id: 7, name: "John Doe", email: "john.doe@example.com" },
    { id: 8, name: "Jane Smith", email: "jane.smith@example.com" },
    { id: 9, name: "Bob Johnson", email: "bob.johnson@example.com" },
    // Add more clients as needed
  ];

  // getting from firestore
const GetClients = async () => {
  // get user
  if (user) {
    const docRef = doc(db, "clients", user.uid);
    const colRef = collection(docRef, "clients");
    const q = await query(colRef, orderBy("createdAt", "desc"));
    const subscriber = onSnapshot(q, (snapshot) => {
      let newClients = [];
      snapshot.docs.forEach((doc) => {
        newClients.push({ ...doc.data(), key: doc.id });
      });
      setClients(newClients);
      console.log(newClients)
    });
    return () => subscriber();
  }
};

useEffect(() => {
  GetClients();
}, []); 

  const AddClientScreen = () => {
    navigation.navigate("AddClients");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Manage Clients</Text>
      <TouchableOpacity
        style={styles.addClientBtn}
        onPress={() => navigation.navigate("AddClients")}
      >
        <Text style={styles.addClientBtnTxt}>Add Clients</Text>
      </TouchableOpacity>
      <Text style={styles.title}>All Clients</Text>
      <FlatList
        data={clients}
        style={{ marginTop: 25, overflow: "scroll" }}
        key={item => item.id}
        renderItem={({ item: client }) => (
          <View style={styles.clientContainer}>
            <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate("SingleClient", {
            name: client.name,
            email: client.email,
        })}>
            <Text style={styles.clientName}>{client.name}</Text>
            <Text style={styles.clientEmail}>{client.email}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ManageClientsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
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
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 25,
  },
  addClientBtn: {
    alignSelf: "center",
    backgroundColor: "#0792F9",
    width: "80%",
    height: 30,
    borderRadius: 20,
    marginTop: 25,
  },
  addClientBtnTxt: {
    textAlign: "center",
    fontSize: 20,
    color: "white",
  },
  clientContainer: {
    justifyContent: 'center',
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
    width: 350,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  clientEmail: {
    fontSize: 16,
    color: "#666",
  },
});
