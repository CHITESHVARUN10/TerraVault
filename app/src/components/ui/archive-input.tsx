import { Text, TextInput, View } from 'react-native';

type Props = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  multiline?: boolean;
  numberOfLines?: number;
};

export function ArchiveInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  keyboardType = 'default',
  multiline,
  numberOfLines,
}: Props) {
  return (
    <View className="gap-2">
      <Text className="text-[10px] font-semibold uppercase tracking-[0.3em] text-on-surface-variant">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#4c4638"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        className={`bg-transparent border-0 border-b py-2 px-0 text-[16px] text-on-surface ${
          error ? 'border-error' : 'border-hairline'
        }`}
        style={{ borderBottomWidth: 1 }}
      />
    </View>
  );
}

type SelectProps = {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onSelect: (v: string) => void;
};

export function ArchiveSelect({ label, value, placeholder, options }: SelectProps) {
  return (
    <View className="gap-2">
      <Text className="text-[10px] font-semibold uppercase tracking-[0.3em] text-on-surface-variant">
        {label}
      </Text>
      <View className="flex-row items-center justify-between border-b border-hairline py-3 px-0">
        <Text className={`text-[16px] ${value ? 'text-on-surface' : 'text-outline-variant'}`}>
          {value || placeholder}
        </Text>
        <Text className="text-outline text-[14px]">▼</Text>
      </View>
    </View>
  );
}
