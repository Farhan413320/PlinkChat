import React, { useEffect,useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ip from '../ipconfig';
import axios from 'axios';
import { UserType } from '../userContext';
import FriendRequest from '../components/FriendRequest';

const FriendsScreen = () => {
    const {userId, setUserId} = useContext(UserType);
    const [friendRequests , setfriendRequests] = useState([]);

   useEffect(()=>{
      fetchFriendRequests();
   },[]);

   const fetchFriendRequests = async()=>{
    try{
        const response = await axios.get(`http://${ip}:8000/friend-request/${userId}`);
        if(response.status === 200){
            const dataa = response.data.map((friendrequests) =>({
                _id:friendrequests._id,
                name:friendrequests.name,
                email:friendrequests.email,
                image:friendrequests.image
            }))

            setfriendRequests(dataa);
        }
    }catch(err){
        console.log('error message',err);
    }
    console.log(friendRequests);
   }



  return (
    <View style={{padding:10 , marginHorizontal:12}}>
      {friendRequests.length >0 && <Text style={{color:'black',fontSize:16, fontWeight:'bold'}}>Your Friend Requests</Text>}
      
      {friendRequests.map((item,index) =>(
          <FriendRequest key={index} item={item} friendRequests={friendRequests} setfriendRequests = {setfriendRequests}/>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default FriendsScreen;
