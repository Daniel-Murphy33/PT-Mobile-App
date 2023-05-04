import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { db } from "../../../firebase";
import { getAuth } from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const AddClientsScreen = () => {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([{ name: "", email: "" }]);
  const navigation = useNavigation();

  // Create client in Firestore
  const addClient = async () => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        const docRef = doc(db, "clients", user.uid);
        const colRef = collection(docRef, "clients");
        await addDoc(colRef, {
          name: clientName,
          email: clientEmail,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.log(e);
      }
      setClientName("");
      setClientEmail("");
    }
    navigation.goBack();
  };

  // Create team in Firestore
  const addTeam = async () => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        const docRef = doc(db, "teams", user.uid);
        const colRef = collection(docRef, "teams");
        await addDoc(colRef, {
          name: teamName,
          members: members,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.log(e);
      }
      setTeamName("");
      setMembers([{ name: "", email: "" }]);
    }
    navigation.goBack();
  };

  // Handle adding or removing a member
  const handleMemberChange = (index, key, value) => {
    const newMembers = [...members];
    newMembers[index][key] = value;
    setMembers(newMembers);
  };

  const handleAddMember = () => {
    setMembers([...members, { name: "", email: "" }]);
  };

  const handleRemoveMember = (index) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#0792F9" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Add Client</Text>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={clientName}
            onChangeText={setClientName}
            placeholder="Enter Client Name..."
            placeholderTextColor={"grey"}
          />
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={clientEmail}
            onChangeText={setClientEmail}
            autoCapitalize="none"
            placeholder="Enter Client Email..."
            placeholderTextColor={"grey"}
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.addButton} onPress={addClient}>
            <Text style={styles.buttonText}>Add Client</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Add Team</Text>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={teamName}
            onChangeText={setTeamName}
            placeholder="Enter Team Name..."
            placeholderTextColor={"grey"}
          />
          {members.map((member, index) => (
            <View key={index} style={styles.member}>
              <Text style={styles.label}>Member {index + 1}:</Text>
              <View style={styles.memberInput}>
                <TextInput
                  style={styles.memberName}
                  value={member.name}
                  onChangeText={(value) =>
                    handleMemberChange(index, "name", value)
                  }
                  placeholder="Name..."
                  placeholderTextColor={"grey"}
                />
                <TextInput
                  style={styles.memberEmail}
                  placeholderTextColor={"grey"}
                  value={member.email}
                  onChangeText={(value) =>
                    handleMemberChange(index, "email", value)
                  }
                  autoCapitalize="none"
                  placeholder="Email..."
                  keyboardType="email-address"
                />
                <TouchableOpacity
                  style={styles.removeMemberButton}
                  onPress={() => handleRemoveMember(index)}
                >
                  <Text style={styles.removeMemberButtonText}>-</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addMemberButton}
            onPress={handleAddMember}
          >
            <Text style={styles.addMemberButtonText}>Add Member</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={addTeam}>
            <Text style={styles.buttonText}>Add Team</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddClientsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    alignSelf: "center",
    marginTop: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: 15,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#0792F9",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  member: {
    marginBottom: 20,
  },
  memberInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberName: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
  },
  memberEmail: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
  },
  addMemberButton: {
    backgroundColor: "#0792F9",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  addMemberButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  removeMemberButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  removeMemberButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
