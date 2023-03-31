import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeExerciseScreen = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [index, setIndex] = useState(0);
  const exercise = route.params.excersises;
  const current = exercise[index];
  const isFirst = index === 0;
  const isLast = index === exercise.length - 1;

  const handleNext = () => {
      if (!isLast) {
          setIndex(index + 1);
      }
  };

  const handlePrev = () => {
      if (!isFirst) {
          setIndex(index - 1);
      }
  };

  return (
      <SafeAreaView>
          <Image source={{uri:current.image}} style={styles.image}/>
          <Text style={styles.title}>{current.name}</Text>
          <Text style={styles.sets}>x{current.sets} Sets</Text>
          <Text style={styles.sets}>x{current.reps} Reps</Text>
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.navigate("HomeTabs")}>
              <Text style={styles.btnText}>FINISH WORKOUT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.prevBtn, isFirst && styles.disabledBtn]} disabled={isFirst} onPress={handlePrev}>
              <Text style={styles.btnText}>PREVIOUS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.nextBtn, isLast && styles.disabledBtn]} disabled={isLast} onPress={handleNext}>
              <Text style={styles.btnText}>NEXT</Text>
          </TouchableOpacity>
      </SafeAreaView>
  );
};

export default HomeExerciseScreen

const styles = StyleSheet.create({
  image: {
      width: '100%',
      height: 370,
  },
  title: {
      marginLeft: 'auto',
      marginRight: 'auto', 
      fontSize: 30,
      fontWeight: 'bold',
  },
  sets: {
      marginLeft: 'auto',
      marginRight: 'auto', 
      fontSize: 36,
      top: 25,
  },
  doneBtn: {
      backgroundColor: '#0792F9',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 20,
      borderRadius: 18,
      padding: 10,
      top: 155,
      width: 140,
  },
  prevBtn: {
      backgroundColor: '#4682B4',
      marginLeft: 'auto',
      marginRight: 'auto',
      borderRadius: 18,
      padding: 10,
      width: 140,
      right: 90,
  },
  nextBtn: {
      backgroundColor: '#4682B4',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 20,
      borderRadius: 18,
      padding: 10,
      width: 140,
      left: 90,
      bottom: 58,
  },
  btnText: {
      textAlign: 'center',
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  },
  disabledBtn: {
      backgroundColor: '#ccc',
  },
});