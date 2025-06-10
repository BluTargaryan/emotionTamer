import { router } from 'expo-router'
import React from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import CustomButton from '../components/CustomButton'

const FiveFourThreeTwoOneStartPage = () => {


  return (
    <SafeAreaView className='w-full h-full bg-background flex flex-col items-center justify-center gap-20'>
        <View className='flex flex-col gap-3 items-center w-1/2'>
            <Text className='text-2xl font-bold text-primary'>5-4-3-2-1 method</Text>
            <Text className='text-center text-primary'>
            Vorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum 
            </Text>
        </View>
        <CustomButton title='Start' onPress={() => {router.replace('FiveFourThreeTwoOneStageOne' as any)}} />    
    </SafeAreaView>
  )
}

export default FiveFourThreeTwoOneStartPage