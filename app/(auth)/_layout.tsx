import { Stack } from 'expo-router'
import React from 'react'

const Authlayout = () => {
  return (
    <Stack>
        <Stack.Screen name="signin" options={{headerShown:false}}/>
        <Stack.Screen name="signup" options={{headerShown:false}}/>
        <Stack.Screen name="signupCodeVerification" options={{headerShown:false}}/>
        <Stack.Screen name="signUpPasswordSetup" options={{headerShown:false}}/>
        <Stack.Screen name="forgotPassword" options={{headerShown:false}}/>
        <Stack.Screen name="forgotPasswordCodeVerification" options={{headerShown:false}}/>
        <Stack.Screen name="forgotPasswordReset" options={{headerShown:false}}/>
    </Stack>
  )
}

export default Authlayout