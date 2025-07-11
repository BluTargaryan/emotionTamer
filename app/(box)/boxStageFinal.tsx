import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { Image, SafeAreaView, Text, View } from 'react-native'
import CustomButton from '../components/CustomButton'
import { useApp } from '../context/AppContext'

const boxStageFinal = () => {
    const { totalCycles } = useLocalSearchParams();
    const totalCyclesNum = parseInt(totalCycles as string) || 0;
    const { addExerciseHistory } = useApp();

    useEffect(() => {
        // Save exercise history when component mounts
        const saveHistory = async () => {
            // Calculate duration based on cycles (each cycle is 16 seconds: 4s inhale + 4s hold + 4s exhale + 4s hold)
            const duration = totalCyclesNum * 16;
            
            await addExerciseHistory({
                exerciseName: 'Box Breathing',
                exerciseType: 'Breathing exercise',
                date: new Date().toISOString(),
                duration: duration,
            });
        };

        saveHistory();
    }, [totalCyclesNum]);

    return (
        <SafeAreaView className='w-full h-full bg-background flex flex-col items-center justify-center gap-20'>
            <Text className='text-2xl text-center text-primary'>
                Congratulations!
            </Text>
            
            <View className='flex flex-col gap-9 items-center w-1/2'>
                <Image 
                    source={require('../../assets/images/happywoman.png')} 
                    className='w-auto h-56' 
                    resizeMode='contain'
                />
                <View className='flex flex-col gap-2 items-center'>
                    <Text className='text-primary w-56 text-center'>You successfully completed</Text>
                    <Text className='text-4xl text-bold text-secondary w-56 text-center'>{totalCyclesNum} cycles</Text>
                    <Text className='text-primary w-56 text-center'>of box breathing</Text>
                </View>
            </View>
            
            <CustomButton title='To Home' onPress={() => {router.replace('/(main)/home' as any)}}/>
        </SafeAreaView>
    )
}

export default boxStageFinal 