import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, TextInput, View } from 'react-native'
import CustomButton from '../components/CustomButton'

const alternateNostrilsStartPage = () => {
  const [cycles, setCycles] = useState('');
  const [alert, setAlert] = useState(false);

  const handleStart = () => {
    if (cycles.length === 0) {
      setAlert(true);
      return;
    }
    const cycleCount = parseInt(cycles);
    if (cycleCount && cycleCount > 0) {
      router.replace(`/(alternateNostrils)/alternateNostrilsStageInhaleLeft?totalCycles=${cycleCount}&currentCycle=1` as any);
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
            <Text className='text-2xl font-bold text-primary text-center'>Alternate Nostril Breathing</Text>
            <Text className='text-center text-primary'>
              Alternate nostril breathing is a calming breathing technique that helps balance the mind and body. 
              This exercise involves breathing through one nostril at a time while closing the other, creating a 
              natural rhythm that promotes relaxation and mental clarity.
            </Text>
        </View>
        <View className='flex flex-col gap-9 items-center'>
            <Text className={`w-72 text-center text-primary ${alert ? 'text-red-500' : 'hidden'}`}>
              Please set the number of cycles to continue
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

export default alternateNostrilsStartPage 