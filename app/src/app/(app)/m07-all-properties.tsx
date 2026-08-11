import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

// Hardcoded 3 cards matching stitch_screens/m07_all_properties.html 1:1.
// Source of truth for this screen is the HTML mock; @/lib/mock.json is alternate.
// Cards: Site Alpha RESIDENTIAL PRIMARY 450sqm ETH 12.5, Nexus Point COMMERCIAL SECONDARY, Verdant Expanse LAND SECONDARY
type Card = {
  id: string;
  category: string;
  title: string;
  tier: "PRIMARY" | "SECONDARY";
  area: string;
  value: string;
  coords: string;
  acquired: string;
  docs: number;
  visits: number;
};

const CARDS: Card[] = [
  {
    id: "site-alpha",
    category: "RESIDENTIAL",
    title: "Site Alpha",
    tier: "PRIMARY",
    area: "450 sqm",
    value: "ETH 12.5",
    coords: "27\u00B019'N 78\u00B000'E",
    acquired: "2023.10.14",
    docs: 5,
    visits: 3,
  },
  {
    id: "nexus-point",
    category: "COMMERCIAL",
    title: "Nexus Point",
    tier: "SECONDARY",
    area: "1,200 sqm",
    value: "ETH 45.0",
    coords: "40\u00B042'N 74\u00B000'W",
    acquired: "2022.04.22",
    docs: 12,
    visits: 8,
  },
  {
    id: "verdant-expanse",
    category: "LAND",
    title: "Verdant Expanse",
    tier: "SECONDARY",
    area: "15,000 sqm",
    value: "ETH 8.2",
    coords: "14\u00B035'N 121\u00B000'E",
    acquired: "2021.11.05",
    docs: 2,
    visits: 0,
  },
];

const FILTERS = ["All Types", "Residential", "Commercial", "Land"] as const;

function tierChipPresent(tier: Card["tier"]): boolean {
  return tier === "PRIMARY";
}

