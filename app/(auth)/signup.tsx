import React from 'react'
import { Image, SafeAreaView, ScrollView, View } from 'react-native'
import CustomButton from '../components/CustomButton'
import CustomTextInput from '../components/CustomTextInput'
import MiniAuthRedirect from '../components/MiniAuthRedirect'
import TitleText from '../components/TitleText'

const signup = () => {
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
         <CustomTextInput placeholder='Email' />
         <CustomTextInput placeholder='Password' />
         <CustomButton title='Register' onPress={()=>{}} bgColor="primary" />

          <MiniAuthRedirect target="/(auth)/signin" text="Already have an account? Sign in" />
         </View>
</ScrollView>
  </SafeAreaView>
  )
}

export default signup