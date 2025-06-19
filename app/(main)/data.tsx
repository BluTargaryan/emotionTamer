import React from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import HomeHistory from '../components/HomeHistory'

const Data = () => {
  return (
    <ScrollView className='w-full h-full bg-background px-4'>
      <SafeAreaView className='w-full h-full flex flex-col py-11 gap-11'>    
        <HomeHistory />
      </SafeAreaView>
    </ScrollView>
  )
}

export default Data 