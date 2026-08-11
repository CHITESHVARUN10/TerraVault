import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

const CATEGORY_OPTIONS = [
  "Agricultural Land",
  "Residential Plot",
  "Commercial Property",
  "Open Land",
  "Farm",
  "Industrial Land",
  "Other",
];

const OWNERSHIP_OPTIONS = ["Purchased", "Inherited", "Gifted", "Trust", "Court Transfer"];

const AREA_UNITS = ["Acres", "Hectares", "Sq Ft", "Sq M", "Guntha", "Bigha"];

export default function M17AddPropertyScreen() {
  const router = useRouter();

  // form state
  const [propertyName, setPropertyName] = useState("");
  const [category, setCategory] = useState("");
  const [ownership, setOwnership] = useState("");
  const [areaValue, setAreaValue] = useState("");
  const [areaUnit, setAreaUnit] = useState("Acres");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [marketValue, setMarketValue] = useState("");
  const [prevOwner, setPrevOwner] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [notes, setNotes] = useState("");

  const [focused, setFocused] = useState<string | null>(null);
  const [showCategory, setShowCategory] = useState(false);
  const [showOwnership, setShowOwnership] = useState(false);
  const [showUnit, setShowUnit] = useState(false);

  const nameHasError = propertyName.trim().length === 0;

  const handleClose = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const handleSave = () => {
    // validate minimal – keep error state visible (matching HTML error presentation)
    if (nameHasError) return;
    handleClose();
  };

  const inputBorder = (key: string, hasError?: boolean) => {
    if (hasError) return "border-error";
    if (focused === key) return "border-amber";
    return "border-hairline";
  };

  return (
    <View className="flex-1 bg-ink">
      {/* center the archive plate like body flex items-center justify-center p-4 */}
      <View className="flex-1 items-center justify-center p-4">
        {/* modal-panel archive-plate max-w-md — bg-panel (#14120e) with hairline, amber ticks 8px L */}
        <View className="w-full max-w-md flex-1 bg-panel border border-outline-variant rounded-sm shadow-2xl overflow-hidden relative flex flex-col max-h-[795px]">
          {/* Amber Corner Ticks — 8px L shape */}
          <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-amber pointer-events-none z-20" />
          <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-amber pointer-events-none z-20" />
          <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-amber pointer-events-none z-20" />
          <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-amber pointer-events-none z-20" />

          {/* Header — sticky top, eyebrow REGISTRY PROTOCOL + Add Property headline + close */}
          <View className="flex flex-col gap-2 p-6 border-b border-outline-variant bg-panel z-10">
            <View className="flex-row justify-between items-start w-full">
              <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-amber leading-none">
                REGISTRY PROTOCOL
              </Text>
              <Pressable
                onPress={handleClose}
                hitSlop={12}
                className="-mr-1 -mt-1 p-1 active:opacity-60"
                accessibilityLabel="Close"
              >
                <Text className="text-outline text-[22px] leading-none">✕</Text>
              </Pressable>
            </View>
            <Text className="text-[36px] font-normal tracking-tight text-on-surface leading-[1.15] mt-2">
              Add Property
            </Text>
          </View>

          {/* Scrollable form */}
          <ScrollView
            className="flex-1 bg-panel"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="p-6 gap-8 pb-4">
              {/* 1 — Property Name (Error State as in HTML) */}
              <View className="flex flex-col gap-1">
                <View className="flex-row justify-between items-center">
                  <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-outline">
                    Property Name
                  </Text>
                  <Text className="text-amber text-[12px] leading-none">*</Text>
                </View>
                <TextInput
                  value={propertyName}
                  onChangeText={setPropertyName}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  placeholder="e.g. Whispering Pines Estate"
                  placeholderTextColor="#4c4638"
                  className={`bg-transparent border-0 border-b py-2 px-0 text-[16px] leading-[1.6] text-on-surface ${inputBorder("name", nameHasError)}`}
                />
                {nameHasError ? (
                  <View className="flex-row items-center gap-1 mt-1">
                    <Text className="text-amber text-[12px] leading-none">●</Text>
                    <Text className="text-amber text-[14px] font-medium leading-none">
                      Property name is required
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* 2 — Category */}
              <View className="flex flex-col gap-1">
                <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-outline">
                  Category
                </Text>
                <Pressable
                  onPress={() => {
                    setShowCategory((v) => !v);
                    setShowOwnership(false);
                    setShowUnit(false);
                  }}
                  className={`flex-row items-center justify-between bg-transparent border-0 border-b py-2 px-0 ${focused === "category" || showCategory ? "border-amber" : "border-hairline"}`}
                >
                  <Text className={`text-[16px] leading-[1.6] ${category ? "text-on-surface" : "text-outline-variant"}`}>
                    {category || "Select Classification..."}
                  </Text>
                  <Text className="text-outline text-[14px] leading-none">arrow_drop_down</Text>
                </Pressable>
                {showCategory ? (
                  <View className="bg-plate border border-hairline rounded-sm mt-1 overflow-hidden">
                    {CATEGORY_OPTIONS.map((opt) => (
                      <Pressable
                        key={opt}
                        onPress={() => {
                          setCategory(opt);
                          setShowCategory(false);
                        }}
                        className={`px-3 py-3 border-b border-hairline last:border-b-0 ${category === opt ? "bg-paper" : "bg-plate"} active:bg-paper`}
                      >
                        <Text className={`text-[14px] ${category === opt ? "text-amber font-semibold" : "text-on-surface"}`}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>

              {/* 3 — Ownership */}
              <View className="flex flex-col gap-1">
                <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-outline">
                  Ownership
                </Text>
                <Pressable
                  onPress={() => {
                    setShowOwnership((v) => !v);
                    setShowCategory(false);
                    setShowUnit(false);
                  }}
                  className={`flex-row items-center justify-between bg-transparent border-0 border-b py-2 px-0 ${focused === "ownership" || showOwnership ? "border-amber" : "border-hairline"}`}
                >
                  <Text className={`text-[16px] leading-[1.6] ${ownership ? "text-on-surface" : "text-outline-variant"}`}>
                    {ownership || "Select Origin..."}
                  </Text>
                  <Text className="text-outline text-[14px] leading-none">arrow_drop_down</Text>
                </Pressable>
                {showOwnership ? (
                  <View className="bg-plate border border-hairline rounded-sm mt-1 overflow-hidden">
                    {OWNERSHIP_OPTIONS.map((opt) => (
                      <Pressable
                        key={opt}
                        onPress={() => {
                          setOwnership(opt);
                          setShowOwnership(false);
                        }}
                        className={`px-3 py-3 border-b border-hairline last:border-b-0 ${ownership === opt ? "bg-paper" : "bg-plate"} active:bg-paper`}
                      >
                        <Text className={`text-[14px] ${ownership === opt ? "text-amber font-semibold" : "text-on-surface"}`}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>

              {/* 4 — Area Group (area + unit split) */}
              <View className="flex flex-col gap-1">
                <View className="flex-row justify-between items-center">
                  <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-outline">Area</Text>
                  <Text className="text-amber text-[12px] leading-none">*</Text>
                </View>
                <View className="flex-row gap-4">
                  <View className="flex-[2]">
                    <TextInput
                      value={areaValue}
                      onChangeText={setAreaValue}
                      onFocus={() => setFocused("areaValue")}
                      onBlur={() => setFocused(null)}
                      placeholder="0.00"
                      placeholderTextColor="#4c4638"
                      keyboardType="numeric"
                      className={`bg-transparent border-0 border-b py-2 px-0 text-[16px] leading-[1.6] text-on-surface ${inputBorder("areaValue")}`}
                    />
                  </View>
                  <View className="flex-1">
                    <Pressable
                      onPress={() => {
                        setShowUnit((v) => !v);
                        setShowCategory(false);
                        setShowOwnership(false);
                      }}
                      className={`flex-row items-center justify-between bg-transparent border-0 border-b py-2 px-0 ${showUnit ? "border-amber" : focused === "areaUnit" ? "border-amber" : "border-hairline"}`}
                    >
                      <Text className="text-[16px] leading-[1.6] text-on-surface">{areaUnit}</Text>
                      <Text className="text-outline text-[14px] leading-none">arrow_drop_down</Text>
                    </Pressable>
                    {showUnit ? (
                      <View className="absolute top-[42px] left-0 right-0 bg-plate border border-hairline rounded-sm overflow-hidden z-10">
                        {AREA_UNITS.map((u) => (
                          <Pressable
                            key={u}
                            onPress={() => {
                              setAreaUnit(u);
                              setShowUnit(false);
                            }}
                            className={`px-3 py-2.5 border-b border-hairline last:border-b-0 ${areaUnit === u ? "bg-paper" : "bg-plate"} active:bg-paper`}
                          >
                            <Text className={`text-[14px] ${areaUnit === u ? "text-amber font-semibold" : "text-on-surface"}`}>{u}</Text>
                          </Pressable>
                        ))}
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>

              {/* 5 — Financial Group (Grid 2 col: Purchase Date / Purchase Price) */}
              <View className="flex-row gap-4">
                <View className="flex-1 flex flex-col gap-1">
                  <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-outline">
                    Purchase Date
                  </Text>
                  <TextInput
                    value={purchaseDate}
                    onChangeText={setPurchaseDate}
                    onFocus={() => setFocused("purchaseDate")}
                    onBlur={() => setFocused(null)}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#4c4638"
                    className={`bg-transparent border-0 border-b py-2 px-0 text-[16px] leading-[1.6] text-on-surface ${inputBorder("purchaseDate")}`}
                  />
                </View>
                <View className="flex-1 flex flex-col gap-1">
                  <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-outline">
                    Purchase Price (₹)
                  </Text>
                  <TextInput
                    value={purchasePrice}
                    onChangeText={setPurchasePrice}
                    onFocus={() => setFocused("purchasePrice")}
                    onBlur={() => setFocused(null)}
                    placeholder="0.00"
                    placeholderTextColor="#4c4638"
                    keyboardType="numeric"
                    className={`bg-transparent border-0 border-b py-2 px-0 text-[16px] leading-[1.6] text-on-surface ${inputBorder("purchasePrice")}`}
                  />
                </View>
              </View>

              {/* 6 — Value & History Grid (Market Value / Previous Owner) */}
              <View className="flex-row gap-4">
                <View className="flex-1 flex flex-col gap-1">
                  <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-outline">
                    Market Value (₹)
                  </Text>
                  <TextInput
                    value={marketValue}
                    onChangeText={setMarketValue}
                    onFocus={() => setFocused("marketValue")}
                    onBlur={() => setFocused(null)}
                    placeholder="0.00"
                    placeholderTextColor="#4c4638"
                    keyboardType="numeric"
                    className={`bg-transparent border-0 border-b py-2 px-0 text-[16px] leading-[1.6] text-on-surface ${inputBorder("marketValue")}`}
                  />
                </View>
                <View className="flex-1 flex flex-col gap-1">
                  <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-outline">
                    Previous Owner
                  </Text>
                  <TextInput
                    value={prevOwner}
                    onChangeText={setPrevOwner}
                    onFocus={() => setFocused("prevOwner")}
                    onBlur={() => setFocused(null)}
                    placeholder="Optional"
                    placeholderTextColor="#4c4638"
                    className={`bg-transparent border-0 border-b py-2 px-0 text-[16px] leading-[1.6] text-on-surface ${inputBorder("prevOwner")}`}
                  />
                </View>
              </View>

              {/* 7 — Geospatial Data inset bg-paper p-4 */}
              <View className="p-4 bg-paper border border-outline-variant rounded-sm flex flex-col gap-4">
                <View className="flex-row items-center gap-2">
                  <Text className="text-outline text-[14px] leading-none">⌖</Text>
                  <Text className="text-[12px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                    Geospatial Data
                  </Text>
                </View>
                <View className="flex-row gap-4">
                  <View className="flex-1 flex flex-col gap-1">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-outline">
                        Latitude
                      </Text>
                      <Text className="text-amber text-[12px] leading-none">*</Text>
                    </View>
                    <TextInput
                      value={latitude}
                      onChangeText={setLatitude}
                      onFocus={() => setFocused("latitude")}
                      onBlur={() => setFocused(null)}
                      placeholder="e.g. 19.0760"
                      placeholderTextColor="#4c4638"
                      keyboardType="numeric"
                      className={`bg-transparent border-0 border-b py-2 px-0 text-[16px] leading-[1.6] text-on-surface ${inputBorder("latitude")}`}
                    />
                  </View>
                  <View className="flex-1 flex flex-col gap-1">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-outline">
                        Longitude
                      </Text>
                      <Text className="text-amber text-[12px] leading-none">*</Text>
                    </View>
                    <TextInput
                      value={longitude}
                      onChangeText={setLongitude}
                      onFocus={() => setFocused("longitude")}
                      onBlur={() => setFocused(null)}
                      placeholder="e.g. 72.8777"
                      placeholderTextColor="#4c4638"
                      keyboardType="numeric"
                      className={`bg-transparent border-0 border-b py-2 px-0 text-[16px] leading-[1.6] text-on-surface ${inputBorder("longitude")}`}
                    />
                  </View>
                </View>
              </View>

              {/* 8 — Archival Notes textarea */}
              <View className="flex flex-col gap-1">
                <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-outline">
                  Archival Notes
                </Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  onFocus={() => setFocused("notes")}
                  onBlur={() => setFocused(null)}
                  placeholder="Add additional contextual records here..."
                  placeholderTextColor="#4c4638"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className={`bg-transparent border-0 border-b py-2 px-0 text-[16px] leading-[1.6] text-on-surface min-h-[72px] ${inputBorder("notes")}`}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer sticky with Cancel (border-transparent) + Save Record bg-gold */}
          <View className="p-6 border-t border-outline-variant flex-row justify-end gap-4 bg-panel z-10">
            <Pressable
              onPress={handleClose}
              className="px-6 py-3 rounded-sm border border-transparent active:bg-plate active:border-hairline"
            >
              <Text className="text-[14px] font-medium uppercase tracking-widest text-secondary text-center">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              className="px-8 py-3 rounded-sm bg-gold flex-row items-center justify-center gap-2 active:opacity-90"
            >
              <Text className="text-on-primary text-[12px] leading-none">◆</Text>
              <Text className="text-[14px] font-bold uppercase tracking-widest text-on-primary text-center">
                Save Record
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
