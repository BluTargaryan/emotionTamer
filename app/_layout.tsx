import { Stack } from "expo-router";
import '../global.css';
import { AppProvider } from './context/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{headerShown:false}}/>
        <Stack.Screen name="(main)" options={{headerShown:false}}/>
        <Stack.Screen name="(breathing)" options={{headerShown:false}}/>
        <Stack.Screen name="(FiveFourThreeTwoOne)" options={{headerShown:false}}/>
        <Stack.Screen name="(box)" options={{headerShown:false}}/>
        <Stack.Screen name="(alternateNostrils)" options={{headerShown:false}}/>
        <Stack.Screen name="(soothingSounds)" options={{headerShown:false}}/>
        <Stack.Screen name="(colorNoticing)" options={{headerShown:false}}/>
      </Stack>
    </AppProvider>
  );
}
