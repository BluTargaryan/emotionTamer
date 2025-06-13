import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { Image, SafeAreaView, Text, View } from 'react-native'
import CustomButton from '../components/CustomButton'
import { useApp } from '../context/AppContext'

const alternateNostrilsStageFinal = () => {
    const { totalCycles } = useLocalSearchParams();
    const { addExerciseHistory } = useApp();

    useEffect(() => {
        // Save exercise history when component mounts
        const saveHistory = async () => {
            // Calculate duration based on cycles (each cycle is 24 seconds: 4s inhale + 4s hold + 4s exhale + 4s inhale + 4s hold + 4s exhale)
            const duration = parseInt(totalCycles as string) * 24;
            
            await addExerciseHistory({
                exerciseName: 'Alternate Nostril Breathing',
                exerciseType: 'Breathing exercise',
                date: new Date().toISOString(),
                duration: duration,
            });
        };

        saveHistory();
    }, []);

    return (
        <SafeAreaView className='w-full h-full bg-background flex flex-col items-center justify-center gap-20'>
            <View className='flex flex-col gap-9 items-center w-1/2'>
                <Text className='text-2xl text-center text-primary'>
                Congratulations!
                </Text>
                <Image 
                    source={require('../../assets/images/happywoman.png')} 
                    className='w-auto h-56' 
                    resizeMode='contain'
                />
                <View className='flex flex-col gap-2 items-center'>
           <Text className='text-primary w-56 text-center'>You successfully completed</Text>
            <Text className='text-4xl text-bold text-secondary w-56 text-center'>{totalCycles} cycles</Text>
            <Text className='text-primary w-56 text-center'>of Alternate Nostril Breathing</Text>
           </View>
            </View>
            
            <CustomButton title='Back to Home' onPress={() => {router.replace('/(main)/home' as any)}} bgColor='primary' />
        </SafeAreaView>
    )
}

export default alternateNostrilsStageFinal 