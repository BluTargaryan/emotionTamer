import { router } from 'expo-router'
import React from 'react'
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import CircleView from '../components/CircleView'
import CustomButton from '../components/CustomButton'

const FiveFourThreeTwoOneStageTwo = () => {
   
  return (
    <SafeAreaView className='w-full h-full bg-background flex flex-col items-center justify-center gap-20'>
        <View className='flex flex-col gap-9 items-center w-3/4'>
        <Text className='text-2xl text-center text-primary'>
        Tap the hand below for each thing you TOUCH
        </Text>
        <TouchableOpacity onPress={() => {}}>
        <CircleView component={<Image source={require('../../assets/images/hand.png')} 
        className='w-auto h-28 z-10' 
        resizeMode='contain'
        />} />
        </TouchableOpacity>
        </View>
        
        <CustomButton title='Quit' onPress={() => {router.replace("FiveFourThreeTwoOneStartPage" as any)}} bgColor='secondary' />
    </SafeAreaView>
  )
}

export default FiveFourThreeTwoOneStageTwo        