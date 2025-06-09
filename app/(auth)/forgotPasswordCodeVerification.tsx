import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, SafeAreaView, ScrollView, Text, View } from 'react-native'
import CustomButton from '../components/CustomButton'
import CustomTextInput from '../components/CustomTextInput'
import MiniAuthRedirect from '../components/MiniAuthRedirect'
import TitleText from '../components/TitleText'
import { useApp } from '../context/AppContext'

const forgotPasswordCodeVerification = () => {
  const { verifyPasswordResetCode } = useApp()
  
  // Form state
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleVerifyCode = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      const result = await verifyPasswordResetCode(code)
      
      if (result.success) {
        // Show success message and navigate to password reset
        Alert.alert('Success', result.message, [
          {
            text: 'OK',
            onPress: () => router.push('/(auth)/forgotPasswordReset')
          }
        ])
      } else {
        // Show error message
        Alert.alert('Verification Failed', result.message)
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
          <TitleText title="Forgot password" />
          
          <Image 
          source={require("../../assets/images/forgotpassword.png")}
          className='w-auto h-96' 
          resizeMode='contain'
          />
          <View className='flex items-center justify-center gap-5'>
            <Text className='text-text w-56 text-center text-xl'>An e-mail containing the reset code has been sent to you.</Text>
            <CustomTextInput 
              placeholder='Enter the code sent to your email' 
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
            />

            <CustomButton 
              title={isSubmitting ? 'Verifying...' : 'Verify Code'} 
              onPress={handleVerifyCode} 
              bgColor="primary" 
            />

            <MiniAuthRedirect target="/(auth)/signin" text="Remember your password? Sign in" color="text"/>
          </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default forgotPasswordCodeVerification