import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import {
  View, TextInput, StyleSheet, Text, TouchableWithoutFeedback,
  Keyboard, TouchableOpacity, Image
} from 'react-native'
import { auth } from '../../firebase';

const ForgotPasswordScreen = () => {

  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  // for resetting password when user forgets
  const ForgotPassword = () => {

    console.log("reset email sent to " + email);
    auth.sendPasswordResetEmail(email)
      .then(() => {
        alert("Reset password sent to : " + email);
      })
      .catch(function (error) {
        alert(error);
      });
  };

  //navigates user to login page
  const LoginScreenPage = () => {
    navigation.navigate('Login')
  }

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
    }}>
      <View style={styles.container}>
        <Image source={require('../../assets/logo-no-bg.png')} style={styles.logo} />
        <Text style={styles.heading}>Forgot your password?</Text>
        <Text style={styles.heading}>Enter your email address and we will send you a link to reset your password!</Text>
        <View style={styles.inputContainer}>
          <TextInput placeholder='Email'
            placeholderTextColor="black"
            required={true}
            autoCapitalize='none'
            keyboardType='email-address'
            value={email}
            onChangeText={text => setEmail(text)} style={styles.input} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={ForgotPassword} style={styles.button} >
            <Text style={styles.buttonText}>Send Reset Link To Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  inputContainer: {
    width: '80%',
    paddding: 10,
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
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  buttonOutlineText: {
    color: '#0792F9',
    fontWeight: 'bold',
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
    fontSize: 23,
    textAlign: 'center',
    marginTop: 10
  },

  logo: {
    resizeMode: "contain",
    height: 160,
    marginBottom: 50
  },

})

