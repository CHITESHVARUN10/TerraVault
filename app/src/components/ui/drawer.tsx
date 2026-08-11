import { Modal, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CornerTicks } from './plate';

const links = [
  { label: 'Dashboard', href: '/(app)/m06-dashboard' },
  { label: 'Properties', href: '/(app)/m07-all-properties' },
  { label: 'Contact', href: '/(app)/m19-contact' },
] as const;

export function Drawer({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const router = useRouter();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {/* Dim overlay — bg-surface-container-lowest/80 backdrop-blur */}
      <View className="flex-1 flex-row justify-end bg-surface-container-lowest/80">
        {/* Pressable backdrop to close on tap */}
        <Pressable className="flex-1" onPress={onClose} />

        {/* Slide-out panel — w-[85%] max-w-sm bg-surface-dim border-l border-surface-variant */}
        <View className="w-[85%] max-w-sm h-full bg-surface-dim border-l border-surface-variant relative flex-col">
          <CornerTicks />

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-5 border-b border-surface-variant">
            <Text className="text-[20px] font-semibold tracking-tighter text-secondary">TERRAVAULT</Text>
            <Pressable
              onPress={onClose}
              accessibilityLabel="Close menu"
              hitSlop={8}
              className="p-1 active:opacity-70"
            >
              <Text className="text-on-surface-variant text-[22px] leading-none">✕</Text>
            </Pressable>
          </View>

          {/* Navigation Links */}
          <View className="flex-1 px-6 py-10 gap-6">
            {links.map((l) => (
              <Pressable
                key={l.label}
                onPress={() => {
                  onClose();
                  router.push(l.href as never);
                }}
                className="self-start active:opacity-70"
              >
                <Text className="text-[32px] font-light leading-tight text-on-surface">{l.label}</Text>
                {/* gold sweep underline approximation */}
                <View className="h-[1.5px] w-0 bg-amber mt-1" />
              </Pressable>
            ))}
          </View>

          {/* Footer / User Actions */}
          <View className="px-6 py-6 border-t border-surface-variant flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-sm bg-surface-container border border-surface-variant items-center justify-center">
                <Text className="text-[10px] font-semibold tracking-widest text-secondary">OP</Text>
              </View>
              <View className="gap-1">
                <Text className="text-[12px] font-medium text-on-surface">Operator_42</Text>
                <Text className="text-[10px] tracking-[0.2em] text-on-surface-variant">LOGGED IN</Text>
              </View>
            </View>
            <Pressable onPress={onClose} hitSlop={8} className="active:opacity-70">
              <Text className="text-[12px] font-medium text-outline">Sign out</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
