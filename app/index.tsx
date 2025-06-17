import { router } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";
import CustomButton from "./components/CustomButton";
import TitleText from "./components/TitleText";
import { useApp } from "./context/AppContext";

export default function Index() {
  const { user } = useApp();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      router.replace("/(main)/home");
    }
  }, [user]);

  return (
    <SafeAreaView
      className="w-full h-full bg-background flex items-center justify-center gap-4"
    >
        <TitleText title="Emotion Tamer" />
        <CustomButton 
          title="Login" 
          onPress={() => router.push("/(auth)/signin")} 
          bgColor="primary" 
        />
        <CustomButton title="Register" onPress={()=>router.push("/(auth)/signup")} bgColor="secondary" />
    </SafeAreaView>
  );
}
