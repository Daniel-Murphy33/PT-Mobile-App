/**
 * LoginScreen.js
 * @author Daniel Murphy
 * @studentnumber C00247818
 * @license GNU Affero General Public License v3.0
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

/**
 * Weight History screen 
 * @returns {React.Component}
 */ 

const WeightHistoryScreen = () => {
  const userCred = getAuth().currentUser;
  const [weightsData, setWeightsData] = useState([]);
  const navigation = useNavigation();

  const fetchUserWeights = () => {
    const weightsRef = collection(db, 'users', userCred.uid, 'weights');
    const q = query(weightsRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const weights = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWeightsData(weights);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchUserWeights();
    return () => {
      unsubscribe();
    };
  }, []);

  const renderItem = ({ item }) => {
    const date = item.date.toDate().toLocaleDateString();
    return (
      <View style={styles.card}>
        <Text style={styles.cardDate}>{date}</Text>
        <Text style={styles.cardText}>
          You weighed {item.weight} kg on {date}.
        </Text>
      </View>
    );
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Ionicons
        name="arrow-back"
        size={24}
        color="black"
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.title}>Weight History</Text>
      <FlatList
        data={weightsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default WeightHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    color:'#0792F9',
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  cardDate: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 16,
    marginTop: 5,
  },
});
