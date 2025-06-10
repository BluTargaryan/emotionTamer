import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const CIRCLE_SIZE = 250;

const CircleView = ({ component }: { component: React.ReactNode }) => {
  return (
    <View className="relative items-center justify-center w-[250px] h-[250px]">
      <Svg height={CIRCLE_SIZE} width={CIRCLE_SIZE} className="absolute left-0 top-0 z-0">
        <Defs>
          <LinearGradient
            id="grad"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#F4A54B" stopOpacity="1" />
            <Stop offset="46%" stopColor="#EBB87D" stopOpacity="1" />
            <Stop offset="100%" stopColor="#EDE6DE" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={CIRCLE_SIZE / 2}
          fill="url(#grad)"
        />
      </Svg>
      <View className="absolute left-0 top-0 w-full h-full items-center justify-center z-10">
        {component}
      </View>
    </View>
  );
};

export default CircleView;