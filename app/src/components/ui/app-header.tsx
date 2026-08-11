import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

type Props = {
  onMenuPress?: () => void;
  showBack?: boolean;
};

export function AppHeader({ onMenuPress, showBack }: Props) {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between px-4 py-4 bg-ink border-b border-outline-variant">
      {showBack ? (
        <Pressable onPress={() => router.back()} className="p-1">
          <Text className="text-secondary text-[20px]">←</Text>
        </Pressable>
      ) : (
        <Pressable onPress={onMenuPress} className="p-1">
          <Text className="text-secondary text-[20px]">☰</Text>
        </Pressable>
      )}
      <Text className="text-[20px] font-semibold tracking-[-0.02em] text-secondary">TERRAVAULT</Text>
      <View className="w-8 h-8 rounded-full border border-outline-variant bg-surface-container items-center justify-center">
        <Text className="text-[10px] font-semibold text-secondary">AV</Text>
      </View>
    </View>
  );
}
