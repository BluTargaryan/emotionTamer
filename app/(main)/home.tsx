import { router } from 'expo-router'
import React from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import CustomButton from '../components/CustomButton'
import HomeExercises from '../components/HomeExercises'
import HomeHistory from '../components/HomeHistory'

const Home = () => {
  return (
   <ScrollView className='w-full h-full bg-background px-4'>
    <SafeAreaView className='w-full h-full flex flex-col py-11 gap-11'>    
    <HomeExercises />
    <HomeHistory />
    <CustomButton
    title='Log out  '
    onPress={() => {router.replace('/')}}
    bgColor='secondary'
    />
    </SafeAreaView>
   </ScrollView>
  )
}

export default Home