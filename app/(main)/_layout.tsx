import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

const MainLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1E4335',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#EDE6DE',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
        headerStyle: {
          backgroundColor: '#1E4335',
        },
        headerTintColor: '#EDE6DE',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 24
        },
      }}
    >
      <Tabs.Screen 
        name="home"
        options={{
          title: 'Home',
          headerTitle: 'Emotion Tamer',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="data"
        options={{
          title: 'Data',
          headerTitle: 'Your Data',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

export default MainLayout