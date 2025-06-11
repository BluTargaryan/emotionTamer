import { Stack } from 'expo-router'
import React from 'react'

const FiveFourThreeTwoOneLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='FiveFourThreeTwoOneStartPage'
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
      <Stack.Screen name='FiveFourThreeTwoOneStageOne' options={{headerShown:false}}/>
      <Stack.Screen name='FiveFourThreeTwoOneStageTwo' options={{headerShown:false}}/>
      <Stack.Screen name='FiveFourThreeTwoOneStageThree' options={{headerShown:false}}/>
      <Stack.Screen name='FiveFourThreeTwoOneStageFour' options={{headerShown:false}}/>
      <Stack.Screen name='FiveFourThreeTwoOneStageFive' options={{headerShown:false}}/>z
      <Stack.Screen name='FiveFourThreeTwoOneFinal' options={{headerShown:false}}/>z

    </Stack>
  )
}

export default FiveFourThreeTwoOneLayout