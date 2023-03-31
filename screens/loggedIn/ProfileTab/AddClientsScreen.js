import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { db } from "../../../firebase";
import { getAuth } from "firebase/auth";
import { doc, setDoc, serverTimestamp, addDoc, collection } from "firebase/firestore";


const AddClientsScreen = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  //Create in Firesotre
  const AddClient = async () => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        const docRef = doc(db, "clients", user.uid);
        const colRef = collection(docRef, "clients")
        addDoc(colRef, {
          name: name,
          email: email,
          createdAt: serverTimestamp(),
          
        });
      } catch (e) {
        console.log(e);
      }

      setName("");
      setEmail(""); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter client name"
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
        placeholder="Enter client email"
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.addButton} onPress={AddClient}>
        <Text style={styles.buttonText}>Add Client</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddClientsScreen 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    padding: 5,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});