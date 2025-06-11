import { router } from 'expo-router'
import React, { useEffect } from 'react'
import { Image, SafeAreaView, Text, View } from 'react-native'
import CustomButton from '../components/CustomButton'
import { useApp } from '../context/AppContext'

const FiveFourThreeTwoOneFinal = () => {
  const { addExerciseHistory } = useApp();

  useEffect(() => {
    // Save exercise history when component mounts
    const saveHistory = async () => {
      await addExerciseHistory({
        exerciseName: '5-4-3-2-1 Grounding',
        exerciseType: 'Grounding exercise',
        date: new Date().toISOString(),
        duration: 300, // Assuming it takes about 5 minutes to complete
      });
    };

    saveHistory();
  }, []);

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
           <View className='flex flex-col gap-2 items-center w-3/4'>
           <Text className='text-primary w-56 text-center'>You successfully completed</Text>
            <Text className='text-4xl text-bold text-secondary w-56 text-center'>grounded yourself</Text>
            <Text className='text-primary w-56 text-center'>with the 5-4-3-2-1 method</Text>
           </View>
        </View>
        
        <CustomButton title='To Home' onPress={() => {router.replace('/(main)/home')}}/>
    </SafeAreaView>
  )
}

export default FiveFourThreeTwoOneFinal        