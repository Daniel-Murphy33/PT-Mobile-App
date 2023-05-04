import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { updateDoc, arrayUnion, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebase";

const TeamScreen = ({ route }) => {
  const { id, name, members } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const addMember = async () => {
    if (memberName.trim() !== "" && memberEmail.trim() !== "") {
      const newMember = { name: memberName, email: memberEmail };
  
      // Get current user
      const userCred = getAuth().currentUser;
  
      // Update the team members in Firestore database
      const teamRef = doc(db, "teams", userCred.uid, "teams", id);
  
      try {
        await updateDoc(teamRef, {
          members: arrayUnion(newMember),
        });
        setModalVisible(false);
        setMemberName("");
        setMemberEmail("");
        navigation.goBack();
      } catch (error) {
        console.error("Error updating team members: ", error);
      }
    }
  };
  
  const getMembers = () => {
    return members;
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ left: 20 }}>
        <Ionicons name="arrow-back" size={30} color="#0792F9" />
      </TouchableOpacity>
      <Text style={styles.title}>{name}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AssignAll", {
        getMembers: getMembers,
      })}>
        <Text style={styles.buttonText}>Assign All</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Add Members</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add Member</Text>
            <TextInput
              style={styles.input}
              onChangeText={setMemberName}
              value={memberName}
              placeholder="Name"
              placeholderTextColor={"grey"}
            />
            <TextInput
              style={styles.input}
              onChangeText={setMemberEmail}
              value={memberEmail}
              placeholder="Email"
              placeholderTextColor={"grey"}
              keyboardType="email-address"
            />
            <Button title="Add Member" onPress={addMember} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <FlatList
        data={members}
        renderItem={({ item: member }) => (
          <View style={styles.memberContainer}>
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() =>
                navigation.navigate("SingleClient", {
                  name: member.name,
                  email: member.email,
                })
              }
            >
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    paddingRight: 8,
    width: "100%",
    marginBottom: 15,
  },
});