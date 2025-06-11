import React from 'react';
import { Text, View } from 'react-native';

interface HistoryListItemProps {
  exerciseName: string;
  exerciseType: string;
  date: string;
  duration: number;
}

const HistoryListItem = ({ exerciseName, exerciseType, date, duration }: HistoryListItemProps) => {
  // Format duration from seconds to minutes and seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View className='w-full rounded-lg flex- flex-col bg-primary py-3 px-2 gap-2'>
     <View className='flex flex-row justify-between items-center'>
        <Text className='text-background font-semibold'>
           {exerciseName}
        </Text>
        <Text className='text-background'>
           {exerciseType}
        </Text>
     </View>
     <View className='flex flex-row justify-between items-center'>
        <Text className='text-background text-xs'>
           {formatDate(date)}
        </Text>
        <Text className='text-background text-xs'>
           Duration: {formatDuration(duration)}
        </Text>
     </View>
    </View>
  )
}

export default HistoryListItem