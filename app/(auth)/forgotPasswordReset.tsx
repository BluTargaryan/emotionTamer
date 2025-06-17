import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, SafeAreaView, ScrollView, Text, View } from 'react-native'
import CustomButton from '../components/CustomButton'
import CustomTextInput from '../components/CustomTextInput'
import MiniAuthRedirect from '../components/MiniAuthRedirect'
import TitleText from '../components/TitleText'
import { useApp } from '../context/AppContext'

const forgotPasswordReset = () => {
  const { resetPassword } = useApp()
  const { code } = useLocalSearchParams()
  // Form state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleResetPassword = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      const result = await resetPassword(code as string, newPassword, confirmPassword)
      
      if (result.success) {
        // Show success message and navigate to signin
        Alert.alert('Password Reset Successfully!', result.message, [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/signin')
          }
        ])
      } else {
        // Show error message
        Alert.alert('Password Reset Failed', result.message)
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
          <TitleText title="Reset password" />
          
          <Image 
          source={require("../../assets/images/forgotpassword.png")}
          className='w-auto h-96' 
          resizeMode='contain'
          />
          <View className='flex items-center justify-center gap-5'>
            <Text className='text-text w-56 text-center text-xl'>Set up your new password</Text>
            <CustomTextInput 
              placeholder='Enter your new password' 
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true}
            />
            <CustomTextInput 
              placeholder='Confirm your new password' 
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />

            <CustomButton 
              title={isSubmitting ? 'Resetting...' : 'Reset password'} 
              onPress={handleResetPassword} 
              bgColor="primary" 
            />

            <MiniAuthRedirect target="/(auth)/signin" text="Remember your password? Sign in" color="text"/>
          </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default forgotPasswordReset