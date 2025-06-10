import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import ExerciseListItem from './ExerciseListItem'
const HomeExercises = () => {
  return (
    
        <View className='flex flex-col gap-4'>
            <Text className='text-primary text-2xl font-bold'>Exercises</Text>
            <ScrollView 
                horizontal 
                className='flex flex-row pb-4'
                contentContainerStyle={{ gap: 16 }}
            >
                <ExerciseListItem title='4-7-8 breathing' image={'4-7-8'} targetScreen='/(breathing)/breathingStartPage' category='Breathing Exercise' />
                <ExerciseListItem title='5-4-3-2-1 method' image={'5-4-3-2-1'} targetScreen='/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStartPage' category='Grounding Exercise' />
                
            </ScrollView>
                </View> 


  )
}

export default HomeExercises