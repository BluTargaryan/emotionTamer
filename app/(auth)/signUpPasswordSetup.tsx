import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, SafeAreaView, ScrollView, Text, View } from 'react-native'
import CustomButton from '../components/CustomButton'
import CustomTextInput from '../components/CustomTextInput'
import MiniAuthRedirect from '../components/MiniAuthRedirect'
import TitleText from '../components/TitleText'
import { useApp } from '../context/AppContext'

const signUpPasswordSetup = () => {
  const { completeSignup } = useApp()
  const { code } = useLocalSearchParams<{ code: string }>()
  
  // Form state
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCompleteSignup = async () => {
    if (isSubmitting) return
    if (!code) {
      Alert.alert('Error', 'No verification code found. Please start the signup process again.')
      return
    }
    setIsSubmitting(true)
    
    try {
      const result = await completeSignup(code, password, confirmPassword)
      
      if (result.success) {
        // Show success message and navigate to main app (user is automatically signed in)
        Alert.alert('Account Created!', result.message, [
          {
            text: 'OK',
            onPress: () => router.replace('/(main)/home')
          }
        ])
      } else {
        // Show error message
        Alert.alert('Signup Failed', result.message)
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
            <Text className='text-text w-56 text-center text-xl'>Set up your password</Text>
         <CustomTextInput 
           placeholder='Enter your password' 
           value={password}
           onChangeText={setPassword}
           secureTextEntry={true}
         />
         <CustomTextInput 
           placeholder='Confirm your password' 
           value={confirmPassword}
           onChangeText={setConfirmPassword}
           secureTextEntry={true}
         />

         <CustomButton 
           title={isSubmitting ? 'Creating Account...' : 'Complete Registration'} 
           onPress={handleCompleteSignup} 
           bgColor="primary" 
         />

          <MiniAuthRedirect target="/(auth)/signin" text="Already have an account? Sign in" color="text"/>
         </View>
</ScrollView>
  </SafeAreaView>
  )
}

export default signUpPasswordSetup