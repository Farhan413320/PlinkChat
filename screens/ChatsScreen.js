// HelloWorld.js
import React, { useState,useContext ,useEffect} from 'react';
import { View, ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import { UserType } from '../userContext';
import {useNavigation} from '@react-navigation/native';
import ip from '../ipconfig';
import UserChat from '../components/UserChat';

const ChatsScreen = () => {

    const[acceptedFriends , setAcceptedFriends] = useState([]);
    const navigation = useNavigation();
    const {userId, setUserId} = useContext(UserType);

    useEffect(() => {
        const acceptedFriendsList = async () => {
          try {
            const response = await fetch(
              `http://${ip}:8000/accepted-friends/${userId}`
            );
            const data = await response.json();
    
            if (response.ok) {
              setAcceptedFriends(data);
            }
          } catch (error) {
            console.log("error showing the accepted friends", error);
          }
        };
    
        acceptedFriendsList();
      }, []);


  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable>
        {acceptedFriends.map((item,index) =>(
            <UserChat key={index} item={item}/>
        ))}
      </Pressable>
    </ScrollView>
  );
};



export default ChatsScreen;
