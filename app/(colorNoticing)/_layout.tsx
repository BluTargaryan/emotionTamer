import { Stack } from 'expo-router'
import React from 'react'

const ColorNoticingLayout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name="colorNoticingStartPage" 
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
        }}
      />
      <Stack.Screen 
        name="colorNoticingExercise" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="colorNoticingFinal" 
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  )
}

export default ColorNoticingLayout 