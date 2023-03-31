import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'

export class WorkoutTemplate extends Component {
  render() {
    return (
      <View>
        <TouchableOpacity style={[styles.button, styles.buttonOutline]} >
            <Text style={styles.buttonOutlineText}>Create a Workout</Text>
          </TouchableOpacity>
      </View>
    )
  }
}

export default WorkoutTemplate

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    },

    inputContainer: {
      width:'80%'
      },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,

    },

    buttonContainer: {
      width: '60%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },

    button: {
      backgroundColor: '#0792F9',
      width: '50%',
      padding: 15,
      borderRadius: 10, 
      alignItems: 'center',
    },

    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      // fontSize: 16,
    },

    buttonOutlineText: {
      color: '#0792F9',
      fontWeight: 'bold',
      // fontSize: 16,
    },

    buttonOutline: {
      backgroundColor: 'white',
      marginTop: 5,
      borderColor: '#0792F9',
      borderWidth: 2,
    },

    heading: {
      fontWeight: '500',
      fontStyle: 'bold',
      fontSize: 23  ,
      textAlign: 'center',
    },

    logo: {
      resizeMode: "contain",
      height: 160,
      marginBottom: 60
    },

})
