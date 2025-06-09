import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, SafeAreaView, ScrollView, View } from 'react-native'
import CustomButton from '../components/CustomButton'
import CustomTextInput from '../components/CustomTextInput'
import MiniAuthRedirect from '../components/MiniAuthRedirect'
import TitleText from '../components/TitleText'
import { useApp } from '../context/AppContext'

const forgotPassword = () => {
  const { sendPasswordResetCode } = useApp()
  
  // Form state
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSendResetCode = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      const result = await sendPasswordResetCode(email)
      
      if (result.success) {
        // Show success message and navigate to verification
        Alert.alert('Success', result.message, [
          {
            text: 'OK',
            onPress: () => router.push('/(auth)/forgotPasswordCodeVerification')
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
        <TitleText title="Forgot password" />
        <Image 
        source={require("../../assets/images/forgotpassword.png")}
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
            title={isSubmitting ? 'Sending...' : 'Send reset code'} 
            onPress={handleSendResetCode} 
            bgColor="primary" 
          />
          <MiniAuthRedirect target="/(auth)/signin" text="Remember your password? Sign in" color="text"/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )     
}

export default forgotPassword