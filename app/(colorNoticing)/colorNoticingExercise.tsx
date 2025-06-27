import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import CircleView from '../components/CircleView'
import CustomButton from '../components/CustomButton'

const ColorNoticingExercise = () => {
    const { color, count } = useLocalSearchParams();
    const [itemsLeft, setItemsLeft] = useState(parseInt(count as string) || 5);
    
    const colors = {
        red: { value: 'bg-red-500', displayName: 'Red' },
        blue: { value: 'bg-blue-500', displayName: 'Blue' },
        green: { value: 'bg-green-500', displayName: 'Green' },
        yellow: { value: 'bg-yellow-500', displayName: 'Yellow' },
        purple: { value: 'bg-purple-500', displayName: 'Purple' },
        orange: { value: 'bg-orange-500', displayName: 'Orange' },
    };

    const selectedColor = colors[color as keyof typeof colors] || colors.red;
    const totalItems = parseInt(count as string) || 5;

    const handleItemFound = () => {
        if (itemsLeft > 1) {
            setItemsLeft(itemsLeft - 1);
        } else {
            router.replace(`/(colorNoticing)/colorNoticingFinal?color=${color}&count=${totalItems}` as any);
        }
    };

    return (
        <SafeAreaView className='w-full h-full bg-background flex flex-col items-center justify-center gap-20'>
            <View className='flex flex-col gap-9 items-center w-3/4'>
                <Text className='text-2xl text-center text-primary'>
                    Look around and find items that are
                </Text>
                
                <View className='flex flex-col gap-4 items-center'>
                    <View 
                        className={`w-20 h-20 rounded-full border-4 border-primary ${selectedColor.value}`}
                    />
                    <Text className='text-xl font-bold text-primary'>{selectedColor.displayName}</Text>
                </View>
                
                <Text className='text-lg text-center text-primary'>
                    Tap the eye below each time you spot something {selectedColor.displayName.toLowerCase()}
                </Text>
                
                <TouchableOpacity onPress={handleItemFound}>
                    <CircleView component={
                        <Image 
                            source={require('../../assets/images/eye.png')} 
                            className='w-auto h-28 z-10' 
                            resizeMode='contain'
                        />
                    } />
                </TouchableOpacity>
                
                <Text className='text-xl text-primary'>
                    {itemsLeft} {itemsLeft === 1 ? 'item' : 'items'} left to find
                </Text>
            </View>
            
            <CustomButton 
                title='Quit' 
                onPress={() => {router.replace('/(colorNoticing)/colorNoticingStartPage' as any)}} 
                bgColor='secondary' 
            />
        </SafeAreaView>
    )
}

export default ColorNoticingExercise 