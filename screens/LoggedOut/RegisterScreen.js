import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { auth, setDoc, doc, db } from "../../firebase";
import { useNavigation } from "@react-navigation/core";
import DropDownPicker from "react-native-dropdown-picker";
import { updateProfile } from "firebase/auth";

const RegisterScreen = () => {
  // for dropdown
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Personal Trainer", value: "trainer" },
    { label: "General User", value: "client" },
  ]);

  // user info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");

  const navigation = useNavigation();

  //navigating to screens
  const LoginScreenPage = () => {
    navigation.navigate("Login");
  };

  //navigating through screens
  const ForgotPasswordScreen = () => {
    navigation.navigate("Forgot Password?");
  };

  //function for signing up
  const handleSignUp = async () => {
    auth
      //creates with email and password and uid
      .createUserWithEmailAndPassword(email, password)
      .then(async (UserCredentials) => {
        const user = UserCredentials.user;
        console.log("Registered with: ", user.email);
        //Adding extra user details to users and linking with uid
        try {
          const uidRef = doc(db, "users", user.uid);
          updateProfile(auth.currentUser, {
            displayName: firstName 
          }).then(() => {
            console.log("Display name updated");
          }).catch((error) => {
            console.log(error)
          });
          await setDoc(uidRef, {
            role: value,
            firstName: firstName,
            lastName: lastName,
            age: age,
            currentWeight: currentWeight,
            goalWeight: goalWeight,
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      })
      .catch((error) => alert(error.message));
  };

  return (
    //allows for dismissing keyboard
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled={true}>
          <Image
            source={require("../../assets/logo-no-bg.png")}
            style={styles.logo}
          />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              autoCapitalize='none'
              placeholderTextColor="black"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="black"
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              secureTextEntry
            />
            <DropDownPicker
              style={styles.dropdown}
              placeholder={"Select an Account Type"}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              required={true}
              listMode="SCROLLVIEW"
            />
            <TextInput
              placeholder="First Name"
              placeholderTextColor="black"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              style={styles.input}
              required={true}
            />
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="black"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              style={styles.input}
              required={true}
            />
            <TextInput
              placeholder="Age"
              placeholderTextColor="black"
              keyboardType="numeric"
              value={age}
              onChangeText={(text) => setAge(text)}
              style={styles.input}
              required={true}
            />
            <TextInput
              placeholder="Current Weight"
              placeholderTextColor="black"
              keyboardType="numeric"
              value={currentWeight}
              onChangeText={(text) => setCurrentWeight(text)}
              style={styles.input}
              required={true}
            />
            <TextInput
              placeholder="Goal Weight"
              placeholderTextColor="black"
              keyboardType="numeric"
              value={goalWeight}
              onChangeText={(text) => setGoalWeight(text)}
              style={styles.input}
              required={true}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSignUp} style={styles.button}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={LoginScreenPage}
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>Back To Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={ForgotPasswordScreen}
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>Forgot Password ?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },

  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  dropdown: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    borderColor: "white",
  },

  buttonContainer: {
    width: "60%",
    // justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  button: {
    backgroundColor: "#0792F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    // fontSize: 16,
  },

  buttonOutlineText: {
    color: "#0792F9",
    fontWeight: "bold",
    // fontSize: 16,
  },

  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0792F9",
    borderWidth: 2,
  },

  heading: {
    fontWeight: "500",
    fontStyle: "bold",
    fontSize: 23,
    textAlign: "center",
  },

  logo: {
    resizeMode: "contain",
    height: 160,
    marginTop: 60,
  },
});
