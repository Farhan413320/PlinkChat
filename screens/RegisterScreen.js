import React ,{useState} from 'react';
import {View, Text, StyleSheet,TextInput,Pressable,KeyboardAvoidingView,Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ip from '../ipconfig';
import axios from 'axios';


const RegisterScreen = () => {
    const[email,setEmail] = useState('');
    const[name , setName] = useState('');
    const[password,setPassword] = useState('');
    const[image,setImage] = useState('');
    const navigation = useNavigation();

    const handleRegister = () =>{
      const user ={
        name:name,
        email:email,
        password:password,
        image:image
      }
console.log(ip);
     axios.post(`http://${ip}:8000/register`,user).then((response)=>{
      console.log(response);
      Alert.alert(
      'Registration successfull',
      'you have successfully registered.'
      );

      setName('');
      setEmail('');
      setPassword('');
      setImage('');
     }).catch((error)=>{
      Alert.alert(
        'Registration failed',
        'an error occurred while registering'
        );
        console.log('registration failed',error);
     });
    };


  return (
    <View style={styles.container}>
     <KeyboardAvoidingView>
        <View style={{marginTop:100 , justifyContent:'center', alignItems:'center'}} >
          <Text style={{color:'#aA55A2', fontSize:17 , fontWeight:'600'}}>
            Register
          </Text>
          <Text style={{marginTop:15, fontSize:17 , fontWeight:'600'}}>
            Register to your Account
          </Text>
          </View>
          <View style ={{marginTop:50}}>
          <View>
          <Text style={{fontSize:18 , fontWeight:'600' , color:'gray'}}>Email</Text>
          <TextInput
          value={email}
          onChangeText={(text)=>setEmail(text)}
          style={{fontSize:email?18:18,borderBottomColor:'gray' , borderBottomWidth:1 , marginVertical:10 , width:300}}
          placeholderTextColor={'black'}
          placeholder='Enter your Email'
          />
          </View>
          <View style={{marginTop:10}}>
          <Text style={{fontSize:18 , fontWeight:'600' , color:'gray'}}>Name</Text>
          <TextInput
          value={name}
          onChangeText={(text)=>setName(text)}
          style={{fontSize:name?18:18,borderBottomColor:'gray' , borderBottomWidth:1 , marginVertical:10 , width:300}}
          placeholderTextColor={'black'}
          placeholder='Enter your Name'
          />
          </View>

          <View style={{marginTop:10}}>
          <Text style={{fontSize:18 , fontWeight:'600' , color:'gray'}}>Password</Text>
          <TextInput
          value={password}
          onChangeText={(text)=>setPassword(text)}
          secureTextEntry={true}
          style={{fontSize:password?18:18,borderBottomColor:'gray' , borderBottomWidth:1 , marginVertical:10 , width:300}}
          placeholderTextColor={'black'}
          placeholder='Enter your Password'
          />

         <View style={{marginTop:10}}>
          <Text style={{fontSize:18 , fontWeight:'600' , color:'gray'}}>Image</Text>
          <TextInput
          value={image}
          onChangeText={(text)=>setImage(text)}
          style={{fontSize:image?18:18,borderBottomColor:'gray' , borderBottomWidth:1 , marginVertical:10 , width:300}}
          placeholderTextColor={'black'}
          placeholder='Choose you Profile Image'
          />
          </View>
          </View>
          <Pressable onPress={handleRegister} style={{width:200 , backgroundColor:'#4A55A2',padding:15,marginTop:50, marginLeft:'auto',marginRight:'auto',borderRadius:6}}>
           <Text style={{color:'white', fontSize:16, fontWeight:'bold', textAlign:'center'}}>
            Register
           </Text>
          </Pressable>
          
          <Pressable onPress = {()=>navigation.goBack()} style={{marginTop:15}}>
            <Text style={{textAlign:'center', color:'gray',fontSize:16}}> Already have an Account? Sign In</Text>
          </Pressable>
          </View>
        </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor:'white',
      padding:10,
    },
  });
export default RegisterScreen;