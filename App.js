import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, db, doc, getDoc } from './firebase';
import { getAuth } from 'firebase/auth';
import LoginScreen from './screens/LoggedOut/LoginScreen';
import HomeScreen from './screens/loggedIn/HomeTab/HomeScreen';
import AnalyticsScreen from './screens/loggedIn/AnalyticsTab/AnalyticsScreen';
import ProfileScreen from './screens/loggedIn/ProfileTab/ProfileScreen';
import WorkoutScreen from './screens/loggedIn/WorkoutTab/WorkoutScreen';
import ForgotPasswordScreen from './screens/LoggedOut/ForgotPasswordScreen';
import NutritionScreen from './screens/loggedIn/NutritionTab/NutritionScreen';
import RegisterScreen from './screens/LoggedOut/RegisterScreen';
import EditUserScreen from './screens/loggedIn/ProfileTab/EditUserScreen';
import HomeWorkoutScreen from './screens/loggedIn/HomeTab/HomeWorkoutScreen';
import HomeExerciseScreen from './screens/loggedIn/HomeTab/HomeExerciseScreen';
import HomeSingleExercise from './screens/loggedIn/HomeTab/HomeSingleExercise';
import AddWorkoutScreen from './screens/loggedIn/WorkoutTab/AddWorkoutScreen';
import AllWorkoutScreen from './screens/loggedIn/WorkoutTab/AllWorkoutScreen';
import CreatedWorkoutScreen from './screens/loggedIn/WorkoutTab/CreatedWorkoutScreen';
import CreatedExerciseScreen from './screens/loggedIn/WorkoutTab/CreatedExerciseScreen';
import ManageClientsScreen from './screens/loggedIn/ProfileTab/ManageClientsScreen';
import AddClientsScreen from './screens/loggedIn/ProfileTab/AddClientsScreen';
import SingleClientScreen from './screens/loggedIn/ProfileTab/SingleClientScreen';
import AssignedWorkoutScreen from './screens/loggedIn/WorkoutTab/AssignedWorkoutScreen';
import AddNutritionScreen from './screens/loggedIn/NutritionTab/AddNutritionScreen';
import CreatedNutritionScreen from './screens/loggedIn/NutritionTab/CreatedNutritionScreen';
import AllNutritionScreen from './screens/loggedIn/NutritionTab/AllNutritionScreen';


