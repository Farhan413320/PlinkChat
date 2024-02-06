import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import FriendsScreen from './screens/friendsScreen';
import ChatsScreen from './screens/ChatsScreen';
import Inbox from './screens/Inbox';

function StackNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen}  />
        <Stack.Screen name="Friends" component={FriendsScreen}  />
        <Stack.Screen name="Chats" component={ChatsScreen}  />
        <Stack.Screen name="ChatInbox" component={Inbox}  />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator;