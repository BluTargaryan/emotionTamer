import { Stack } from 'expo-router'
import React from 'react'

const BreathingLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="breathingStartPage"
        options={{
          title: 'Go back to home',
          headerStyle: {
            backgroundColor: '#EDE6DE',
          },
          headerTintColor: '#1E4335',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24
          },
        }}/>
        {/* <Stack.Screen 
            name="breathingStartPage" 
            options={{
                headerShown: false
            }}
        /> */}
    </Stack>
  )
}

export default BreathingLayout