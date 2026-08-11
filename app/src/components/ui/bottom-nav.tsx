import { Pressable, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';

const tabs = [
  { label: 'Scan', icon: '◧', href: '/(app)/m06-dashboard' as const },
  { label: 'Vault', icon: '◈', href: '/(app)/m06-dashboard' as const, active: true },
  { label: 'Secure', icon: '⬢', href: '/(app)/m18-profile' as const },
  { label: 'Log', icon: '▤', href: '/(app)/m07-all-properties' as const },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <View className="flex-row justify-around items-center h-20 px-4 bg-surface-container border-t border-outline-variant">
      {tabs.map((t) => {
        const isActive = t.active && pathname.includes('m06');
        return (
          <Pressable
            key={t.label}
            onPress={() => router.push(t.href)}
            className={`flex-col items-center justify-center gap-1 w-16 ${isActive ? 'bg-secondary-container rounded-full px-4 py-1' : ''}`}
          >
            <Text className={`text-[16px] ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              {t.icon}
            </Text>
            <Text className={`text-[10px] ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
