import React from 'react'
import { TextInput } from 'react-native'

const CustomNumberInput = ({placeholder, value, onChangeText}:{placeholder:string, value:number, onChangeText: (text: string) => void}) => {
  return (
    <TextInput 
           placeholder={placeholder}
           className='w-72 h-12 border-b text-center border-primary'
           keyboardType="numeric"
           placeholderTextColor="#1E4335"
           style={{ textAlign: 'center' }}
           value={value.toString()}
           onChangeText={onChangeText}
    />
  )
}

export default CustomNumberInput