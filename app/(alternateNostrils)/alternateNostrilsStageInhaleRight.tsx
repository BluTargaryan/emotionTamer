import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, Text, View } from 'react-native'
import CustomButton from '../components/CustomButton'

const alternateNostrilsStageInhaleRight = () => {
    const { totalCycles, currentCycle } = useLocalSearchParams();
    const [countdown, setCountdown] = useState(4); // 4 seconds for inhale

    const totalCyclesNum = parseInt(totalCycles as string) || 1;
    const currentCycleNum = parseInt(currentCycle as string) || 1;

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            router.replace(`/(alternateNostrils)/alternateNostrilsStageHoldRight?totalCycles=${totalCyclesNum}&currentCycle=${currentCycleNum}` as any);
        }
    }, [countdown]);

    return (
        <SafeAreaView className='w-full h-full bg-background flex flex-col items-center justify-center gap-20'>
            <View className='flex flex-col gap-9 items-center w-1/2'>
                <Text className='text-2xl text-center text-primary'>
                    Breathe in through right nostril
                </Text>
                <Image 
                    source={require('../../assets/images/lungs.png')} 
                    className='w-auto h-56' 
                    resizeMode='contain'
                />
                <Text className='text-4xl font-bold text-primary w-56 text-center'>{countdown} seconds left</Text>
                <Text className='text-lg text-primary text-center'>Cycle {currentCycleNum} of {totalCyclesNum}</Text>
            </View>
            
            <CustomButton title='Quit' onPress={() => {router.replace('/(alternateNostrils)/alternateNostrilsStartPage' as any)}} bgColor='secondary' />
        </SafeAreaView>
    )
}

export default alternateNostrilsStageInhaleRight 