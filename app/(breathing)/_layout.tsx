import { Stack } from 'expo-router'
import React from 'react'

const BreathingLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="breathingStartPage"
        options={{
          title: 'Exercise start',
          headerStyle: {
            backgroundColor: '#EDE6DE',
          },
          headerTintColor: '#1E4335',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24
          },
        }}/>
        <Stack.Screen name="breathingStageOne"
        options={{
          headerShown: false
        }}/>
        <Stack.Screen name="breathingStageHold"
        options={{
          headerShown: false
        }}/>
        <Stack.Screen name="breathingStageTwo"
        options={{
          headerShown: false
        }}/>
        <Stack.Screen name="breathingStageFinal"
        options={{
          headerShown: false
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