import { useNavigation } from '@react-navigation/native';
import React, { useState,useContext, useLayoutEffect,useEffect } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { UserType } from '../userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import ip from '../ipconfig';
import axios from 'axios';
import User from '../components/User';

const HomeScreen = () => {

  const navigation = useNavigation();
  const {userId, setUserId} = useContext(UserType);
  const[users,setUsers] = useState([]);

  useLayoutEffect(() =>{
    navigation.setOptions({
      headerTitle:'',
      headerLeft:() =>(
        <Text style = {{color:'#aA55A2',fontWeight:'bold', fontSize:16}}>PLink Chat</Text>
      ),
      headerRight:() =>(
       <View style={{flexDirection:'row', alignItems:'center',gap:10 }}>
        <Icon onPress={()=> navigation.navigate('Chats')} name="envelope" size={20} color="black" />
        <MaterialIcons onPress={()=>{navigation.navigate('Friends')}} name="person-outline" size={20} color="black" />
       </View>
      ),
    });
  },[]);

  useEffect(() => {
   const fetchUsers = async() =>{
    const token = await AsyncStorage.getItem('authToken');
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    setUserId(userId);

    axios.get(`http://${ip}:8000/users/${userId}`).then((response)=>{
      setUsers(response.data);
     
    }).catch((error) =>{
      console.log('error retrieving users',error);
    })
   };

   fetchUsers();
  }, []);

  console.log(users);

  return (
    <View>
      <View style={{padding:10}}>
       {users.map((item,index)=>(
       <User key={index} item={item}/>
       ))} 
      </View>
     
    </View>
  );
};

export default HomeScreen;
