import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function M13LostGroundScreen() {
  const router = useRouter();

  const handleBack = () => {
    // Back to vault — dashboard is the canonical vault entry
    router.replace("/(app)/m06-dashboard" as never);
  };

  return (
    <View className="flex-1 bg-vault-void relative overflow-hidden">
      {/* Grid — 40px cells, vault-hairline #241f17 on vault-void #0c0b09 */}
      <View
        className="absolute inset-0 overflow-hidden"
        pointerEvents="none"
        aria-hidden
      >
        <View className="absolute inset-0 flex-row flex-wrap">
          {Array.from({ length: 300 }).map((_, i) => (
            <View
              key={i}
              className="w-10 h-10 border-r border-b border-vault-hairline"
            />
          ))}
        </View>
      </View>

      {/* Centered canvas — px-gutter, flex-1, z-10 */}
      <View className="flex-1 items-center justify-center px-gutter z-10">
        {/* Plate — w-full max-w-sm p-section_padding bg-vault-plate border vault-hairline */}
        <View className="w-full max-w-sm bg-vault-plate border border-vault-hairline p-section_padding items-center gap-stack_md relative shadow-2xl shadow-black/50">
          {/* 4 corner ticks — 8px (w-2 h-2) vault-amber #d4a845 */}
          <View className="absolute top-0 left-0 w-2 h-2 border-t border-l border-vault-amber pointer-events-none" />
          <View className="absolute top-0 right-0 w-2 h-2 border-t border-r border-vault-amber pointer-events-none" />
          <View className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-vault-amber pointer-events-none" />
          <View className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-vault-amber pointer-events-none" />

          {/* Eyebrow — Lost ground — text-vault-amber, label-eyebrow 12px 0.3em 600 */}
          <Text className="text-[12px] font-semibold leading-none tracking-[0.3em] text-vault-amber uppercase text-center">
            Lost ground
          </Text>

          {/* Headline — This parcel doesn't exist. — 36px / 1.15 / 380, italic amber */}
          <Text className="text-[36px] font-normal leading-[42px] text-on-surface text-center">
            This parcel{"\n"}
            <Text className="italic text-vault-amber">doesn&apos;t exist.</Text>
          </Text>

          {/* Copy — secondary-fixed-dim/80, 16px/1.6/350, max-w-[240px] */}
          <Text className="text-[16px] leading-6 font-light text-secondary-fixed-dim/80 text-center max-w-[240px]">
            The page you&apos;re looking for has moved or was never mapped.
          </Text>

          {/* CTA — btn-primary bg-primary-container #e8c877, vault-void text, lift shadow */}
          <Pressable
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Back to your vault"
            className="w-full bg-primary-container px-8 py-3 rounded-sm items-center justify-center mt-4 active:opacity-90 active:translate-y-[-2px] shadow-[0_4px_12px_rgba(212,168,69,0.15)]"
          >
            <Text className="text-[14px] font-medium leading-none tracking-wider uppercase text-vault-void text-center">
              Back to your vault
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
