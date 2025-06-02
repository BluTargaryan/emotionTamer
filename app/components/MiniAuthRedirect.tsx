import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface RedirectProps {
  target: "/(auth)/signin" | "/(auth)/signup" | "/(auth)/forgotPassword"
  text: string
  color: string
}

const MiniAuthRedirect = ({ target, text, color }: RedirectProps) => {
  const textColor = color==="text" ? "text-text" : "text-accent"
  const iconColor = color==="text" ? "#0F0C095" : "#F4A54B"
  const borderColor = color==="text" ? "border-text" : "border-accent"
  return (
    <TouchableOpacity onPress={() => router.replace(target)}>
      <View className={`flex-row items-center justify-center gap-2 border-b ${borderColor}`}>
        <Text className={textColor}>{text}</Text>
        <MaterialIcons name='arrow-right-alt' size={20} color={iconColor}/>
      </View>
    </TouchableOpacity>
  )
}

export default MiniAuthRedirect