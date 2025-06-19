import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';

interface ExerciseHistory {
  id: string;
  exerciseName: string;
  exerciseType: string;
  date: string;
  duration: number;
}

interface Achievement {
  id: string;
  title: string;
  icon: string;
  target: number;
  current: number;
  unlocked: boolean;
  color: string;
}

const SimpleGamifiedStats = () => {
  const { getExerciseHistory } = useApp();
  const [history, setHistory] = useState<ExerciseHistory[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const historyData = await getExerciseHistory();
    setHistory(historyData);
    calculateAchievements(historyData);
  };

  const calculateStats = () => {
    if (!history.length) return { totalXP: 0, level: 1, currentStreak: 0, totalExercises: 0, weeklyProgress: 0 };

    const totalXP = history.reduce((sum, exercise) => sum + exercise.duration, 0);
    const level = Math.floor(totalXP / 1800) + 1;
    const totalExercises = history.length;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeekExercises = history.filter(ex => new Date(ex.date) >= weekAgo);
    const weeklyProgress = Math.min((thisWeekExercises.length / 7) * 100, 100);

    return { totalXP, level, currentStreak: 3, totalExercises, weeklyProgress };
  };

  const calculateAchievements = (historyData: ExerciseHistory[]) => {
    const totalXP = historyData.reduce((sum, ex) => sum + ex.duration, 0);
    const totalExercises = historyData.length;
    const uniqueTypes = new Set(historyData.map(ex => ex.exerciseType)).size;
    
    const newAchievements: Achievement[] = [
      {
        id: 'first_steps',
        title: 'First Steps',
        icon: 'footsteps',
        target: 1,
        current: totalExercises,
        unlocked: totalExercises >= 1,
        color: '#10B981'
      },
      {
        id: 'getting_started',
        title: 'Getting Started',
        icon: 'checkmark-circle',
        target: 5,
        current: totalExercises,
        unlocked: totalExercises >= 5,
        color: '#3B82F6'
      },
      {
        id: 'marathon',
        title: 'Marathon',
        icon: 'time',
        target: 1800,
        current: totalXP,
        unlocked: totalXP >= 1800,
        color: '#8B5CF6'
      },
      {
        id: 'variety_seeker',
        title: 'Variety Seeker',
        icon: 'apps',
        target: 3,
        current: uniqueTypes,
        unlocked: uniqueTypes >= 3,
        color: '#F59E0B'
      }
    ];

    setAchievements(newAchievements);
  };

  const { totalXP, level, currentStreak, totalExercises, weeklyProgress } = calculateStats();
  const levelProgress = (totalXP % 1800 / 1800) * 100;

  return (
    <View className='flex flex-col gap-6'>
      <Text className='text-primary text-2xl font-bold'>Your Progress</Text>
      
      <View className='flex flex-row justify-between items-center bg-white rounded-2xl p-6 shadow-sm'>
        <View className='flex items-center'>
          <View className='relative w-20 h-20 items-center justify-center'>
            <View className='absolute inset-0 rounded-full border-8 border-gray-200' />
            <View className='absolute inset-0 flex items-center justify-center'>
              <Text className='text-primary text-sm font-bold'>{Math.round(weeklyProgress)}%</Text>
            </View>
          </View>
          <Text className='text-primary text-xs mt-2'>Weekly</Text>
        </View>

        <View className='flex items-center'>
          <View className='bg-primary rounded-full w-16 h-16 flex items-center justify-center'>
            <Text className='text-background text-xl font-bold'>{level}</Text>
          </View>
          <Text className='text-primary text-sm font-semibold mt-1'>Level</Text>
        </View>

        <View className='flex items-center'>
          <Ionicons name="flame" size={32} color="#EF4444" />
          <Text className='text-primary text-lg font-bold'>{currentStreak}</Text>
          <Text className='text-primary text-xs'>Streak</Text>
        </View>
      </View>

      <View className='flex flex-row justify-between bg-white rounded-2xl p-4 shadow-sm'>
        <View className='flex items-center flex-1'>
          <Text className='text-2xl font-bold text-primary'>{totalExercises}</Text>
          <Text className='text-sm text-gray-600'>Sessions</Text>
        </View>
        <View className='flex items-center flex-1'>
          <Text className='text-2xl font-bold text-primary'>{Math.floor(totalXP / 60)}</Text>
          <Text className='text-sm text-gray-600'>Minutes</Text>
        </View>
        <View className='flex items-center flex-1'>
          <Text className='text-2xl font-bold text-primary'>{totalXP}</Text>
          <Text className='text-sm text-gray-600'>XP</Text>
        </View>
      </View>

      <View className='bg-white rounded-2xl p-6 shadow-sm'>
        <Text className='text-primary text-lg font-semibold mb-4'>Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
          {achievements.map((achievement) => (
            <View 
              key={achievement.id} 
              className={`flex items-center p-4 rounded-xl ${achievement.unlocked ? 'bg-green-50' : 'bg-gray-50'}`}
              style={{ width: 100 }}
            >
              <View className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-green-500' : 'bg-gray-400'}`}>
                <Ionicons 
                  name={achievement.icon as any} 
                  size={24} 
                  color="white" 
                />
              </View>
              <Text className={`text-sm font-semibold mt-2 text-center ${achievement.unlocked ? 'text-green-700' : 'text-gray-600'}`}>
                {achievement.title}
              </Text>
              <Text className='text-xs text-gray-500 text-center mt-1'>
                {achievement.current}/{achievement.target}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className='bg-blue-50 rounded-2xl p-6'>
        <Text className='text-primary text-lg font-semibold mb-3'>🎯 Goals</Text>
        <View className='flex flex-col gap-3'>
          <View className='flex flex-row items-center justify-between'>
            <Text className='text-primary text-sm'>Weekly Progress</Text>
            <Text className='text-green-600 text-sm font-semibold'>{Math.round(weeklyProgress)}%</Text>
          </View>
          <View className='flex flex-row items-center justify-between'>
            <Text className='text-primary text-sm'>Next Level</Text>
            <Text className='text-blue-600 text-sm font-semibold'>{Math.round(levelProgress)}%</Text>
          </View>
          <View className='flex flex-row items-center justify-between'>
            <Text className='text-primary text-sm'>Achievements</Text>
            <Text className='text-purple-600 text-sm font-semibold'>{achievements.filter(a => a.unlocked).length}/{achievements.length}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SimpleGamifiedStats; 