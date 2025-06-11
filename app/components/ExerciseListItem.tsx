import { router } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const ExerciseListItem = ({title, image,targetScreen, category}: {title: string, image: string, targetScreen: string, category: string}) => {
    const images = {
        '4-7-8': require('../../assets/images/breathing.png'),
        '5-4-3-2-1': require('../../assets/images/5-4-3-2-1.png'),
        // add more as needed
      };
  
    return (
    <TouchableOpacity 
        className='w-auto h-56 bg-secondary rounded-lg flex flex-col'
        onPress={() => router.push(targetScreen as any)}
    >
        <View className='flex items-center justify-center flex-1'>
            <Image 
                source={images[image as keyof typeof images]} 
                className='w-full h-3/4'
                resizeMode='contain'
            />
        </View>
        <View className='flex flex-col gap-[2px] flex-2 px-2 py-3 bg-primary rounded-b-lg'>
            <Text className='text-background  font-bold text-wrap'>{title}</Text>
            <Text className='text-background text-sm text-wrap'>{category} exercise</Text>
        </View>
    </TouchableOpacity>
  )
}

export default ExerciseListItem