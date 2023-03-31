import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  Image,
} from "react-native";
import { doc, db, getDoc } from "../../../firebase";
import { deleteUser, getAuth } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../../firebase";
import { Entypo } from "@expo/vector-icons";

const ProfileScreen = () => {
  const auth = getAuth();
  const userCred = auth.currentUser;
  const [user, setUser] = useState({});
  const navigation = useNavigation();

  const ManageClientsScreen = () => {
    navigation.navigate("ManageClients");
  };

  const handleSignOut = async () => {
    auth.signOut().catch((error) => alert(error.message));
  };

  const DeleteUser = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this account? All of your data will be lost.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteUser(userCred)
              .then(() => {
                console.log('Deleted', userCred);
              })
              .catch((error) => {
                console.log('error:', error);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const fetchUserProfile = async () => {
    const userRef = doc(db, "users", userCred.uid);
    const userSnapshot = await getDoc(userRef);
    await setUser(userSnapshot.data());
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity style={styles.delete} onPress={DeleteUser}>
        <Text style={{ marginTop: 50, fontWeight: 'bold', }}>Delete Account</Text>
        <Entypo
          name="remove-user"
          size={40}
          style={{ color: 'darkred', marginTop: 20, position: "absolute", right: 10, top: 50 }}
        />
      </TouchableOpacity>
      <Text style={styles.userName}>Profile</Text>
      <Image
        style={styles.userImg}
        source={require("../../../assets/TAG.png")}
      />
      <Text style={styles.userName}>
        {user.firstName} {user.lastName}
      </Text>
      <Text style={styles.aboutUser}>Email : {userCred.email}</Text>
      <Text style={styles.aboutUser}>Age : {user.age}</Text>
      <Text style={styles.aboutUser}>
        Current Weight : {user.currentWeight}
      </Text>
      <Text style={styles.aboutUser}>Goal Weight : {user.goalWeight}</Text>
      <View style={styles.userBtnWrapper}>
        <TouchableOpacity style={styles.userBtn} onPress={() => {navigation.navigate("EditUser")}}>
          <Text style={styles.userBtnTxt}>Edit Profile</Text>
        </TouchableOpacity>
        {user.role === "trainer" && (
          <TouchableOpacity
            style={styles.userBtn}
            onPress={ManageClientsScreen}
          >
            <Text style={styles.userBtnTxt}>Manage Clients</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.userBtn} onPress={handleSignOut}>
          <Text style={styles.userBtnTxt}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.userInfoWrapper}>
        <View styles={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>18</Text>
          <Text style={styles.userInfoSubTitle}>Workouts</Text>
        </View>
        <View styles={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>18</Text>
          <Text style={styles.userInfoSubTitle}>Nutrition Plans</Text>
        </View>
        <View styles={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>25</Text>
          <Text style={styles.userInfoSubTitle}>Client's</Text>
        </View>
      </View>
      <View style={styles.clientContainer}>
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() =>
            navigation.navigate("TrainerScreen", {
              email: email,
            })
          }
        >
          <Text style={styles.clientName}>Trainer Name : </Text>
          <Text style={styles.clientEmail}>Trainer Email : </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  button: {
    backgroundColor: "#0792F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  delete: {
    position: "absolute",
    top: 0,
    right: 8,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  userBtn: {
    borderColor: "#0792F9",
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: "#0792F9",
  },
  userInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: "center",
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  clientContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 20,
    marginTop: 10,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  clientEmail: {
    fontSize: 16,
    color: "#666",
  },
});
