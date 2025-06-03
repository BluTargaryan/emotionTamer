import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, TextInput, View } from 'react-native'
import CustomButton from '../components/CustomButton'

const breathingStartPage = () => {
  const [cycles, setCycles] = useState('');
  const [alert, setAlert] = useState(false);

  const handleStart = () => {
    if (cycles.length === 0) {
      setAlert(true);
      return;
    }
    const cycleCount = parseInt(cycles);
    if (cycleCount && cycleCount > 0) {
      router.replace(`/(breathing)/breathingStageOne?totalCycles=${cycleCount}&currentCycle=1`);
    }
  };

  useEffect(() => {
    if (cycles.length > 0) {
      setAlert(false);
    }
  }, [cycles]);

  return (
    <SafeAreaView className='w-full h-full bg-background flex flex-col items-center justify-center gap-20'>
        <View className='flex flex-col gap-3 items-center w-1/2'>
            <Text className='text-2xl font-bold text-primary'>4-7-8 breathing</Text>
            <Text className='text-center text-primary'>
            Vorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum 
            </Text>
        </View>
        <View className='flex flex-col gap-9 items-center'>
        <Text className={`w-72 text-center text-primary ${alert ? 'text-red-500' : 'hidden'}`}>
        No number of cycles? Please set the number of cycles to continue
        </Text>
        <TextInput 
           placeholder='Set cycles (number of rounds)'
           className='w-72 h-12 border-b text-center border-primary'
           keyboardType="numeric"
           placeholderTextColor="#1E4335"
           style={{ textAlign: 'center' }}
           value={cycles}
           onChangeText={(text) => setCycles(text)}
    />
            <CustomButton title='Start' onPress={handleStart} />
        </View>
    </SafeAreaView>
  )
}

export default breathingStartPage