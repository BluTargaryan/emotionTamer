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
                <ExerciseListItem />
                <ExerciseListItem />
                <ExerciseListItem />
                <ExerciseListItem />
                <ExerciseListItem />
            </ScrollView>
                </View>


  )
}

export default HomeExercises