import { router } from "expo-router";
import { SafeAreaView } from "react-native";
import CustomButton from "./components/CustomButton";
import TitleText from "./components/TitleText";

export default function Index() {
  return (
    <SafeAreaView
      className="w-full h-full bg-background flex items-center justify-center gap-4"
    >
        <TitleText title="Emotion Tamer" />
        <CustomButton title="Login" onPress={()=>router.push("/(auth)/signin")} bgColor="primary" />
        <CustomButton title="Register" onPress={()=>router.push("/(auth)/signup")} bgColor="secondary" />
    </SafeAreaView>
  );
}
