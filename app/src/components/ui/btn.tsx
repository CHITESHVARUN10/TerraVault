import { Pressable, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  fullWidth?: boolean;
};

const variantMap: Record<Variant, string> = {
  primary: 'bg-gold',
  secondary: 'bg-transparent border border-hairline',
  ghost: 'bg-transparent',
  danger: 'bg-danger-amber',
};

const textMap: Record<Variant, string> = {
  primary: 'text-ink',
  secondary: 'text-amber',
  ghost: 'text-amber',
  danger: 'text-on-surface',
};

export function Btn({ label, onPress, variant = 'primary', fullWidth = true }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`items-center justify-center py-4 px-6 rounded-sm ${variantMap[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      <Text className={`text-[14px] font-medium uppercase tracking-[0.12em] ${textMap[variant]}`}>
        {label}
      </Text>
    </Pressable>
  );
}
