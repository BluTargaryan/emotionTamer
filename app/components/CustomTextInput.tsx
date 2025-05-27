import React from 'react'
import { TextInput } from 'react-native'

const CustomTextInput = ({placeholder}:{placeholder:string}) => {
  return (
    <TextInput 
           placeholder={placeholder}
           className='w-72 h-12 border-b text-center border-primary'
           placeholderTextColor="#1E4335"
           style={{ textAlign: 'center' }}
    />
  )
}

export default CustomTextInput