import { Stack } from 'expo-router'
import React from 'react'

const SoothingSoundsLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="soothingSoundsStartPage"
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
        <Stack.Screen name="soothingSoundsPlay"
        options={{
          headerShown: false
        }}/>
        <Stack.Screen name="soothingSoundsFinal"
        options={{
          headerShown: false
        }}/>
    </Stack>
  )
}

export default SoothingSoundsLayout 