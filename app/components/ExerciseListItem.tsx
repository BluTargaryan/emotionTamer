import { router } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const ExerciseListItem = () => {
  return (
    <TouchableOpacity 
        className='w-36 h-56 bg-secondary rounded-lg flex flex-col'
        onPress={() => router.push('/breathingStartPage')}
    >
        <View className='flex-1'>
            <Image 
                source={require('../../assets/images/breathing.png')} 
                className='w-full h-full'
                resizeMode='contain'
            />
        </View>
        <View className='flex flex-col gap-[2px] flex-2 px-2 py-3 bg-primary rounded-b-lg'>
            <Text className='text-background  font-bold text-wrap'>4-7-8 Breathing</Text>
            <Text className='text-background text-sm text-wrap'>Breathing exercise</Text>
        </View>
    </TouchableOpacity>
  )
}

export default ExerciseListItem