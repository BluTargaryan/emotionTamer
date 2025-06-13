import { Audio } from 'expo-av'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, Text, View } from 'react-native'
import CustomButton from '../components/CustomButton'

const SoothingSoundsPlay = () => {
    const { minutes } = useLocalSearchParams();
    const [timeLeft, setTimeLeft] = useState(parseInt(minutes as string) * 60); // Convert minutes to seconds
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const totalMinutes = parseInt(minutes as string) || 5;

    // Format time display
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        // Load and play sound when component mounts
        const loadSound = async () => {
            try {
                // Set audio mode for playback
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    staysActiveInBackground: true,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                });

                const { sound: audioSound } = await Audio.Sound.createAsync(
                    require('../../assets/sounds/white-noise.mp3'),
                    { 
                        shouldPlay: true, 
                        isLooping: true,
                        volume: 0.7
                    }
                );
                setSound(audioSound);
                setIsPlaying(true);
            } catch (error) {
                console.error('Error loading sound:', error);
            }
        };

        loadSound();

        return () => {
            // Cleanup sound when component unmounts
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    useEffect(() => {
        // Countdown timer
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        } else {
            // Time's up, stop sound and navigate to final page
            if (sound) {
                sound.stopAsync();
            }
            router.replace(`/(soothingSounds)/soothingSoundsFinal?minutes=${totalMinutes}` as any);
        }
    }, [timeLeft]);

    const handleStop = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
        }
        router.replace('/(soothingSounds)/soothingSoundsStartPage' as any);
    };

    return (
        <SafeAreaView className='w-full h-full bg-background flex flex-col items-center justify-center gap-20'>
            <View className='flex flex-col gap-9 items-center w-1/2'>
                <Text className='text-2xl text-center text-primary'>
                    Relax and Listen
                </Text>
                <Image 
                    source={require('../../assets/images/lungs.png')} 
                    className='w-auto h-56' 
                    resizeMode='contain'
                />
                <Text className='text-4xl font-bold text-primary w-56 text-center'>{formatTime(timeLeft)}</Text>
                <Text className='text-lg text-primary text-center'>
                    {isPlaying ? 'Playing soothing sounds...' : 'Loading...'}
                </Text>
            </View>
            
            <CustomButton title='Stop' onPress={handleStop} bgColor='secondary' />
        </SafeAreaView>
    )
}

export default SoothingSoundsPlay 