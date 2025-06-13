import { router } from 'expo-router'
import React, { useState } from 'react'
import { SafeAreaView, Text, TextInput, View } from 'react-native'
import CustomButton from '../components/CustomButton'

const SoothingSoundsStartPage = () => {
    const [minutes, setMinutes] = useState('5');

    const handleStart = () => {
        const minuteCount = parseInt(minutes);
        if (minuteCount && minuteCount > 0) {
            router.replace(`/(soothingSounds)/soothingSoundsPlay?minutes=${minuteCount}` as any);
        }
    };

    return (
        <SafeAreaView className='w-full h-full bg-background flex flex-col items-center justify-center gap-20'>
            <View className='flex flex-col gap-3 items-center w-1/2'>
                <Text className='text-2xl font-bold text-primary text-center'>Soothing Sounds</Text>
                <Text className='text-center text-primary'>
                    Relax and unwind with calming white noise. Choose how long you'd like to listen and let the soothing sounds help you find peace and tranquility.
                </Text>
            </View>
            
            <View className='flex flex-col gap-4 items-center'>
                <Text className='text-lg text-primary'>How many minutes?</Text>
                <TextInput
                    className='border border-primary rounded-lg px-4 py-2 text-primary text-center w-20'
                    value={minutes}
                    onChangeText={setMinutes}
                    keyboardType='numeric'
                    placeholder='5'
                />
            </View>
            
            <CustomButton title='Start' onPress={handleStart} />    
        </SafeAreaView>
    )
}

export default SoothingSoundsStartPage 