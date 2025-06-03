import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Image, SafeAreaView, Text, View } from 'react-native'
import CustomButton from '../components/CustomButton'

const breathingStageFinal = () => {
    const { totalCycles } = useLocalSearchParams();
    const totalCyclesNum = parseInt(totalCycles as string) || 0;

  return (
    <SafeAreaView className='w-full h-full bg-background flex flex-col items-center justify-center gap-20'>
        <Text className='text-2xl text-center text-primary'>
        Congratulations!
        </Text>
        
        <View className='flex flex-col gap-9 items-center w-1/2'>
        <Image source={require('../../assets/images/happywoman.png')} 
        className='w-auto h-56' 
        resizeMode='contain'
        />
           <View className='flex flex-col gap-2 items-center'>
           <Text className='text-primary w-56 text-center'>You successfully completed</Text>
            <Text className='text-4xl text-bold text-secondary w-56 text-center'>{totalCyclesNum} cycles</Text>
            <Text className='text-primary w-56 text-center'>of 4-7-8 breathing</Text>
           </View>
        </View>
        
        <CustomButton title='To Home' onPress={() => {router.replace('/(breathing)/breathingStartPage')}}/>
    </SafeAreaView>
  )
}

export default breathingStageFinal        