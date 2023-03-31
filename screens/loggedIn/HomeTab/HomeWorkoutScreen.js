import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';

const HomeWorkoutScreen = () => {

    const route = useRoute();
    const navigation = useNavigation();

    return (
        <>
        <ScrollView style={styles.container} >
            <Image style={styles.headerImage} source={{ uri: route.params.image }} />
            <Ionicons style={styles.icon} name="fitness" size={32} color="white" />
            
            {route.params.excersises.map((item, index) => (
                <TouchableOpacity style={styles.gif} key={index} onPress={() => navigation.navigate(item.screen, {
                    image: item.image,
                    name: item.name,
                    sets: item.sets,
                    reps: item.reps,
                    screen: item.screen,
                    id: item.id,
                })}>
                    <Image style={styles.exeImage} source={{uri:item.image}} />
                    <View style={{marginLeft: 6}}>
                        <Text style={styles.title}>{item.name}</Text>
                        <Text style={styles.sets}>x{item.sets} Sets</Text>
                        <Text style={styles.sets}>x{item.reps} Reps</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate("ExerciseScreen", {
            excersises:route.params.excersises,
        })} style={styles.startBtn}>
            <Text style={styles.btnText}>START</Text>
        </TouchableOpacity>
        </>
    )
}

export default HomeWorkoutScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        // top: 45,

    },
    headerImage: {
        width: '100%',
        height: 170,
    },
    icon: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    exeImage: {
        height: 90,
        width: 90,
    },
    gif: {
        margin: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',

    },
    sets: {
        marginTop: 4,
        fontSize: 17,
        color:'gray'
    },
    startBtn: {
        backgroundColor: '#0792F9',
        padding: 10,
        marginLeft: 'auto',
        marginTop: 'auto',
        marginRight: 'auto',
        marginVertical: 20,
        borderRadius: 15,
        width: 120,
    },
    btnText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
})