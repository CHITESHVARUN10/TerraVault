import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function M08PropertyDetailScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#0c0b09]">
      {/* Top App Bar — sticky back bar */}
      <View className="w-full bg-background border-b border-outline-variant px-4 py-4 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="flex-row items-center gap-1 active:opacity-70"
          accessibilityLabel="Back to Vaults"
        >
          <Text className="text-on-surface-variant text-[20px] leading-none">←</Text>
          <Text className="text-[14px] font-medium leading-none text-on-surface-variant">Vaults</Text>
        </Pressable>
        <Text className="text-[20px] font-normal tracking-tighter text-secondary">TERRAVAULT</Text>
        <View className="w-8" />
      </View>

      <ScrollView
        className="flex-1 bg-[#0c0b09]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="w-full max-w-[76rem] self-center px-5 py-8 flex-col gap-8">
          {/* Breadcrumb & Header Area */}
          <View className="flex-col gap-4">
            <View className="flex-row items-center">
              <Text className="text-[12px] font-semibold tracking-[0.3em] text-on-surface-variant uppercase">
                Properties
              </Text>
              <Text className="mx-2 text-[12px] font-semibold tracking-[0.3em] text-outline-variant">/</Text>
              <Text className="text-[12px] font-semibold tracking-[0.3em] text-secondary uppercase">Site Alpha</Text>
            </View>

            <View className="flex-col gap-2 mt-2">
              <View className="flex-row items-center gap-2 mb-1">
                <View className="bg-[#17150f] border border-[#241f17] rounded-sm px-2 py-1">
                  <Text className="text-[12px] font-semibold tracking-[0.2em] text-secondary uppercase leading-none">
                    Residential
                  </Text>
                </View>
                <View className="bg-[#17150f] border border-[#241f17] rounded-sm px-2 py-1">
                  <Text className="text-[12px] font-semibold tracking-[0.2em] text-on-surface uppercase leading-none">
                    Primary
                  </Text>
                </View>
              </View>
              <Text className="text-[36px] font-normal leading-[1.15] text-secondary">Site Alpha</Text>
            </View>

            {/* Action Cluster */}
            <View className="flex-row flex-wrap items-center gap-3 mt-4">
              <Pressable className="bg-primary-container px-4 py-2.5 flex-row items-center gap-2 rounded-sm active:opacity-90">
                <Text className="text-on-primary text-[18px] leading-none">▭</Text>
                <Text className="text-[14px] font-medium leading-none text-on-primary">+ Document</Text>
              </Pressable>
              <Pressable className="bg-transparent border border-[#2e2a20] px-4 py-2.5 flex-row items-center gap-2 rounded-sm active:bg-surface-container-low">
                <Text className="text-primary-container text-[18px] leading-none">◎</Text>
                <Text className="text-[14px] font-medium leading-none text-primary-container">+ Visit</Text>
              </Pressable>
              <Pressable className="px-4 py-2.5 flex-row items-center gap-2 ml-auto active:opacity-70">
                <Text className="text-on-surface-variant text-[18px] leading-none">⌫</Text>
                <Text className="text-[14px] font-medium leading-none text-on-surface-variant">Delete</Text>
              </Pressable>
            </View>
          </View>

          {/* Map Preview Plate — h-64 bg-surveyor 20px grid */}
          <View className="relative w-full h-64 bg-surface-container-low border border-[#241f17] overflow-hidden items-center justify-center">
            {/* Amber Corner Ticks */}
            <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-amber pointer-events-none z-20" />
            <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-amber pointer-events-none z-20" />
            <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-amber pointer-events-none z-20" />
            <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-amber pointer-events-none z-20" />

            {/* Survey grid background — #16130e base + 20px grid lines */}
            <View className="absolute inset-0 bg-surface-dim opacity-50" />
            {/* 20px grid — vertical lines */}
            <View className="absolute inset-0 flex-row opacity-100 pointer-events-none" aria-hidden>
              <View className="flex-1 border-r border-[#241f17] opacity-40" />
              <View className="flex-1 border-r border-[#241f17] opacity-40" />
              <View className="flex-1 border-r border-[#241f17] opacity-40" />
              <View className="flex-1 border-r border-[#241f17] opacity-40" />
              <View className="flex-1 border-r border-[#241f17] opacity-40" />
              <View className="flex-1 border-r border-[#241f17] opacity-40" />
              <View className="flex-1 border-r border-[#241f17] opacity-40" />
              <View className="flex-1 border-r border-[#241f17] opacity-40" />
              <View className="flex-1 border-r border-[#241f17] opacity-40" />
              <View className="flex-1 border-r border-[#241f17] opacity-40" />
              <View className="flex-1 border-r border-[#241f17] opacity-40" />
              <View className="flex-1 border-r border-[#241f17] opacity-40" />
              <View className="flex-1 border-r border-[#241f17] opacity-40" />
              <View className="flex-1 border-r border-[#241f17] opacity-40" />
              <View className="flex-1 opacity-0" />
            </View>
            {/* 20px grid — horizontal lines */}
            <View className="absolute inset-0 flex-col opacity-100 pointer-events-none" aria-hidden>
              <View className="flex-1 border-b border-[#241f17] opacity-40" />
              <View className="flex-1 border-b border-[#241f17] opacity-40" />
              <View className="flex-1 border-b border-[#241f17] opacity-40" />
              <View className="flex-1 border-b border-[#241f17] opacity-40" />
              <View className="flex-1 border-b border-[#241f17] opacity-40" />
              <View className="flex-1 border-b border-[#241f17] opacity-40" />
              <View className="flex-1 border-b border-[#241f17] opacity-40" />
              <View className="flex-1 border-b border-[#241f17] opacity-40" />
              <View className="flex-1 border-b border-[#241f17] opacity-40" />
              <View className="flex-1 border-b border-[#241f17] opacity-40" />
              <View className="flex-1 border-b border-[#241f17] opacity-40" />
              <View className="flex-1 opacity-0" />
            </View>

            {/* Map Overlay UI — centered */}
            <View className="absolute inset-0 items-center justify-center z-10 pointer-events-none">
              {/* Target Pin with ping */}
              <View className="relative items-center justify-center mb-2">
                <View className="absolute w-12 h-12 border border-secondary rounded-full opacity-20" />
                <Text className="text-secondary text-[32px] leading-none">📍</Text>
              </View>
              {/* Coordinates Plate */}
              <View className="bg-background border border-[#241f17] px-3 py-1.5 flex-row items-center gap-2">
                <Text className="text-on-surface-variant text-[16px] leading-none">⌖</Text>
                <Text className="text-[12px] font-semibold tracking-[0.25em] text-secondary leading-none">
                  27.12° N / 78.00° E
                </Text>
              </View>
            </View>

            {/* Open in maps */}
            <Pressable className="absolute bottom-4 right-4 bg-background border border-[#241f17] px-3 py-1.5 flex-row items-center gap-1 z-20 active:opacity-80">
              <Text className="text-[12px] font-semibold tracking-[0.2em] text-secondary leading-none">Open in maps</Text>
              <Text className="text-secondary text-[14px] leading-none">↗</Text>
            </Pressable>
          </View>

          {/* Ledger Split — stacks on mobile, 2-col mental model preserved via flex-col */}
          <View className="flex-col gap-8">
            {/* Left Column: Details & Documents */}
            <View className="flex-col gap-8">
              {/* Metadata Plate — 6-row ledger */}
              <View className="relative bg-surface-container-low border border-[#241f17] p-6">
                <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-amber pointer-events-none z-10" />
                <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-amber pointer-events-none z-10" />
                <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-amber pointer-events-none z-10" />
                <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-amber pointer-events-none z-10" />

                <View className="flex-row items-center gap-2 mb-6">
                  <Text className="text-secondary text-[20px] leading-none">ⓘ</Text>
                  <Text className="text-[24px] leading-[1.3] font-normal text-secondary">Registry Details</Text>
                </View>

                <View className="flex-col">
                  <View className="flex-row justify-between items-center py-3 border-b border-[#241f17]">
                    <Text className="text-[12px] font-semibold tracking-[0.2em] text-on-surface-variant uppercase">
                      Category
                    </Text>
                    <Text className="text-[16px] leading-[1.6] text-on-surface">Residential</Text>
                  </View>
                  <View className="flex-row justify-between items-center py-3 border-b border-[#241f17]">
                    <Text className="text-[12px] font-semibold tracking-[0.2em] text-on-surface-variant uppercase">
                      Ownership
                    </Text>
                    <Text className="text-[16px] leading-[1.6] text-on-surface">Primary</Text>
                  </View>
                  <View className="flex-row justify-between items-center py-3 border-b border-[#241f17]">
                    <Text className="text-[12px] font-semibold tracking-[0.2em] text-on-surface-variant uppercase">Area</Text>
                    <Text className="text-[16px] leading-[1.6] text-on-surface">1,240 sq ft</Text>
                  </View>
                  <View className="flex-row justify-between items-center py-3 border-b border-[#241f17]">
                    <Text className="text-[12px] font-semibold tracking-[0.2em] text-on-surface-variant uppercase">
                      Purchase Price
                    </Text>
                    <Text className="text-[16px] leading-[1.6] text-on-surface">$450,000</Text>
                  </View>
                  <View className="flex-row justify-between items-center py-3 border-b border-[#241f17]">
                    <Text className="text-[12px] font-semibold tracking-[0.2em] text-on-surface-variant uppercase">
                      Est. Market Value
                    </Text>
                    <Text className="text-[16px] leading-[1.6] text-secondary">$512,000</Text>
                  </View>
                  <View className="flex-row justify-between items-center py-3">
                    <Text className="text-[12px] font-semibold tracking-[0.2em] text-on-surface-variant uppercase">
                      Coordinates
                    </Text>
                    <Text className="text-[16px] leading-[1.6] text-on-surface">27.12° N / 78.00° E</Text>
                  </View>
                </View>
              </View>

              {/* Archived Documents — 2 files */}
              <View className="relative bg-surface-container-low border border-[#241f17] p-6">
                <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-amber pointer-events-none z-10" />
                <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-amber pointer-events-none z-10" />
                <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-amber pointer-events-none z-10" />
                <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-amber pointer-events-none z-10" />

                <View className="flex-row items-center justify-between mb-6">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-secondary text-[20px] leading-none">📁</Text>
                    <Text className="text-[24px] leading-[1.3] font-normal text-secondary">Archived Documents</Text>
                  </View>
                  <Text className="text-[12px] font-semibold tracking-[0.2em] text-on-surface-variant">2 FILES</Text>
                </View>

                <View className="flex-col gap-4">
                  {/* Doc 1 — Ownership Deed PDF 2.4MB */}
                  <View className="flex-row items-center justify-between p-3 bg-background border border-[#241f17]">
                    <View className="flex-row items-center gap-3 flex-1">
                      <Text className="text-outline-variant text-[24px] leading-none">▭</Text>
                      <View className="flex-col flex-1">
                        <Text className="text-[16px] leading-[1.6] text-on-surface">Ownership Deed</Text>
                        <Text className="text-[12px] font-semibold tracking-[0.15em] text-on-surface-variant mt-1 uppercase">
                          PDF • 2.4 MB • Oct 12, 2023
                        </Text>
                      </View>
                    </View>
                    <Pressable hitSlop={8} className="ml-3 active:opacity-70">
                      <Text className="text-[14px] font-medium leading-none text-[#d4a845]">Remove</Text>
                    </Pressable>
                  </View>

                  {/* Doc 2 — Survey Contour Map PNG 8.1MB */}
                  <View className="flex-row items-center justify-between p-3 bg-background border border-[#241f17]">
                    <View className="flex-row items-center gap-3 flex-1">
                      <Text className="text-outline-variant text-[24px] leading-none">🗺</Text>
                      <View className="flex-col flex-1">
                        <Text className="text-[16px] leading-[1.6] text-on-surface">Survey Contour Map</Text>
                        <Text className="text-[12px] font-semibold tracking-[0.15em] text-on-surface-variant mt-1 uppercase">
                          PNG • 8.1 MB • Sep 04, 2023
                        </Text>
                      </View>
                    </View>
                    <Pressable hitSlop={8} className="ml-3 active:opacity-70">
                      <Text className="text-[14px] font-medium leading-none text-[#d4a845]">Remove</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>

            {/* Right Column: Visits Journal — vertical timeline amber/gray dots */}
            <View>
              <View className="relative bg-surface-container-low border border-[#241f17] p-6">
                <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-amber pointer-events-none z-10" />
                <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-amber pointer-events-none z-10" />
                <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-amber pointer-events-none z-10" />
                <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-amber pointer-events-none z-10" />

                <View className="flex-row items-center gap-2 mb-6">
                  <Text className="text-secondary text-[20px] leading-none">◷</Text>
                  <Text className="text-[24px] leading-[1.3] font-normal text-secondary">Visits Journal</Text>
                </View>

                {/* Vertical Timeline */}
                <View className="relative border-l border-outline-variant ml-3 pl-6 flex-col gap-8">
                  {/* NOV 15 2024 — amber */}
                  <View className="relative">
                    <View className="absolute -left-[29px] top-[4px] w-2.5 h-2.5 rounded-full bg-[#d4a845] border-[4px] border-surface-container-low" />
                    <View className="flex-col">
                      <Text className="text-[12px] font-semibold tracking-[0.2em] text-secondary mb-1 uppercase">
                        NOV 15, 2024
                      </Text>
                      <Text className="text-[16px] leading-[1.6] text-on-surface">
                        Annual inspection and structural survey completed. No anomalies detected.
                      </Text>
                    </View>
                  </View>

                  {/* OCT 12 2023 — gray */}
                  <View className="relative">
                    <View className="absolute -left-[29px] top-[4px] w-2.5 h-2.5 rounded-full bg-outline-variant border-[4px] border-surface-container-low" />
                    <View className="flex-col">
                      <Text className="text-[12px] font-semibold tracking-[0.2em] text-on-surface-variant mb-1 uppercase">
                        OCT 12, 2023
                      </Text>
                      <Text className="text-[16px] leading-[1.6] text-on-surface-variant">
                        Initial acquisition and deed transfer recorded in ledger.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
