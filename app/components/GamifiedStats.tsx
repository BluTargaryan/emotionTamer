import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
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
  description: string;
  icon: string;
  target: number;
  current: number;
  unlocked: boolean;
  color: string;
}

const GamifiedStats = () => {
  const { getExerciseHistory } = useApp();
  const [history, setHistory] = useState<ExerciseHistory[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const screenWidth = Dimensions.get('window').width;

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
        description: 'Complete your first exercise',
        icon: 'footsteps',
        target: 1,
        current: totalExercises,
        unlocked: totalExercises >= 1,
        color: '#10B981'
      },
      {
        id: 'getting_started',
        title: 'Getting Started',
        description: 'Complete 5 exercises',
        icon: 'checkmark-circle',
        target: 5,
        current: totalExercises,
        unlocked: totalExercises >= 5,
        color: '#3B82F6'
      },
      {
        id: 'marathon',
        title: 'Marathon',
        description: 'Practice for 30 minutes total',
        icon: 'time',
        target: 1800,
        current: totalXP,
        unlocked: totalXP >= 1800,
        color: '#8B5CF6'
      },
      {
        id: 'variety_seeker',
        title: 'Variety Seeker',
        description: 'Try 3 different exercise types',
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
  const currentLevelXP = totalXP % 1800;
  const levelProgress = (currentLevelXP / 1800) * 100;

  // Chart data
  const getWeeklyData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        count: history.filter(ex => ex.date.split('T')[0] === date.toISOString().split('T')[0]).length
      };
    });

    return last7Days;
  };

  const getExerciseTypeData = () => {
    const typeCounts: { [key: string]: number } = {};
    history.forEach(ex => {
      typeCounts[ex.exerciseType] = (typeCounts[ex.exerciseType] || 0) + 1;
    });

    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));
  };

  const weeklyData = getWeeklyData();
  const exerciseTypeData = getExerciseTypeData();
  const maxWeeklyCount = Math.max(...weeklyData.map(d => d.count), 1);
  const maxTypeCount = Math.max(...exerciseTypeData.map(d => d.count), 1);

  return (
    <View className='flex flex-col gap-6'>
      <Text className='text-primary text-2xl font-bold'>Your Progress</Text>
      
      {/* Hero Stats */}
      <View className='flex flex-row justify-between items-center bg-white rounded-2xl p-6 shadow-sm'>
        <View className='flex items-center'>
          <CircularProgress
            size={80}
            width={8}
            fill={weeklyProgress}
            tintColor="#1E4335"
            backgroundColor="#E5E7EB"
          >
            {() => (
              <View className='flex items-center'>
                <Text className='text-primary text-sm font-bold'>Weekly</Text>
                <Text className='text-primary text-xs'>{Math.round(weeklyProgress)}%</Text>
              </View>
            )}
          </CircularProgress>
          <Text className='text-primary text-xs mt-2 text-center'>Goal Progress</Text>
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
          <Text className='text-primary text-xs'>Day Streak</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View className='flex flex-row justify-between bg-white rounded-2xl p-4 shadow-sm'>
        <View className='flex items-center flex-1'>
          <Text className='text-2xl font-bold text-primary'>{totalExercises}</Text>
          <Text className='text-sm text-gray-600'>Total Sessions</Text>
        </View>
        <View className='w-px bg-gray-200' />
        <View className='flex items-center flex-1'>
          <Text className='text-2xl font-bold text-primary'>{Math.floor(totalXP / 60)}</Text>
          <Text className='text-sm text-gray-600'>Minutes</Text>
        </View>
        <View className='w-px bg-gray-200' />
        <View className='flex items-center flex-1'>
          <Text className='text-2xl font-bold text-primary'>{totalXP}</Text>
          <Text className='text-sm text-gray-600'>XP Earned</Text>
        </View>
      </View>

      {/* Charts */}
      {history.length > 0 && (
        <View className='flex flex-col gap-4'>
          {/* Weekly Activity Chart */}
          <View className='bg-white rounded-2xl p-4 shadow-sm'>
            <Text className='text-primary text-lg font-semibold mb-4'>Weekly Activity</Text>
            <View className='flex flex-row items-end justify-between h-32 px-2'>
              {weeklyData.map((day, index) => (
                <View key={index} className='flex items-center flex-1'>
                  <View className='flex items-center justify-end flex-1 mb-2'>
                    <View 
                      className='bg-primary rounded-t-md w-6'
                      style={{ 
                        height: Math.max((day.count / maxWeeklyCount) * 80, day.count > 0 ? 8 : 0),
                        minHeight: day.count > 0 ? 8 : 0
                      }}
                    />
                    {day.count > 0 && (
                      <Text className='text-xs text-primary font-semibold mt-1'>{day.count}</Text>
                    )}
                  </View>
                  <Text className='text-xs text-gray-600 font-medium'>{day.dayName}</Text>
                </View>
              ))}
            </View>
            <Text className='text-xs text-gray-500 text-center mt-2'>Sessions per day this week</Text>
          </View>

          {/* Exercise Types Chart */}
          <View className='bg-white rounded-2xl p-4 shadow-sm'>
            <Text className='text-primary text-lg font-semibold mb-4'>Exercise Types</Text>
            <View className='flex flex-col gap-3'>
              {exerciseTypeData.length > 0 ? exerciseTypeData.map((item, index) => (
                <View key={index} className='flex flex-row items-center'>
                  <View className='flex-1'>
                    <Text className='text-sm font-medium text-primary mb-1'>{item.type}</Text>
                    <View className='bg-gray-200 rounded-full h-2'>
                      <View 
                        className='bg-primary rounded-full h-2'
                        style={{ width: `${(item.count / maxTypeCount) * 100}%` }}
                      />
                    </View>
                  </View>
                  <Text className='text-sm font-bold text-primary ml-3 w-8 text-right'>{item.count}</Text>
                </View>
              )) : (
                <Text className='text-gray-500 text-center py-4'>No exercise data yet</Text>
              )}
            </View>
            <Text className='text-xs text-gray-500 text-center mt-3'>Total sessions by exercise type</Text>
          </View>
        </View>
      )}

      {/* Achievements */}
      <View className='bg-white rounded-2xl p-6 shadow-sm'>
        <Text className='text-primary text-lg font-semibold mb-4'>Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
          {achievements.map((achievement) => (
            <View 
              key={achievement.id} 
              className={`flex items-center p-4 rounded-xl ${achievement.unlocked ? 'bg-green-50' : 'bg-gray-50'}`}
              style={{ width: 120 }}
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

      {/* Next Goals */}
      <View className='bg-blue-50 rounded-2xl p-6'>
        <Text className='text-primary text-lg font-semibold mb-3'>🎯 Quick Wins</Text>
        <View className='flex flex-col gap-3'>
          <View className='flex flex-row items-center justify-between'>
            <Text className='text-primary text-sm'>Today's Goal: Complete 1 exercise</Text>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          </View>
          <View className='flex flex-row items-center justify-between'>
            <Text className='text-primary text-sm'>This Week: {Math.min(Math.floor(weeklyProgress / 100 * 7), 7)}/7 exercises</Text>
            <Text className='text-green-600 text-sm font-semibold'>{Math.round(weeklyProgress)}%</Text>
          </View>
          <View className='flex flex-row items-center justify-between'>
            <Text className='text-primary text-sm'>Next Level: {Math.round(levelProgress)}% complete</Text>
            <Text className='text-blue-600 text-sm font-semibold'>{1800 - currentLevelXP}s left</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default GamifiedStats; 