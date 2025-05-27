import React from 'react'
import { Text } from 'react-native'
const TitleText = ({title}:{title:string}) => {
  return (
    <Text className="text-primary font-bold text-2xl">{title}</Text>
  )
}

export default TitleText