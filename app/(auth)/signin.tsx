import React from 'react'
import { Image, SafeAreaView, ScrollView, View } from 'react-native'
import CustomButton from '../components/CustomButton'
import CustomTextInput from '../components/CustomTextInput'
import MiniAuthRedirect from '../components/MiniAuthRedirect'
import TitleText from '../components/TitleText'
const signin = () => {
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
            <TitleText title="Login" />
            {/* <Image 
            source={{ uri: "https://images.unsplash.com/photo-1747747004644-4ab29224deee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
            className='w-72 h-96' /> */}
            <Image 
            source={require("../../assets/images/door.png")}
            className='w-auto h-96' 
            resizeMode='contain'
            />
            <View className='flex items-center justify-center gap-5'>
           <CustomTextInput placeholder='Email' />
           <CustomTextInput placeholder='Password' />
           <CustomButton title='Login' onPress={()=>{}} bgColor="primary" />
           <MiniAuthRedirect target="/(auth)/signup" text="Don't have an account? Sign up" />
           </View>
</ScrollView>
    </SafeAreaView>
  )
}

export default signin