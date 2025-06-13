import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { Image, SafeAreaView, Text, View } from 'react-native'
import CustomButton from '../components/CustomButton'
import { useApp } from '../context/AppContext'

const SoothingSoundsFinal = () => {
    const { minutes } = useLocalSearchParams();
    const { addExerciseHistory } = useApp();

    useEffect(() => {
        // Save exercise history when component mounts
        const saveHistory = async () => {
            const duration = parseInt(minutes as string) * 60; // Convert minutes to seconds
            
            await addExerciseHistory({
                exerciseName: 'Soothing Sounds',
                exerciseType: 'Relaxation exercise',
                date: new Date().toISOString(),
                duration: duration,
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
                <View className='flex flex-col gap-2 items-center'>
                    <Text className='text-primary w-56 text-center'>You successfully completed</Text>
                    <Text className='text-4xl text-bold text-secondary w-56 text-center'>{minutes} minutes</Text>
                    <Text className='text-primary w-56 text-center'>of soothing sounds relaxation</Text>
                </View>
            </View>
            
            <CustomButton title='Back to Home' onPress={() => {router.replace('/(main)/home' as any)}} bgColor='primary' />
        </SafeAreaView>
    )
}

export default SoothingSoundsFinal 