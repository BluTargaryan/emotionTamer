import { router } from 'expo-router'
import React, { useState } from 'react'
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import CustomButton from '../components/CustomButton'

const ColorNoticingStartPage = () => {
    const [selectedColor, setSelectedColor] = useState('red');
    const [itemCount, setItemCount] = useState('5');

    const colors = [
        { name: 'red', value: 'bg-red-500', displayName: 'Red' },
        { name: 'blue', value: 'bg-blue-500', displayName: 'Blue' },
        { name: 'green', value: 'bg-green-500', displayName: 'Green' },
        { name: 'yellow', value: 'bg-yellow-500', displayName: 'Yellow' },
        { name: 'purple', value: 'bg-purple-500', displayName: 'Purple' },
            { name: 'orange', value: 'bg-orange-500', displayName: 'Orange' },
    ];

    const handleStart = () => {
        const count = parseInt(itemCount);
        if (count && count > 0 && selectedColor) {
            router.replace(`/(colorNoticing)/colorNoticingExercise?color=${selectedColor}&count=${count}` as any);
        }
    };

    return (
        <SafeAreaView className='w-full h-full bg-background flex flex-col items-center justify-center gap-20'>
            <View className='flex flex-col gap-3 items-center w-3/4'>
                <Text className='text-2xl font-bold text-primary text-center'>Color Noticing</Text>
                <Text className='text-center text-primary'>
                    This mindfulness exercise helps you focus on the present moment by noticing colors around you. Choose a color and how many items of that color you'd like to find.
                </Text>
            </View>
            
            <View className='flex flex-col gap-6 items-center'>
                <View className='flex flex-col gap-3 items-center'>
                    <Text className='text-lg text-primary'>Choose a color:</Text>
                    <View className='flex flex-row flex-wrap gap-3 justify-center'>
                        {colors.map((color) => (
                            <TouchableOpacity
                                key={color.name}
                                onPress={() => setSelectedColor(color.name)}
                                className={`w-16 h-16 rounded-full border-4 ${color.value} ${
                                    selectedColor === color.name ? 'border-primary' : 'border-gray-300'
                                }`}
                            />
                        ))}
                    </View>
                    <Text className='text-base text-primary capitalize'>
                        Selected: {colors.find(c => c.name === selectedColor)?.displayName}
                    </Text>
                </View>

                <View className='flex flex-col gap-3 items-center'>
                    <Text className='text-lg text-primary'>How many items?</Text>
                    <TextInput
                        className='border border-primary rounded-lg px-4 py-2 text-primary text-center w-20'
                        value={itemCount}
                        onChangeText={setItemCount}
                        keyboardType='numeric'
                        placeholder='5'
                    />
                </View>
            </View>
            
            <CustomButton title='Start' onPress={handleStart} />    
        </SafeAreaView>
    )
}

export default ColorNoticingStartPage 