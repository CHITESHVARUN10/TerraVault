import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function M11DriveConnectedScreen() {
  const router = useRouter();

  const handleDisconnect = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(app)/m06-dashboard" as never);
  };

  return (
    <View className="flex-1 bg-background items-center justify-center p-4">
      {/* Connected Panel — relative bg-[#1a1813] border-[#241f17] p-8 flex flex-col items-center text-center w-full max-w-sm */}
      <View className="relative w-full max-w-sm bg-[#1a1813] border border-[#241f17] p-8 flex flex-col items-center">
        {/* Amber Ticks #d4a845 — 8px L */}
        <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-[#d4a845] pointer-events-none" />
        <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-[#d4a845] pointer-events-none" />
        <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-[#d4a845] pointer-events-none" />
        <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-[#d4a845] pointer-events-none" />

        {/* Icon & Headline — mb-4 */}
        <View className="mb-4 items-center">
          {/* check_circle FILL 1 text-tertiary-fixed 4xl */}
          <Text className="text-4xl leading-none text-tertiary-fixed text-center mb-2">check_circle</Text>
          <Text className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface text-center">
            Drive connected
          </Text>
        </View>

        {/* Account Email — font-body-md text-body-md text-secondary-fixed opacity-80 mb-8 */}
        <Text className="font-body-md text-body-md text-secondary-fixed opacity-80 text-center mb-8">
          operator_042@archive.vault
        </Text>

        {/* Usage Bar — w-full mb-6 */}
        <View className="w-full mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-label-eyebrow text-label-eyebrow text-on-surface-variant uppercase tracking-[0.3em]">
              USAGE
            </Text>
            <Text className="font-label-eyebrow text-label-eyebrow text-on-surface-variant">6.2 / 15 GB</Text>
          </View>
          {/* bar h-1 bg-surface-variant w-full overflow-hidden + inner w-41% bg-primary-container */}
          <View className="h-1 bg-surface-variant w-full overflow-hidden">
            <View className="h-full bg-primary-container" style={{ width: "41%" }} />
          </View>
        </View>

        {/* Archival Note — Syncing to chip mb-8 font-label-ui text-outline px-4 py-2 bg-surface-dim border-outline-variant */}
        <View className="mb-8 px-4 py-2 bg-surface-dim border border-outline-variant items-center">
          <Text className="font-label-ui text-label-ui text-outline text-center">Syncing to: TerraVault / Property Vault</Text>
        </View>

        {/* Disconnect Button — w-full border-error-container text-error-container py-3 flex-row gap-2 */}
        <Pressable
          onPress={handleDisconnect}
          className="w-full border border-error-container py-3 flex-row items-center justify-center gap-2 active:bg-surface-container active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel="Disconnect Drive"
        >
          <Text className="text-sm leading-none text-error-container">link_off</Text>
          <Text className="font-label-ui text-label-ui text-error-container text-center">DISCONNECT</Text>
        </Pressable>
      </View>
    </View>
  );
}