export default function M07AllPropertiesScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All Types");
  const [focused, setFocused] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const f = filter.toLowerCase();
    return CARDS.filter((c) => {
      const matchesType = f === "all types" || c.category.toLowerCase() === f;
      if (!matchesType) return false;
      if (!q) return true;
      const hay = `${c.title} ${c.category} ${c.coords} ${c.id}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, filter]);

  const handleRegister = () => {
    // transactional — open add-property modal if present, else no-op
    try {
      router.push("/(modals)/m17-add-property" as never);
    } catch {
      // noop
    }
  };

  const handleOpen = (_id: string) => {
    // placeholder — wire to detail when available
  };

  const handleReset = () => {
    setQuery("");
    setFilter("All Types");
    setFilterOpen(false);
  };

  const searchBorder = focused === "search" ? "border-[#d4a845]" : "border-[#241f17]";
  const filterBorder = focused === "filter" || filterOpen ? "border-[#d4a845]" : "border-[#241f17]";

  return (
    <View className="flex-1 bg-[#0c0b09]">
      {/* TopAppBar bg-background border-b (menu TERRAVAULT avatar img) */}
      <View className="bg-[#16130e] border-b border-[#4c4638] w-full z-50">
        <View className="flex-row justify-between items-center px-6 py-4 w-full max-w-[76rem] self-center">
          <Pressable
            accessibilityLabel="Menu"
            hitSlop={8}
            onPress={() => router.push("/" as never)}
            className="w-8 h-8 items-center justify-center active:opacity-60"
          >
            <Text className="text-[#cfc5b3] text-[22px] leading-none">≡</Text>
          </Pressable>

          <Text className="text-[22px] font-normal tracking-[-0.04em] text-[#eec05a] text-center" style={{ fontFamily: "Fraunces" }}>
            TERRAVAULT
          </Text>

          <Pressable
            accessibilityLabel="User profile"
            hitSlop={8}
            className="w-8 h-8 rounded-full overflow-hidden border border-[#4c4638] bg-[#221f1a] items-center justify-center active:opacity-70"
          >
            {/* avatar img placeholder — HTML uses lh3.googleusercontent macro photograph; use initials in native */}
            <View className="w-full h-full bg-[#2d2a24] items-center justify-center">
              <Text className="text-[#e9e1d8] text-[10px] font-semibold">AV</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-10 pb-28 w-full max-w-[76rem] self-center"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Page header Registry eyebrow + All properties headline + (3) count + REGISTER PROPERTY btn-primary gold */}
        <View className="w-full mb-8 flex-col gap-4">
          <View className="flex-col gap-2">
            <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#98907f] leading-none">Registry</Text>
            <View className="flex-row items-baseline gap-3 flex-wrap">
              <Text className="text-[36px] font-normal leading-[1.15] text-[#eec05a]" style={{ fontFamily: "Fraunces" }}>
                All properties
              </Text>
              <Text className="text-[20px] font-normal leading-none text-[#4c4638]" style={{ fontFamily: "Fraunces" }}>
                ({filtered.length})
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleRegister}
            className="bg-[#e8c877] py-3 px-6 rounded-sm flex-row items-center justify-center gap-2 self-start active:opacity-90"
          >
            <Text className="text-[16px] leading-none text-[#0c0b09]">＋</Text>
            <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#0c0b09]">REGISTER PROPERTY</Text>
          </Pressable>
        </View>

        {/* Controls row: search input-archival w-2/3 + All Types select w-1/3 with amber focus */}
        <View className="w-full mb-8 flex-col gap-4 md:flex-row">
          {/* search w-2/3 */}
          <View className="w-full md:w-2/3 relative">
            <View className="absolute left-0 top-0 bottom-0 justify-center pointer-events-none z-10">
              <Text className="text-[#4c4638] text-[16px] leading-none">⌕</Text>
            </View>
            <TextInput
              value={query}
              onChangeText={setQuery}
              onFocus={() => setFocused("search")}
              onBlur={() => setFocused(null)}
              placeholder="Search coordinates, names, or IDs..."
              placeholderTextColor="#4c4638"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              className={`w-full bg-transparent border-0 border-b rounded-none py-3 pl-8 pr-2 text-[16px] leading-[1.6] text-[#e9e1d8] ${searchBorder}`}
              style={{ borderBottomWidth: 1, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 } as any}
            />
          </View>

          {/* select w-1/3 */}
          <View className="w-full md:w-1/3 relative">
            <Pressable
              onPress={() => setFilterOpen((v) => !v)}
              onPressIn={() => setFocused("filter")}
              className={`w-full flex-row items-center justify-between bg-transparent border-0 border-b rounded-none py-3 pr-2 pl-0 ${filterBorder} active:opacity-80`}
              style={{ borderBottomWidth: 1, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 } as any}
            >
              <Text className="text-[16px] leading-[1.6] text-[#e9e1d8]">{filter}</Text>
              <Text className="text-[#4c4638] text-[16px] leading-none ml-2">{filterOpen ? "▴" : "▾"}</Text>
            </Pressable>

            {filterOpen ? (
              <View className="absolute top-[48px] left-0 right-0 bg-[#1a1813] border border-[#241f17] rounded-sm overflow-hidden z-20 shadow-2xl">
                {FILTERS.map((opt) => {
                  const active = opt === filter;
                  return (
                    <Pressable
                      key={opt}
                      onPress={() => {
                        setFilter(opt);
                        setFilterOpen(false);
                        setFocused(null);
                      }}
                      className={`px-4 py-3 flex-row items-center justify-between active:opacity-70 ${active ? "bg-[#241f17]" : "bg-[#1a1813]"}`}
                    >
                      <Text className={`text-[14px] ${active ? "text-[#eec05a] font-semibold" : "text-[#e9e1d8]"}`}>{opt}</Text>
                      {active ? <Text className="text-[#d4a845] text-[12px]">✓</Text> : null}
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </View>
        </View>

        {/* Property Grid 3 archive-plate p-6 plate-container with 4 corner-tick amber #d4a845 */}
        <View className="w-full flex-col gap-6 mb-8">
          {filtered.map((card) => {
            const primary = tierChipPresent(card.tier);
            return (
              <View
                key={card.id}
                className="bg-[#1a1813] border border-[#241f17] p-6 relative w-full flex-col"
              >
                {/* 4 corner-tick amber #d4a845 8px L */}
                <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-[#d4a845] pointer-events-none" />
                <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-[#d4a845] pointer-events-none" />
                <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-[#d4a845] pointer-events-none" />
                <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-[#d4a845] pointer-events-none" />

                {/* header with category eyebrow + title + PRIMARY/SECONDARY chip */}
                <View className="flex-row justify-between items-start mb-6 gap-3">
                  <View className="flex-1">
                    <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#98907f] mb-1">{card.category}</Text>
                    <Text className="text-[24px] font-normal leading-[1.3] text-[#e9e1d8]" style={{ fontFamily: "Fraunces" }}>
                      {card.title}
                    </Text>
                  </View>

                  <View
                    className={`bg-[#17150f] border border-[#241f17] rounded-sm px-2 py-1 flex-row items-center gap-1 shrink-0 ${primary ? "opacity-100" : "opacity-50"}`}
                  >
                    <View className={`w-2 h-2 rounded-full ${primary ? "bg-[#d4a845]" : "bg-[#4c4638]"}`} />
                    <Text className="text-[10px] font-semibold uppercase tracking-widest text-[#98907f] leading-none">{card.tier}</Text>
                  </View>
                </View>

                {/* 2-col meta grid (AREA/VALUE/COORD/ACQUIRED) */}
                <View className="flex-row flex-wrap gap-y-6 mb-8">
                  <View className="w-1/2 pr-4">
                    <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#4c4638] mb-1">AREA</Text>
                    <Text className="text-[16px] leading-[1.6] text-[#e9e1d8]">{card.area}</Text>
                  </View>
                  <View className="w-1/2 pl-2">
                    <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#4c4638] mb-1">MARKET VALUE</Text>
                    <Text className="text-[16px] leading-[1.6] text-[#eec05a]">{card.value}</Text>
                  </View>
                  <View className="w-1/2 pr-4">
                    <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#4c4638] mb-1">COORDINATES</Text>
                    <Text className="text-[14px] leading-[1.6] text-[#e9e1d8]" style={{ fontFamily: "monospace" as any }}>
                      {card.coords}
                    </Text>
                  </View>
                  <View className="w-1/2 pl-2">
                    <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#4c4638] mb-1">ACQUIRED</Text>
                    <Text className="text-[14px] leading-[1.6] text-[#e9e1d8]" style={{ fontFamily: "monospace" as any }}>
                      {card.acquired}
                    </Text>
                  </View>
                </View>

                {/* footer OPEN gold-underline */}
                <View className="mt-auto pt-4 border-t border-[#241f17] flex-row justify-between items-center">
                  <Text className="text-[14px] font-medium leading-none text-[#4c4638]">
                    {card.docs} documents · {card.visits} visits
                  </Text>
                  <Pressable onPress={() => handleOpen(card.id)} hitSlop={8} className="flex-row items-center gap-1 active:opacity-60">
                    <View className="border-b border-[#d4a845] pb-[1px]">
                      <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#eec05a] leading-none">OPEN</Text>
                    </View>
                    <Text className="text-[#eec05a] text-[14px] leading-none">→</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        {/* empty dashed state — shown when filter yields 0; HTML shows it always after grid as ledger tail. Replicate: show when no matches, else show muted ledger tail */}
        {filtered.length === 0 ? (
          <View className="w-full py-10 flex-col items-center justify-center border border-dashed border-[#4c4638] rounded-sm mt-2 opacity-60">
            <Text className="text-[#4c4638] text-[28px] leading-none mb-4">◇</Text>
            <Text className="text-[16px] leading-[1.6] text-[#98907f] text-center mb-6">No additional properties found in ledger.</Text>
            <Pressable
              onPress={handleReset}
              className="border border-[#241f17] py-2 px-6 active:opacity-70 active:bg-[#1a1813]"
            >
              <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#eec05a] text-center">Reset filters</Text>
            </Pressable>
          </View>
        ) : (
          <View className="w-full py-10 flex-col items-center justify-center border border-dashed border-[#4c4638] rounded-sm mt-2 opacity-60">
            <Text className="text-[#4c4638] text-[28px] leading-none mb-4">◇</Text>
            <Text className="text-[16px] leading-[1.6] text-[#98907f] text-center mb-6">No additional properties found in ledger.</Text>
            <Pressable
              onPress={handleReset}
              className="border border-[#241f17] py-2 px-6 active:opacity-70 active:bg-[#1a1813]"
            >
              <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#eec05a] text-center">Reset filters</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* BottomNav 4 tabs — Scan / Vault(active) / Secure / Log */}
      <View className="bg-[#221f1a] border-t border-[#4c4638] w-full absolute bottom-0 left-0 right-0 z-40">
        <View className="flex-row justify-around items-center h-20 px-2">
          <Pressable onPress={() => router.push("/" as never)} className="flex-1 flex-col items-center justify-center h-full active:opacity-60 gap-1">
            <Text className="text-[#cfc5b3] text-[18px] leading-none">◧</Text>
            <Text className="text-[12px] font-medium leading-none text-[#cfc5b3]">Scan</Text>
          </Pressable>

          <Pressable className="mx-2 bg-[#8b6700] rounded-full px-6 py-2 flex-col items-center justify-center active:opacity-80">
            <Text className="text-[#ffe5a8] text-[18px] leading-none">🔓</Text>
            <Text className="text-[12px] font-medium leading-none text-[#ffe5a8] mt-1">Vault</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/" as never)} className="flex-1 flex-col items-center justify-center h-full active:opacity-60 gap-1">
            <Text className="text-[#cfc5b3] text-[18px] leading-none">🛡</Text>
            <Text className="text-[12px] font-medium leading-none text-[#cfc5b3]">Secure</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/" as never)} className="flex-1 flex-col items-center justify-center h-full active:opacity-60 gap-1">
            <Text className="text-[#cfc5b3] text-[18px] leading-none">📜</Text>
            <Text className="text-[12px] font-medium leading-none text-[#cfc5b3]">Log</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
