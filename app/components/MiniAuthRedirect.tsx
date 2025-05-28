import { MaterialIcons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

interface RedirectProps {
  target: "/(auth)/signin" | "/(auth)/signup"
  text: string
}

const MiniAuthRedirect = ({ target, text }: RedirectProps) => {
  return (
    <Link href={target}>
      <View className="flex-row items-center justify-center gap-2 border-b border-text">
        <Text className="text-primary">{text}</Text>
        <MaterialIcons name='arrow-right-alt' size={20} color="#1E4335"/>
      </View>
    </Link>
  )
}

export default MiniAuthRedirect