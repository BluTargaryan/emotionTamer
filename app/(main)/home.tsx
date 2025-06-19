import { router } from 'expo-router'
import React from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import CustomButton from '../components/CustomButton'
import GamifiedStats from '../components/GamifiedStats'
import HomeExercises from '../components/HomeExercises'
import { useApp } from '../context/AppContext'

const Home = () => {
  const { user, logout } = useApp()

  const handleLogout = async () => {
    await logout()
    router.replace('/')
  }

  return (
   <ScrollView className='w-full h-full bg-background px-4'>
    <SafeAreaView className='w-full h-full flex flex-col py-11 gap-11'>    
    {user && (
      <View className='mb-4'>
        <Text className='text-primary text-lg font-semibold'>Welcome back, {user.name || user.email}!</Text>
      </View>
    )}
    <HomeExercises />
    <GamifiedStats />
    
    <CustomButton
    title='Log out'
    onPress={handleLogout}
    bgColor='secondary'
    />
    </SafeAreaView>
   </ScrollView>
  )
}

export default Home