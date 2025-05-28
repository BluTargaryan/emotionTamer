import { router } from 'expo-router'
import React from 'react'
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native'
import CustomButton from '../components/CustomButton'
import CustomTextInput from '../components/CustomTextInput'
import MiniAuthRedirect from '../components/MiniAuthRedirect'
import TitleText from '../components/TitleText'

const signupCodeVerification = () => {
  return (
    <SafeAreaView className='w-full h-full'>
    <ScrollView 
    contentContainerStyle={{
      width:"100%",
      height:"100%",
      display:"flex",
      backgroundColor:"#EDE6DE",
      alignItems:"center",
      justifyContent:"center",
      gap:70,
      paddingTop:100,
      paddingBottom:100
    }}
    >
          <TitleText title="Sign up" />
          
          <Image 
          source={require("../../assets/images/Sign-up.png")}
          className='w-auto h-96' 
          resizeMode='contain'
          />
          <View className='flex items-center justify-center gap-5'>
            <Text className='text-text w-56 text-center text-xl'>Set up your password</Text>
         <CustomTextInput placeholder='Enter your password' />
         <CustomTextInput placeholder='Confirm your password' />

         <CustomButton title='Register' onPress={()=>{router.push("/")}} bgColor="primary" />

          <MiniAuthRedirect target="/(auth)/signin" text="Already have an account? Sign in" color="text"/>
         </View>
</ScrollView>
  </SafeAreaView>
  )
}

export default signupCodeVerification