import { router } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";


export default function Index() {
  return (
    <SafeAreaView
      className="w-full h-full bg-background flex items-center justify-center gap-4"
    >
        <Text className="text-primary font-bold text-2xl">Emotion Tamer</Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/signin")}
          activeOpacity={0.7}
          className="bg-primary rounded-md flex items-center justify-center h-12 w-56"
        >
          <Text className="text-background ">Sign In</Text>
        </TouchableOpacity>

    </SafeAreaView>
  );
}
