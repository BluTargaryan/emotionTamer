import React from 'react';
import { KeyboardTypeOptions, TextInput } from 'react-native';

interface CustomTextInputProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

const CustomTextInput = ({ placeholder, value, onChangeText, secureTextEntry = false, keyboardType }: CustomTextInputProps) => {
  // Auto-detect keyboard type if not explicitly provided
  const autoKeyboardType = keyboardType || (placeholder.toLowerCase().includes('email') ? 'email-address' : 'default')
  
  return (
    <TextInput 
           placeholder={placeholder}
           className='w-72 h-12 border-b text-center border-primary'
           placeholderTextColor="#1E4335"
           style={{ textAlign: 'center' }}
           value={value}
           onChangeText={onChangeText}
           secureTextEntry={secureTextEntry}
           autoCapitalize="none"
           keyboardType={autoKeyboardType}
    />
  )
}

export default CustomTextInput