export default function App() {

  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState("");


  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        const uid = getAuth().currentUser.uid;
        setIsLoggedIn(true);

        // fetch user profile so we can check if trainer or client
        const fetchUserProfile = async () => {
          const userRef = doc(db, 'users',uid); 
          const userSnapshot = await getDoc(userRef);
          await setUserData(userSnapshot.data());
          console.log(userData);
      }
      fetchUserProfile();
      }
      else {
        setIsLoggedIn(false);
      }
    })
  }, [])

  function HomeTabs () {
    return (
    <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color }) => {
                let iconName;
    
                if (route.name === 'Home') {
                  iconName = focused? 'home' : 'home-outline';
                }
                else if (route.name === 'Nutrition') {
                  iconName = focused ? 'nutrition-sharp' : 'nutrition-outline';
                }  
                else if (route.name === 'Workouts') {
                  iconName = focused ? 'ios-list' : 'ios-list-outline';
                }
                else if (route.name === 'Analytics') {
                  iconName = focused ? 'analytics' : 'analytics-outline';
                }
                else if (route.name === 'Profile') {
                  iconName =focused ? 'ios-person' : 'ios-person-outline';
                }
                return <Ionicons name={iconName} size={30} color={color} />;
              },
              tabBarActiveTintColor: '#0792F9',
              tabBarInactiveTintColor: 'black',
            })}
          
          >
            {/* Home Screen */}
            <Tab.Screen name="Home"
             component={HomeScreen}
             options={{headerShown:false}}
             />
             {/* Nutrition Screen  */}
            <Tab.Screen name="Nutrition"
            component={NutritionScreen}
            options={{headerShown:false}}
            />
            {/* Workout Screen  */}
            <Tab.Screen name="Workouts"
            component={WorkoutScreen}
            options={{headerShown:false}} />
            {/* Analytics Screen  */}
            <Tab.Screen name="Analytics" 
            component={AnalyticsScreen}
            options={{headerShown:false}}
            />
            {/* Profile Screen  */}
            <Tab.Screen name="Profile" 
            component={ProfileScreen} 
            options={{headerShown:false}}
            />
          </Tab.Navigator>
  )}
  

    if(isLoggedIn==true) {
      if(userData.role == "trainer")
      {
        return (
          <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="HomeTabs"
              component={HomeTabs}
              options={{headerShown:false}}
            />
            <Stack.Screen name="AllNutrition"
              component={AllNutritionScreen}
              options={{headerShown:false}}
            />
            <Stack.Screen name="AddNutrition"
              component={AddNutritionScreen}
              options={{headerShown:false}}
            />
            <Stack.Screen name="CreatedNutrition"
              component={CreatedNutritionScreen}
              options={{headerShown:false}}
            />
            <Stack.Screen name="EditUser"
            component={EditUserScreen}
            options={{headerShown:false}}
            />
            <Stack.Screen name="SingleClient"
            component={SingleClientScreen}
            options={{headerShown:false}}
            />
            <Stack.Screen name="ManageClients"
            component={ManageClientsScreen}
            options={{headerShown:false}}
            />
            <Stack.Screen name="AddClients"
            component={AddClientsScreen}
            options={{headerShown:false}}
            />
            <Stack.Screen name="Recommended Workout"
            component={HomeWorkoutScreen}
            options={{headerShown:true}}
            />
            <Stack.Screen name="ExerciseScreen"
            component={HomeExerciseScreen}
            options={{headerShown:false}}
            />
            <Stack.Screen name="HomeExercise"
            component={HomeSingleExercise}
            options={{headerShown:false}}
            />
            <Stack.Screen name="AddWorkout"
            component={AddWorkoutScreen}
            options={{headerShown: false}}
            />
            <Stack.Screen name="AllWorkout"
            component={AllWorkoutScreen}
            options={{headerShown: false}}
            />
            <Stack.Screen name="CreatedWorkout"
            component={CreatedWorkoutScreen}
            options={{headerShown: false}}
            />
            <Stack.Screen name="CreatedExerciseScreen"
            component={CreatedExerciseScreen}
            options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )
      }
      else {
        return (
          <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="HomeTabs"
              component={HomeTabs}
              options={{headerShown:false}}
            />
            <Stack.Screen name="AllNutrition"
              component={AllNutritionScreen}
              options={{headerShown:false}}
            />
            <Stack.Screen name="AddNutrition"
              component={AddNutritionScreen}
              options={{headerShown:false}}
            />
            <Stack.Screen name="CreatedNutrition"
              component={CreatedNutritionScreen}
              options={{headerShown:false}}
            />
            <Stack.Screen name="AssignedWorkouts"
            component={AssignedWorkoutScreen}
            options={{headerShown:false}}
            />
            <Stack.Screen name="EditUser"
            component={EditUserScreen}
            options={{headerShown:false}}
            />
            <Stack.Screen name="Recommended Workout"
            component={HomeWorkoutScreen}
            options={{headerShown:true}}
            />
            <Stack.Screen name="ExerciseScreen"
            component={HomeExerciseScreen}
            options={{headerShown:false}}
            />
            <Stack.Screen name="HomeExercise"
            component={HomeSingleExercise}
            options={{headerShown:false}}
            />
            <Stack.Screen name="AddWorkout"
            component={AddWorkoutScreen}
            options={{headerShown: false}}
            />
            <Stack.Screen name="AllWorkout"
            component={AllWorkoutScreen}
            options={{headerShown: false}}
            />
            <Stack.Screen name="CreatedWorkout"
            component={CreatedWorkoutScreen}
            options={{headerShown: false}}
            />
            <Stack.Screen name="CreatedExerciseScreen"
            component={CreatedExerciseScreen}
            options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )

      }
      
    }
    
    else {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            {/* Login Screen  */}
            <Stack.Screen name="Login" 
            component={LoginScreen} 
            options={{headerShown: false}}
            />
            <Stack.Screen name="Forgot Password?"
            component={ForgotPasswordScreen}
            />
            <Stack.Screen name="Register"
            component={RegisterScreen}
            options={{headerShown: false}}
            />
        </Stack.Navigator>
      </NavigationContainer>
      )

    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


