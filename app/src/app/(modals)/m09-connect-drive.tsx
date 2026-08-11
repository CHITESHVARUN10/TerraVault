import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function M09ConnectDriveScreen() {
  const router = useRouter();

  const handleReturn = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(app)/m06-dashboard" as never);
  };

  const handleConnect = () => {
    // placeholder — authorize secure cloud access
    handleReturn();
  };

  return (
    <View className="flex-1 bg-[#0c0b09] items-center justify-center p-4">
      {/* Body radial: circle at center rgba(212,168,69,0.03) 0% → transparent 70% */}
      <View
        pointerEvents="none"
        className="absolute inset-0 items-center justify-center overflow-hidden"
        style={{ backgroundColor: "transparent" }}
      >
        <View
          style={{
            width: 900,
            height: 900,
            borderRadius: 9999,
            backgroundColor: "rgba(212,168,69,0.03)",
            marginTop: -60,
          }}
        />
      </View>

      {/* archive-plate bg-[#1a1813] border-[#241f17] max-w-sm p-stack_md (2rem=32px) */}
      <View className="relative w-full max-w-sm bg-[#1a1813] border border-[#241f17] p-8 p-stack_md flex flex-col gap-8 gap-stack_md">
        {/* 4 corner ticks #d4a845 — 8px L */}
        <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-[#d4a845] pointer-events-none" />
        <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-[#d4a845] pointer-events-none" />
        <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-[#d4a845] pointer-events-none" />
        <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-[#d4a845] pointer-events-none" />

        {/* Header — cloud_sync icon text-primary-container 4xl */}
        <View className="items-center">
          <Text className="text-4xl leading-none text-primary-container mb-4 text-center">cloud_sync</Text>
          <Text className="font-headline-sm text-headline-sm text-secondary text-center">
            Connect Drive
          </Text>
        </View>

        {/* Content — font-body-md text-body-md text-on-surface-variant gap-4 px-2 */}
        <View className="flex flex-col gap-4 px-2">
          <Text className="font-body-md text-body-md text-on-surface-variant text-center mb-2">
            Authorize secure cloud access to archive your geological data assets.
          </Text>

          <View className="flex flex-col gap-3">
            <View className="flex-row items-start gap-3">
              <Text className="text-lg leading-none text-outline mt-[2px]">check_circle</Text>
              <Text className="flex-1 font-body-md text-body-md text-on-surface-variant">
                Sync land deeds and vital records
              </Text>
            </View>
            <View className="flex-row items-start gap-3">
              <Text className="text-lg leading-none text-outline mt-[2px]">check_circle</Text>
              <Text className="flex-1 font-body-md text-body-md text-on-surface-variant">
                Backup subterranean survey photos
              </Text>
            </View>
            <View className="flex-row items-start gap-3">
              <Text className="text-lg leading-none text-outline mt-[2px]">check_circle</Text>
              <Text className="flex-1 font-body-md text-body-md text-on-surface-variant">
                Secure encrypted cloud archive
              </Text>
            </View>
          </View>
        </View>

        {/* Actions — gap-4 mt-4 */}
        <View className="flex flex-col gap-4 mt-4">
          {/* btn-primary bg-[#e8c877] Connect with Google (G SVG approximated as text) */}
          <Pressable
            onPress={handleConnect}
            className="w-full bg-[#e8c877] border border-[#e8c877] py-3 px-6 flex-row items-center justify-center gap-2 active:opacity-90"
            accessibilityRole="button"
            accessibilityLabel="Connect with Google"
          >
            {/* G SVG approximated as text */}
            <Text className="text-[18px] leading-none font-bold text-[#0c0b09]">G</Text>
            <Text className="font-label-ui text-label-ui text-[#0c0b09] text-center">
              Connect with Google
            </Text>
          </Pressable>

          {/* Return to Dashboard nav-link */}
          <View className="items-center">
            <Pressable
              onPress={handleReturn}
              className="flex-row items-center gap-1 px-1 py-1 active:opacity-60"
              hitSlop={8}
              accessibilityRole="link"
              accessibilityLabel="Return to Dashboard"
            >
              <Text className="text-sm leading-none text-outline">arrow_back</Text>
              <Text className="font-label-ui text-label-ui text-outline text-center">
                Return to Dashboard
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
