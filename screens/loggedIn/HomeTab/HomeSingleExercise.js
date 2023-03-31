import { SafeAreaView, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'

const JumpingJacks = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const exercise = route.params
  console.log(exercise);

  return (
    <SafeAreaView>
      <Image source={{uri:exercise.image}} style={styles.image}/>
      <Text style={styles.title}>{exercise.name}</Text>
      <Text style={styles.sets}>x{exercise.sets} Sets</Text>
      <Text style={styles.sets}>x{exercise.reps} Reps</Text>
      <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.btnText}>BACK</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default JumpingJacks


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
      bottom: 58
  },
  btnText: {
      textAlign: 'center',
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  },
})