import { Stack } from 'expo-router'
import React from 'react'

const AlternateNostrilsLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="alternateNostrilsStartPage"
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
        <Stack.Screen name="alternateNostrilsStageInhaleLeft"
        options={{
          headerShown: false
        }}/>
        <Stack.Screen name="alternateNostrilsStageHoldLeft"
        options={{
          headerShown: false
        }}/>
        <Stack.Screen name="alternateNostrilsStageExhaleRight"
        options={{
          headerShown: false
        }}/>
        <Stack.Screen name="alternateNostrilsStageInhaleRight"
        options={{
          headerShown: false
        }}/>
        <Stack.Screen name="alternateNostrilsStageHoldRight"
        options={{
          headerShown: false
        }}/>
        <Stack.Screen name="alternateNostrilsStageExhaleLeft"
        options={{
          headerShown: false
        }}/>
        <Stack.Screen name="alternateNostrilsStageFinal"
        options={{
          headerShown: false
        }}/>
    </Stack>
  )
}

export default AlternateNostrilsLayout 