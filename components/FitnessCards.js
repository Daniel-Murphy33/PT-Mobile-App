import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Fitness from '../data/Fitness'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FitnessCards = () => {

    const FitnessData = Fitness;
    const navigation = useNavigation();

  return (
    <View>
        {FitnessData.map((item, key) => (
            <Pressable style={styles.card} key={(key)} onPress={() => navigation.navigate("Recommended Workout", {
                image: item.image,
                excersises: item.excersises,
                id: item.id,
            })}>
                <Image style={styles.image}source={{uri:item.image}}/>
                <Text style={styles.cardText}>{item.name}</Text>
                <MaterialCommunityIcons style ={styles.icon} name="lightning-bolt" size={24} color="black" />
            </Pressable>
        ))}
    </View>
  )
}

export default FitnessCards

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        // top: 40,
    },
    image: {
        width: 320, 
        height: 130,
        borderRadius: 15,
    },
    cardText: {
        position: 'absolute',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        left: 20,
        top: 20,
    },
    icon: {
        position: 'absolute',
        color: 'white',
        bottom: 15,
        left: 20,
    }
})