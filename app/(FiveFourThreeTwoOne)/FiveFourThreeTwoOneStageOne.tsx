import { router } from 'expo-router'
import React, { useState } from 'react'
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import CircleView from '../components/CircleView'
import CustomButton from '../components/CustomButton'

const FiveFourThreeTwoOneStageOne = () => {
   const [count, setCount] = useState(5)
   
  return (
    <SafeAreaView className='w-full h-full bg-background flex flex-col items-center justify-center gap-20'>
        <View className='flex flex-col gap-9 items-center w-3/4'>
        <Text className='text-2xl text-center text-primary'>
        Tap the eye below for each thing you SEE
        </Text>
        
        <TouchableOpacity onPress={() => {
            if (count > 1) {
                setCount(count - 1)
            } else {
                router.replace("FiveFourThreeTwoOneStageTwo" as any)
            }
        }}>
        <CircleView component={<Image source={require('../../assets/images/eye.png')} 
        className='w-auto h-28 z-10' 
        resizeMode='contain'
        />} />
        </TouchableOpacity>
        <Text className='text-xl text-primary'>{count} things left</Text>
        </View>
        
        <CustomButton title='Quit' onPress={() => {router.replace("FiveFourThreeTwoOneStartPage" as any)}} bgColor='secondary' />
    </SafeAreaView>
  )
}

export default FiveFourThreeTwoOneStageOne        