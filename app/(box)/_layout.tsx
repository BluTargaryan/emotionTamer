import { Stack } from 'expo-router'
import React from 'react'

const BoxLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="boxStartPage"
        options={{
          title: 'Box Breathing',
          headerStyle: {
            backgroundColor: '#EDE6DE',
          },
          headerTintColor: '#1E4335',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24
          },
        }}/>
        <Stack.Screen name="boxStageOne"
        options={{
          headerShown: false
        }}/>
        <Stack.Screen name="boxStageHold"
        options={{
          headerShown: false
        }}/>
        <Stack.Screen name="boxStageExhale"
        options={{
          headerShown: false
        }}/>
        <Stack.Screen name="boxStageHoldFinal"
        options={{
          headerShown: false
        }}/>
        <Stack.Screen name="boxStageFinal"
        options={{
          headerShown: false
        }}/>
    </Stack>
  )
}

export default BoxLayout 