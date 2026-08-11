import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { BottomNav } from '@/components/ui/bottom-nav';
import { Drawer } from '@/components/ui/drawer';
import { CornerTicks } from '@/components/ui/plate';

export default function M06DashboardScreen() {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleRegister = () => {
    router.push('/(app)/m06-dashboard' as never);
  };

  const handleConnectDrive = () => {
    router.push('/(app)/m06-dashboard' as never);
  };

  const handleOpenRecord = () => {
    router.push('/(app)/m07-all-properties' as never);
  };

  return (
    <View className="flex-1 bg-background">
      {/* TopAppBar — menu | TERRAVAULT | avatar */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-background border-b border-hairline">
        <Pressable onPress={() => setDrawerVisible(true)} hitSlop={8} className="p-1 active:opacity-70">
          <Text className="text-secondary text-[22px] leading-none">☰</Text>
        </Pressable>
        <Text className="text-[20px] font-semibold tracking-tighter text-secondary">TERRAVAULT</Text>
        <View className="w-8 h-8 rounded-full overflow-hidden border border-hairline bg-surface-container items-center justify-center">
          <Text className="text-[10px] font-semibold text-secondary">AV</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-8 pb-6 gap-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Page Header */}
        <View className="gap-2">
          <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-secondary">
            ARCHIVE DASHBOARD
          </Text>
          <Text className="text-[36px] font-normal leading-[1.15] text-on-surface">
            Welcome back, Architect.
          </Text>
          <Text className="text-[16px] leading-[1.6] text-on-surface-variant mt-2">
            Your land records are secured and verified within the dark vault.
          </Text>
        </View>

        {/* Primary Actions */}
        <View className="gap-3">
          <Pressable
            onPress={handleRegister}
            className="w-full bg-primary-container py-4 px-6 rounded-sm items-center justify-center active:opacity-90"
          >
            <Text className="text-[14px] font-medium uppercase tracking-widest text-on-primary text-center">
              + REGISTER PROPERTY
            </Text>
          </Pressable>
          <Pressable
            onPress={handleConnectDrive}
            className="w-full border border-hairline py-4 px-6 rounded-sm items-center justify-center bg-transparent active:opacity-80"
          >
            <Text className="text-[14px] font-medium uppercase tracking-widest text-primary-container text-center">
              CONNECT DRIVE
            </Text>
          </Pressable>
        </View>

        {/* Stat Ledger — 2x2 plate-container */}
        <View className="relative bg-surface border border-hairline rounded-sm">
          <CornerTicks />
          {/* Row 1 */}
          <View className="flex-row border-b border-hairline">
            <View className="flex-1 p-4 gap-1 border-r border-hairline">
              <Text className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                PROPERTIES COUNT
              </Text>
              <Text className="text-[24px] font-normal leading-tight text-on-surface">03</Text>
            </View>
            <View className="flex-1 p-4 gap-1">
              <Text className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                TOTAL AREA
              </Text>
              <Text className="text-[24px] font-normal leading-tight text-on-surface">1,240 sqm</Text>
            </View>
          </View>
          {/* Row 2 */}
          <View className="flex-row">
            <View className="flex-1 p-4 gap-1 border-r border-hairline">
              <Text className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                EST. MARKET VALUE
              </Text>
              <Text className="text-[24px] font-normal leading-tight text-on-surface">ETH 45.2</Text>
            </View>
            <View className="flex-1 p-4 gap-1">
              <Text className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                DOCUMENTS
              </Text>
              <Text className="text-[24px] font-normal leading-tight text-on-surface">12 / 4 Visits</Text>
            </View>
          </View>
        </View>

        {/* Recent Records */}
        <View className="gap-4">
          <Text className="text-[24px] font-normal text-on-surface border-b border-hairline pb-2">
            Recent Records
          </Text>

          {/* Card 1 — Site Alpha */}
          <Pressable onPress={handleOpenRecord} className="relative bg-surface border border-hairline p-5 gap-4 rounded-sm active:opacity-90">
            <CornerTicks />
            <View className="flex-row justify-between items-start">
              <View className="gap-1">
                <Text className="text-[12px] font-semibold uppercase tracking-[0.2em] text-secondary">
                  RESIDENTIAL
                </Text>
                <Text className="text-[28px] font-light leading-tight text-on-surface">Site Alpha</Text>
              </View>
              <View className="bg-surface-dim border border-hairline px-2 py-1 rounded-sm">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                  PRIMARY
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap border-t border-hairline pt-4 mt-2">
              <View className="w-1/2 gap-1 py-2">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-outline">AREA</Text>
                <Text className="text-[14px] font-medium text-on-surface">450 sqm</Text>
              </View>
              <View className="w-1/2 gap-1 py-2">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-outline">MARKET VALUE</Text>
                <Text className="text-[14px] font-medium text-on-surface">ETH 12.5</Text>
              </View>
              <View className="w-1/2 gap-1 py-2">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-outline">COORDINATES</Text>
                <Text className="text-[14px] font-medium text-on-surface">27°19&apos;N 78°00&apos;E</Text>
              </View>
              <View className="w-1/2 gap-1 py-2">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-outline">ACQUIRED</Text>
                <Text className="text-[14px] font-medium text-on-surface">2023.10.14</Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center border-t border-hairline pt-4 mt-2">
              <Text className="text-[12px] text-on-surface-variant">5 documents · 3 visits</Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-[12px] font-semibold uppercase tracking-widest text-secondary">OPEN</Text>
                <Text className="text-[14px] text-secondary">→</Text>
              </View>
            </View>
          </Pressable>

          {/* Card 2 — Sector 7G */}
          <Pressable onPress={handleOpenRecord} className="relative bg-surface border border-hairline p-5 gap-4 rounded-sm active:opacity-90">
            <CornerTicks />
            <View className="flex-row justify-between items-start">
              <View className="gap-1">
                <Text className="text-[12px] font-semibold uppercase tracking-[0.2em] text-secondary">
                  COMMERCIAL
                </Text>
                <Text className="text-[28px] font-light leading-tight text-on-surface">Sector 7G</Text>
              </View>
              <View className="bg-surface-dim border border-hairline px-2 py-1 rounded-sm">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                  HELD
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap border-t border-hairline pt-4 mt-2">
              <View className="w-1/2 gap-1 py-2">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-outline">AREA</Text>
                <Text className="text-[14px] font-medium text-on-surface">790 sqm</Text>
              </View>
              <View className="w-1/2 gap-1 py-2">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-outline">MARKET VALUE</Text>
                <Text className="text-[14px] font-medium text-on-surface">ETH 32.7</Text>
              </View>
              <View className="w-1/2 gap-1 py-2">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-outline">COORDINATES</Text>
                <Text className="text-[14px] font-medium text-on-surface">35°41&apos;N 139°41&apos;E</Text>
              </View>
              <View className="w-1/2 gap-1 py-2">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-outline">ACQUIRED</Text>
                <Text className="text-[14px] font-medium text-on-surface">2022.04.22</Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center border-t border-hairline pt-4 mt-2">
              <Text className="text-[12px] text-on-surface-variant">7 documents · 1 visit</Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-[12px] font-semibold uppercase tracking-widest text-secondary">OPEN</Text>
                <Text className="text-[14px] text-secondary">→</Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Empty State — dashed */}
        <View className="border border-dashed border-hairline p-8 items-center justify-center gap-4 bg-surface-dim rounded-sm">
          <Text className="text-outline text-[32px] leading-none">◫</Text>
          <Text className="text-[16px] leading-[1.6] text-on-surface-variant text-center">
            No properties registered yet.
          </Text>
          <Pressable
            onPress={handleRegister}
            className="mt-2 border border-hairline px-6 py-3 rounded-sm active:opacity-80"
          >
            <Text className="text-[12px] font-semibold uppercase tracking-widest text-secondary text-center">
              + REGISTER PROPERTY
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* BottomNav — 4 tabs (Scan, Vault filled active, Secure, Log) */}
      <BottomNav />

      {/* Drawer overlay */}
      <Drawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </View>
  );
}
