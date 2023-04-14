import { getAuth } from 'firebase/auth';
import { doc, getDoc, } from 'firebase/firestore';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { db } from '../../../firebase';
import { SafeAreaView } from 'react-native';

const EditUserScreen = () => {
  const userCred = getAuth().currentUser;
  const [user, setUser] = useState({});

  const fetchUserProfile = async () => {
    const userRef = doc(db, "users", userCred.uid);
    const userSnapshot = await getDoc(userRef);
    await setUser(userSnapshot.data());
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit User Info</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          value={user.firstName}
        />
        <TextInput
          style={styles.input}
          value={user.lastName}
        />
        <TextInput
          style={styles.input}
          value={user.age}
        />
        <TextInput
          style={styles.input}
          value={user.currentWeight}
          keyboardType="number-pad"
        />
        <TextInput
          style={styles.input}
          value={user.goalWeight}
          keyboardType="number-pad"
        />
      </View>
    </SafeAreaView>
  );
};

export default EditUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
