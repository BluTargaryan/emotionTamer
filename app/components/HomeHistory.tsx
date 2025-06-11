import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import HistoryListItem from './HistoryListItem';

interface ExerciseHistory {
  id: string;
  exerciseName: string;
  exerciseType: string;
  date: string;
  duration: number;
}

const HomeHistory = () => {
  const { getExerciseHistory } = useApp();
  const [history, setHistory] = useState<ExerciseHistory[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const historyData = await getExerciseHistory();
    setHistory(historyData);
  };

  return (
    <View className='flex flex-col gap-4'>
      <Text className='text-primary text-2xl font-bold'>History</Text>
      <ScrollView  
        className='h-96'
        nestedScrollEnabled={true}
        contentContainerStyle={{
          gap: 10,
          paddingBottom: 20,
          paddingRight: 8
        }}
      >
        {history.length > 0 ? (
          history.map((item) => (
            <HistoryListItem
              key={item.id}
              exerciseName={item.exerciseName}
              exerciseType={item.exerciseType}
              date={item.date}
              duration={item.duration}
            />
          ))
        ) : (
          <Text className='text-primary text-center'>No exercise history yet</Text>
        )}
      </ScrollView>
    </View>
  )
}

export default HomeHistory