import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

const CustomButton = ({title, onPress}:{title:string, onPress:()=>void}) => {
  return (
    <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          className="bg-primary rounded-md flex items-center justify-center h-12 w-56"
        >
          <Text className="text-background ">{title}</Text>
        </TouchableOpacity>
  )
}

export default CustomButton