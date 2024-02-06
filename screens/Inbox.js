// HelloWorld.js
import React, { useState , useContext, useLayoutEffect, useEffect, useRef } from 'react';
import { View, Text, StyleSheet,ScrollView,KeyboardAvoidingView, Alert,ImageBackgroundComponent, TextInput, Pressable, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EmojiSelector from 'react-native-emoji-selector';
import { UserType } from '../userContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import ip from '../ipconfig';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import urljoin from 'url-join';

const Inbox = () => {
  const navigation = useNavigation();
  const [showEmoji, setShowEmoji]= useState(false);
  const [selectedMessages , setSelectedMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [messages , setMessages] = useState([]);
  const [recepientData, setRecepientData] = useState('');
  const [selectedImage , setSelectedImage] = useState('');
  const {userId, setUserId} = useContext(UserType);
  const route = useRoute();
  const {recepientId} = route.params;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollToBottom()
  },[]);

  const scrollToBottom = () => {
      if(scrollViewRef.current){
          scrollViewRef.current.scrollToEnd({animated:false})
      }
  }

  const handleContentSizeChange = () => {
      scrollToBottom();
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://${ip}:8000/messages/${userId}/${recepientId}`
      );
      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messags", response.status.message);
      }
    } catch (error) {
      console.log("error fetching messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(()=>{
    const fetchData = async()=>{
      try{
        const response = await fetch(`http://${ip}:8000/userdata/${recepientId}`);
        const dataa = await response.json();
        setRecepientData(dataa);

      }catch(error){
        console.log('error retrieving data',error);
      }
    }
    fetchData();
  },[])

  const handleEmoji = ()=>{
      setShowEmoji(!showEmoji);
  };

  const deleteMessages = async(messageIds) =>{

    try{
      const response = await fetch(`http://${ip}:8000/deleteMessages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messageIds }),
      });

      if (response.ok) {
        setSelectedMessages((prevSelectedMessages) =>
        prevSelectedMessages.filter((id) => !messageIds.includes(id))
      );

        fetchMessages();
      } else {
        console.log("error deleting messages", response.status);
      }

    }catch(error){
      console.log('error deleting messages:' , error)
    }

  };

  const handleSend = async(messageType , imageUri) =>{

    try{
      const formData = new FormData();
      formData.append('senderId', userId);
      formData.append('recepientId', recepientId );


      if(messageType === 'image'){
        formData.append('messageType', 'image');
        formData.append('imageFile',{
          uri:imageUri,
          name:'image.jpg',
          type:'image/jpg'

        })
      }
      else{
        formData.append('messageType', 'text');
        formData.append('messageText' , message);
      }

      const response = await fetch(`http://${ip}:8000/messages`, {
        method:'POST',
        body:formData,
      });

      if(response.ok){
        setMessage('');
        setSelectedImage('');
        
        fetchMessages();
      }

    }catch(error){
      console.log('error message', error)
    }

  };

useLayoutEffect(() => {
  navigation.setOptions({
    headerTitle: '',
    headerLeft: () => (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <FontAwesomeIcon onPress={()=>navigation.goBack()} name="arrow-left" size={24} color="black" />
      
      {selectedMessages.length > 0 ? (
         <View>
          <Text style={{fontSize:16, fontWeight:'500'}}>{selectedMessages.length} </Text>
         </View>
       ):(
        <View style={{flexDirection:'row', alignItems:'center',}}>
        <Image
          style={{ width: 30, height: 30, borderRadius: 15, resizeMode: 'cover' }}
          source={{ uri: recepientData?.image }}
        />

        <Text style={{marginLeft:5, fontSize:15, fontWeight:'bold'}}>{recepientData?.name}</Text>
        </View>
       )
       }
        
      </View>
    ),

    headerRight:()=> selectedMessages.length > 0?(
      <View style={{flexDirection:'row', alignItems:'center' , gap:10}}>
         <Icon name="chevron-left" size={24} color="black" />
         <Icon name="chevron-right" size={24} color="black" />
         <Icon name="star" size={24} color="black" />
         <Icon onPress={()=>deleteMessages(selectedMessages)} name="trash" size={24} color="black" />
      </View>
    ):null
  });
}, [recepientData, selectedMessages]);


const formatTime = (time) => {
  const options = { hour: "numeric", minute: "numeric" };
  return new Date(time).toLocaleString("en-US", options);
};

const pickImage = async () => {
  try {
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });

    if (image.path) {
      console.log(image.path);
      handleSend('image', image.path);
    } else {
      console.log('User canceled image picker');
    }
  } catch (error) {
    if (error.message !== 'User cancelled image picker') {
      Alert.alert('Image Picker Error', error.message);
    }
  }
};

const hanldeSelectMessage = (message)=>{

    const isSelected = selectedMessages.includes(message._id);
    if (isSelected){
      setSelectedMessages((previousMessages) =>previousMessages.filter((id) => id !== message._id));

    }
    else{
      setSelectedMessages((previousMessages)=>[...previousMessages , message._id])
    }
}

console.log(selectedMessages);

  return (
   <KeyboardAvoidingView style={{flex:1, backgroundColor:'#F0F0F0'}}>
    <ScrollView  ref={scrollViewRef} contentContainerStyle={{flexGrow:1}} onContentSizeChange={handleContentSizeChange}>
    
    {messages.map((item, index) => {
          if (item.messageType === "text") {
             const isSelected = selectedMessages.includes(item._id);
            return (
              <Pressable 
              onLongPress={()=>{hanldeSelectMessage(item)}}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },

                 isSelected && {width:'100%', backgroundColor:'gray'}
                ]}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color:'black',
                    textAlign: isSelected ?"right":"left",
                  }}
                >
                  {item?.message}
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 10,
                    color: "gray",
                    marginTop: 5,
                  }}
                >
                  {formatTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }

          if (item.messageType === "image") {
            const isSelected = selectedMessages.includes(item._id);
            return (
              <Pressable
              onLongPress={()=>{hanldeSelectMessage(item)}}
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                      isSelected && {width:'100%', backgroundColor:'gray'}
                ]}
              >
                <View>
                  <Image
                    source={{uri: item.imageUrl}}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                  />
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      position: "absolute",
                      right: 10,
                      bottom: 7,
                      color: "white",
                      marginTop: 5,
                    }}
                  >
                    {formatTime(item?.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            );
          }
        })}
    </ScrollView>
    <View style={{flexDirection:'row', alignItems:'center',paddingHorizontal:10,paddingVertical:10,borderTopWidth:1,borderTopColor:'#dddddd',marginBottom:showEmoji ? 0 : 25}}>
    <Icon onPress={handleEmoji} style={{marginRight:5}} name="smile-o" size={30} color="#000" />

    <TextInput value={message} onChangeText={(text)=>setMessage(text)} style={{flex:1,height:40,borderWidth:1, borderColor:'black',borderRadius:20,paddingHorizontal:10,}} placeholder='Type your message...'/>
    <View style={{flexDirection:'row', alignItems:'center', gap:7, marginHorizontal:8}}>
    <Icon onPress={pickImage} name="camera" size={24} color="black" />
    <Icon name="microphone" size={24} color="#000" />
    </View>
    <Pressable onPress={() => handleSend('text')} style={{backgroundColor:'#007bff', paddingVertical:8, paddingHorizontal:12,borderRadius:20}}>
      <Text style={{color:'white',fontWeight:"bold"}}>Send</Text>
    </Pressable>
    </View>

    {showEmoji && (
      <EmojiSelector onEmojiSelected={(emoji) =>{setMessage((prevMessage)=> prevMessage + emoji)}} style={{height:350}}/>
    )}

   </KeyboardAvoidingView>
  );
};



export default Inbox;
