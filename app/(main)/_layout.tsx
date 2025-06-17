import { Stack } from 'expo-router'
import React from 'react'

const MainLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="home"
        options={{
          title: 'Emotion Tamer',
          headerStyle: {
            backgroundColor: '#1E4335',
          },
          headerTintColor: '#EDE6DE',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24
          },
          headerLeft: () => null,
        }}/>
        {/* <Stack.Screen name="home" options={{headerShown:false}}/> */}
    </Stack>
  )
}

export default MainLayout