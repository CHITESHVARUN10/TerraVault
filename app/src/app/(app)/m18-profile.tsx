import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function M18ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState("Operator_42");
  const [nameFocused, setNameFocused] = useState(false);
  const email = "archivist@terravault.io";

  return (
    <View className="flex-1 bg-[#0c0b09]">
      {/* TopAppBar — ARCHIVE + Account/Profile */}
      <View className="w-full bg-background border-b border-outline-variant px-4 h-16 flex-row items-center justify-between z-50">
        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityLabel="Menu"
            className="w-8 h-8 items-center justify-center active:opacity-60"
          >
            <Text className="text-on-surface-variant text-[20px] leading-none">☰</Text>
          </Pressable>
          <Text className="text-[20px] font-normal tracking-[0.2em] text-primary" style={{ fontFamily: "Fraunces" }}>
            ARCHIVE
          </Text>
        </View>
        <Text className="text-[14px] font-medium tracking-[0.08em] text-on-surface-variant uppercase">Account / Profile</Text>
      </View>

      <ScrollView
        className="flex-1 bg-[#0c0b09]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-[76rem] self-center px-4 pt-8 pb-28 flex-col gap-8">
          {/* Section 1: Avatar & Basic Info */}
          <View className="flex-col items-center text-center mt-4">
            <View className="w-24 h-24 rounded-full border border-hairline bg-plate items-center justify-center mb-4">
              <View className="w-20 h-20 rounded-full border border-hairline items-center justify-center">
                <Text className="text-[20px] font-normal tracking-[0.2em] text-primary" style={{ fontFamily: "Fraunces" }}>
                  OP
                </Text>
              </View>
            </View>
            <Text className="text-[24px] font-normal leading-[1.3] text-on-surface" style={{ fontFamily: "Fraunces" }}>
              Operator_42
            </Text>
            <Text className="text-[16px] leading-[1.6] text-on-surface-variant opacity-80 mt-1">archivist@terravault.io</Text>
            <View className="flex-row items-center gap-3 mt-4">
              <Text className="text-[12px] font-semibold tracking-[0.3em] text-on-surface-variant uppercase">
                JOINED MAR 2024
              </Text>
              <View className="bg-[#17150f] border border-hairline px-2 py-1 rounded-sm">
                <Text className="text-[12px] font-semibold tracking-[0.3em] text-primary uppercase leading-none">PRIMARY</Text>
              </View>
            </View>
          </View>

          <View className="h-px bg-hairline w-full my-2" />

          {/* Sections 2,3,4 — max-w-lg centered stack */}
          <View className="flex-col gap-6 w-full max-w-lg self-center">
            {/* Section 2: Personal Details — archive-plate p-6 */}
            <View className="relative bg-[#1a1813] border border-hairline p-6">
              <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-amber pointer-events-none" />
              <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-amber pointer-events-none" />
              <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-amber pointer-events-none" />
              <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-amber pointer-events-none" />

              <Text className="text-[12px] font-semibold tracking-[0.3em] text-on-surface-variant uppercase mb-6">
                PERSONAL DETAILS
              </Text>

              <View className="flex-col gap-6">
                <View className="flex-col gap-2">
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-on-surface-variant uppercase">NAME</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    placeholder="Full name"
                    placeholderTextColor="#4c4638"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className={`w-full bg-transparent py-2 text-[16px] leading-[1.6] text-primary ${nameFocused ? "border-amber" : "border-hairline"} border-0 border-b rounded-none`}
                    style={
                      {
                        borderBottomWidth: 1,
                        borderTopWidth: 0,
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                      } as never
                    }
                  />
                </View>

                <View className="flex-col gap-2">
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-on-surface-variant uppercase">EMAIL</Text>
                  <TextInput
                    value={email}
                    editable={false}
                    selectTextOnFocus={false}
                    className="w-full bg-transparent py-2 text-[16px] leading-[1.6] text-on-surface-variant opacity-70 border-0 border-b border-hairline rounded-none"
                    style={
                      {
                        borderBottomWidth: 1,
                        borderTopWidth: 0,
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                      } as never
                    }
                  />
                </View>

                <View className="mt-2 flex-row justify-end">
                  <Pressable className="bg-[#e8c877] px-6 py-2 active:opacity-90">
                    <Text className="text-[14px] font-medium tracking-[0.2em] text-[#0c0b09] text-center">SAVE</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Section 3: Storage — archive-plate p-6 */}
            <View className="relative bg-[#1a1813] border border-hairline p-6">
              <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-amber pointer-events-none" />
              <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-amber pointer-events-none" />
              <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-amber pointer-events-none" />
              <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-amber pointer-events-none" />

              <View className="flex-row justify-between items-start mb-6">
                <Text className="text-[12px] font-semibold tracking-[0.3em] text-on-surface-variant uppercase">STORAGE</Text>
                <Text className="text-[12px] font-semibold tracking-[0.3em] text-primary uppercase">GOOGLE DRIVE CONNECTED</Text>
              </View>

              <View className="flex-col gap-4 mb-6">
                <View className="flex-row justify-between items-end border-b border-hairline pb-2">
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-on-surface-variant uppercase opacity-70">
                    ACCOUNT
                  </Text>
                  <Text className="text-[16px] leading-[1.6] text-primary">archivist@terravault.io</Text>
                </View>
                <View className="flex-row justify-between items-end border-b border-hairline pb-2">
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-on-surface-variant uppercase opacity-70">
                    ARCHIVE FOLDER
                  </Text>
                  <Text className="text-[16px] leading-[1.6] text-primary">TerraVault_Archive</Text>
                </View>
              </View>

              <View className="mb-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-on-surface-variant uppercase">USAGE</Text>
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-primary uppercase">6.2 OF 15 GB (41%)</Text>
                </View>
                <View className="w-full h-[2px] bg-hairline relative overflow-hidden">
                  <View className="absolute top-0 left-0 h-full bg-amber" style={{ width: "41%" }} />
                </View>
              </View>

              <View className="mt-6 flex-row justify-start">
                <Pressable hitSlop={8} className="active:opacity-70">
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-[#d4a845] uppercase border-b border-[#d4a845] pb-[2px]">
                    MANAGE CONNECTION
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Section 4: Vault Summary — archive-plate p-6 */}
            <View className="relative bg-[#1a1813] border border-hairline p-6">
              <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-amber pointer-events-none" />
              <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-amber pointer-events-none" />
              <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-amber pointer-events-none" />
              <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-amber pointer-events-none" />

              <Text className="text-[12px] font-semibold tracking-[0.3em] text-on-surface-variant uppercase mb-6">
                VAULT SUMMARY
              </Text>

              <View className="flex-row justify-between items-center">
                <View className="flex-1 flex-col items-center">
                  <Text className="text-[32px] font-normal leading-none text-primary mb-1" style={{ fontFamily: "Fraunces" }}>
                    12
                  </Text>
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-on-surface-variant uppercase opacity-70">
                    PROPERTIES
                  </Text>
                </View>
                <View className="w-px h-12 bg-hairline mx-2" />
                <View className="flex-1 flex-col items-center">
                  <Text className="text-[32px] font-normal leading-none text-primary mb-1" style={{ fontFamily: "Fraunces" }}>
                    45
                  </Text>
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-on-surface-variant uppercase opacity-70">
                    DOCUMENTS
                  </Text>
                </View>
                <View className="w-px h-12 bg-hairline mx-2" />
                <View className="flex-1 flex-col items-center">
                  <Text className="text-[32px] font-normal leading-none text-primary mb-1" style={{ fontFamily: "Fraunces" }}>
                    28
                  </Text>
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-on-surface-variant uppercase opacity-70">VISITS</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Footer Info */}
          <View className="items-center mt-2 mb-4">
            <Text className="text-[12px] font-semibold tracking-[0.3em] text-on-surface-variant uppercase opacity-60 text-center leading-[1.6]">
              ZERO-TRUST SECURITY PROTOCOL ACTIVE.{"\n"}LOCAL ENCRYPTION KEYS ONLY.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* BottomNav — 4 tabs, active Profile FILL 1 */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#100e09] border-t border-outline-variant h-20 flex-row justify-around items-center px-2 z-50">
        <Pressable
          onPress={() => router.push("/(app)/m06-dashboard" as never)}
          className="flex-1 flex-col items-center justify-center h-full gap-1 active:opacity-60"
        >
          <Text className="text-on-surface-variant text-[20px] leading-none">⬚</Text>
          <Text className="text-[14px] font-medium leading-none text-on-surface-variant">Vault</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(app)/m07-all-properties" as never)}
          className="flex-1 flex-col items-center justify-center h-full gap-1 active:opacity-60"
        >
          <Text className="text-on-surface-variant text-[20px] leading-none">⌕</Text>
          <Text className="text-[14px] font-medium leading-none text-on-surface-variant">Search</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(app)/m06-dashboard" as never)}
          className="flex-1 flex-col items-center justify-center h-full gap-1 active:opacity-60"
        >
          <Text className="text-on-surface-variant text-[20px] leading-none">▭</Text>
          <Text className="text-[14px] font-medium leading-none text-on-surface-variant">Logs</Text>
        </Pressable>

        <Pressable className="flex-1 flex-col items-center justify-center h-full gap-1 border-t-2 border-primary pt-2">
          <Text className="text-primary text-[20px] leading-none">●</Text>
          <Text className="text-[14px] font-medium leading-none text-primary">Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}
