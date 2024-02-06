import React ,{useState, useEffect} from 'react';
import {View, Text, StyleSheet, KeyboardAvoidingView, TextInput, Pressable,Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ip from '../ipconfig';
import axios from 'axios';

const LoginScreen = () => {

  const[email,setEmail] = useState('');
  const[password,setPassword] = useState('');
  const navigation = useNavigation();

  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("authToken");

  //       if (token) {
  //         navigation.replace("Home");
  //       } else {
        
  //       }
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   };

  //   checkLoginStatus();
  // }, []);

  const handleLogin = ()=>{
    const user = {
      email:email,
      password:password
    }
     
    axios.post(`http://${ip}:8000/login`,user).then((response) =>{
    // console.log(response.data);
     const token = response.data.token;
     AsyncStorage.setItem("authToken", token);

     navigation.replace('Home');
    }).catch((error)=>{
      Alert.alert(
        'Login Error',
        'Invalid Email or Password'
        );
        console.log('Login Error',error);
     });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <View style={{marginTop:100 , justifyContent:'center', alignItems:'center'}} >
          <Text style={{color:'#aA55A2', fontSize:17 , fontWeight:'600'}}>
            Sign In
          </Text>
          <Text style={{marginTop:15, fontSize:17 , fontWeight:'600'}}>
            Sign In to your Account
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
          <Text style={{fontSize:18 , fontWeight:'600' , color:'gray'}}>Password</Text>
          <TextInput
          value={password}
          onChangeText={(text)=>setPassword(text)}
          secureTextEntry={true}
          style={{fontSize:password?18:18,borderBottomColor:'gray' , borderBottomWidth:1 , marginVertical:10 , width:300}}
          placeholderTextColor={'black'}
          placeholder='Enter your Password'
          />
          </View>
          <Pressable onPress={handleLogin} style={{width:200 , backgroundColor:'#4A55A2',padding:15,marginTop:50, marginLeft:'auto',marginRight:'auto',borderRadius:6}}>
           <Text style={{color:'white', fontSize:16, fontWeight:'bold', textAlign:'center'}}>
            Login
           </Text>
          </Pressable>
          
          <Pressable onPress = {()=>navigation.navigate('Register')} style={{marginTop:15}}>
            <Text style={{textAlign:'center', color:'gray',fontSize:16}}> Don't have an Account? Sign Up</Text>
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
export default LoginScreen;
