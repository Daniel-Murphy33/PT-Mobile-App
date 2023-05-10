/**
 * ManageClientsScreen.js
 * @author Daniel Murphy
 * @studentnumber C00247818
 * @license GNU Affero General Public License v3.0
 */

import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import { db } from "../../../firebase";
import { Ionicons } from "@expo/vector-icons";

/**
 * Manage Clients and team screen 
 * @returns {React.Component}
 */

const ManageClientsScreen = () => {
  const navigation = useNavigation();
  const user = getAuth().currentUser;

  const [clients, setClients] = useState("");
  const [teams, setTeams] = useState([]);

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
        // console.log(newClients);
      });
      return () => subscriber();
    }
  };

  const GetTeams = async () => {
    if (user) {
      const docRef = doc(db, "teams", user.uid);
      const colRef = collection(docRef, "teams");
      const q = await query(colRef, orderBy("createdAt", "desc"));
      const subscriber = onSnapshot(q, (snapshot) => {
        let newTeams = [];
        snapshot.docs.forEach((doc) => {
          newTeams.push({ ...doc.data(), key: doc.id });
        });
        setTeams(newTeams);
        // console.log(newTeams);
      });
      return () => subscriber();
    }
  };

  useEffect(() => {
    GetClients();
    GetTeams();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ left: 20 }}
      >
        <Ionicons name="arrow-back" size={30} color="#0792F9" />
      </TouchableOpacity>
      <Text style={styles.title}>Manage Clients</Text>
      <TouchableOpacity
        style={styles.addClientBtn}
        onPress={() => navigation.navigate("AddClients")}
      >
        <Text style={styles.addClientBtnTxt}>Add Client / Team</Text>
      </TouchableOpacity>
      <Text style={styles.title}>All Clients</Text>
      <FlatList
        data={clients}
        style={{ marginTop: 25, overflow: "scroll" }}
        keyExtractor={(item) => item.key}
        renderItem={({ item: client }) => (
          <View style={styles.clientContainer}>
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() =>
                navigation.navigate("SingleClient", {
                  name: client.name,
                  email: client.email,
                })
              }
            >
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={styles.clientEmail}>{client.email}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.title}>All Teams</Text>
      <FlatList
        data={teams}
        style={{ marginTop: 25, overflow: "scroll" }}
        keyExtractor={(item) => item.key}
        renderItem={({ item: team }) => (
          <View style={styles.clientContainer}>
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() =>
                navigation.navigate("TeamScreen", {
                  id: team.key,
                  name: team.name,
                  members: team.members,
                })
              }
            >
              <Text style={styles.clientName}>{team.name}</Text>
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 15,
    alignSelf: "center",
  },
  addClientBtn: {
    alignSelf: "center",
    backgroundColor: "#0792F9",
    width: "80%",
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    marginBottom: 20,
  },
  addClientBtnTxt: {
    textAlign: "center",
    fontSize: 20,
    color: "white",
  },
  clientContainer: {
    justifyContent: "center",
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
    marginHorizontal: 16,
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
});
