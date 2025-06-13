import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { Image, SafeAreaView, Text, View } from 'react-native'
import CustomButton from '../components/CustomButton'
import { useApp } from '../context/AppContext'

const ColorNoticingFinal = () => {
    const { color, count } = useLocalSearchParams();
    const { addExerciseHistory } = useApp();

    const colors = {
        red: { value: '#EF4444', displayName: 'Red' },
        blue: { value: '#3B82F6', displayName: 'Blue' },
        green: { value: '#10B981', displayName: 'Green' },
        yellow: { value: '#F59E0B', displayName: 'Yellow' },
        purple: { value: '#8B5CF6', displayName: 'Purple' },
        orange: { value: '#F97316', displayName: 'Orange' },
    };

    const selectedColor = colors[color as keyof typeof colors] || colors.red;

    useEffect(() => {
        // Save exercise history when component mounts
        const saveHistory = async () => {
            // Estimate duration based on items found (approximately 30 seconds per item)
            const duration = parseInt(count as string) * 30;
            
            await addExerciseHistory({
                exerciseName: 'Color Noticing',
                exerciseType: 'Mindfulness exercise',
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
                <Image 
                    source={require('../../assets/images/happywoman.png')} 
                    className='w-auto h-56' 
                    resizeMode='contain'
                />
                <View className='flex flex-col gap-2 items-center'>
                    <Text className='text-primary w-56 text-center'>You successfully found</Text>
                    <Text className='text-4xl text-bold text-secondary w-56 text-center'>{count} {selectedColor.displayName.toLowerCase()}</Text>
                    <Text className='text-primary w-56 text-center'>items around you</Text>
                </View>
                
                <View className='flex flex-col gap-2 items-center'>
                    <View 
                        className='w-16 h-16 rounded-full border-4 border-primary'
                        style={{ backgroundColor: selectedColor.value }}
                    />
                    <Text className='text-sm text-primary text-center'>
                        Great job staying present and mindful!
                    </Text>
                </View>
            </View>
            
            <CustomButton 
                title='Back to Home' 
                onPress={() => {router.replace('/(main)/home' as any)}} 
                bgColor='primary' 
            />
        </SafeAreaView>
    )
}

export default ColorNoticingFinal 