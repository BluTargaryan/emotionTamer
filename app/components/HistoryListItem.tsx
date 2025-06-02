import React from 'react'
import { Text, View } from 'react-native'
const HistoryListItem = () => {
  return (
    <View className='w-full rounded-lg flex- flex-col bg-primary py-3 px-2 gap-2'>
     <View className='flex flex-row justify-between items-center'>
        <Text className='text-background font-semibold'>
           4-7-8 Breathing
        </Text>
        <Text className='text-background'>
            10 minutes
        </Text>
     </View>
     <Text className='text-background text-xs'>
     12 / 5 / 2025
     </Text>
    </View>
  )
}

export default HistoryListItem