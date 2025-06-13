import { Stack } from 'expo-router'
import React from 'react'

const ColorNoticingLayout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name="colorNoticingStartPage" 
        options={{
          headerShown: false,
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