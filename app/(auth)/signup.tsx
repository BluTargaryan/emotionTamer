import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, SafeAreaView, ScrollView, View } from 'react-native'
import CustomButton from '../components/CustomButton'
import CustomTextInput from '../components/CustomTextInput'
import MiniAuthRedirect from '../components/MiniAuthRedirect'
import TitleText from '../components/TitleText'
import { useApp } from '../context/AppContext'

const signup = () => {
  const { sendVerificationCode } = useApp()
  
  // Form state
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSendCode = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      const result = await sendVerificationCode(email)
      
      if (result.success) {
        // Show success message and navigate to verification
        Alert.alert('Success', result.message, [
          {
            text: 'OK',
            onPress: () => router.push('/signupCodeVerification')
          }
        ])
      } else {
        // Show error message
        Alert.alert('Error', result.message)
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

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
         <CustomTextInput 
           placeholder='Email' 
           value={email}
           onChangeText={setEmail}
         />

         <CustomButton 
           title={isSubmitting ? 'Sending...' : 'Send Verification Code'} 
           onPress={handleSendCode} 
           bgColor="primary" 
         />

          <MiniAuthRedirect target="/(auth)/signin" text="Already have an account? Sign in" color="text"/>
         </View>
</ScrollView>
  </SafeAreaView>
  )
}

export default signup