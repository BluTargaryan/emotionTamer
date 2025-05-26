import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text>Edit this to to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height:"100%",
    width:"100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});