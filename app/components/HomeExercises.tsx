import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { exercises } from '../utils/ExerciseListValues'
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
                {exercises.map((exercise) => (
                    <ExerciseListItem key={exercise.title} title={exercise.title} image={exercise.image} targetScreen={exercise.targetScreen} category={exercise.category} />
                ))}
                
            </ScrollView>
                </View> 


  )
}

export default HomeExercises