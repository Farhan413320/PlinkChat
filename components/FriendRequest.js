// HelloWorld.js
import React ,{useContext} from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { UserType } from '../userContext';
import {useNavigation} from '@react-navigation/native';
import ip from '../ipconfig';

const FriendRequest = ({item, friendRequests, setfriendRequests}) => {
    const navigation = useNavigation();
     const {userId, setUserId} = useContext(UserType);

const acceptRequest = async(friendRequestId) =>{

   try{
     const response = await fetch(`http://${ip}:8000/friend-request/accept`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            senderId:friendRequestId,
            recepientId:userId
        })
     });

     if(response.ok){
        setfriendRequests(friendRequests.filter((request)=> request._id !== friendRequestId));
        navigation.navigate('Chats');
     }

   }catch(err){
    console.log('error message' ,err);
   }
}

  return (
    <Pressable style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginVertical:10}}>
    <Image style={{width:50 , height:50,borderRadius:25,resizeMode:'cover'}} source = {{uri:item.image}}/>
    
    <Text style={{fontSize:15,color:'black', fontWeight:'bold', marginLeft:10,flex:1}}>{item?.name} sent you a Friend Request!!</Text>

    <Pressable onPress={()=> acceptRequest(item._id)} style={{backgroundColor:'#0066b2' , padding:10,borderRadius:6}}>
        <Text style={{textAlign:'center',color:'white',fontSize:16}}>Accept</Text>
    </Pressable>
    
    </Pressable>
  );
};

export default FriendRequest;
