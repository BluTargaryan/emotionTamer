import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

const CustomButton = ({title, onPress, bgColor = "primary"}:{title:string, onPress:()=>void, bgColor?:string}) => {
  const backgroundColor = bgColor === "secondary" ? "bg-secondary" : "bg-primary"
  const textColor = bgColor === "secondary" ? "text-primary" : "text-background"
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`${backgroundColor} rounded-md flex items-center justify-center h-12 w-56`}
    >
      <Text className={`${textColor}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton