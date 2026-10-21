import 'package:flutter/material.dart';

import '../theme/tv_theme.dart';

export 'plate.dart';

/// The signature 1px amber "corner tick" brackets on archive plates.
class CornerTicks extends StatelessWidget {
  const CornerTicks({
    required this.child,
    this.padding = const EdgeInsets.fromLTRB(16, 20, 16, 20),
    this.fill = TvColors.plate,
    this.tick = TvColors.amber,
    this.tickLength = 9,
    super.key,
  });

  final Widget child;
  final EdgeInsets padding;
  final Color fill;
  final Color tick;
  final double tickLength;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          padding: padding,
          decoration: BoxDecoration(
            color: fill,
            borderRadius: tvBorderRadius,
            border: Border.all(color: TvColors.hairline),
          ),
          child: child,
        ),
        Positioned.fill(
          child: IgnorePointer(
            child: CustomPaint(
              painter: _CornerTickPainter(
                color: tick,
                length: tickLength,
                strokeWidth: 1,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _CornerTickPainter extends CustomPainter {
  _CornerTickPainter({
    required this.color,
    required this.length,
    required this.strokeWidth,
  });

  final Color color;
  final double length;
  final double strokeWidth;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    const inset = 0.0;
    Path path = Path()
      // top-left
      ..moveTo(inset, inset + length)
      ..lineTo(inset, inset)
      ..lineTo(inset + length, inset)
      // top-right
      ..moveTo(size.width - inset - length, inset)
      ..lineTo(size.width - inset, inset)
      ..lineTo(size.width - inset, inset + length)
      // bottom-right
      ..moveTo(size.width - inset, size.height - inset - length)
      ..lineTo(size.width - inset, size.height - inset)
      ..lineTo(size.width - inset - length, size.height - inset)
      // bottom-left
      ..moveTo(inset + length, size.height - inset)
      ..lineTo(inset, size.height - inset)
      ..lineTo(inset, size.height - inset - length);

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(_CornerTickPainter oldDelegate) =>
      color != oldDelegate.color ||
      length != oldDelegate.length ||
      strokeWidth != oldDelegate.strokeWidth;
}

/// Uppercase wide-tracked amber eyebrow label.
class Eyebrow extends StatelessWidget {
  const Eyebrow(this.text, {this.color, super.key});

  final String text;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Text(
      text.toUpperCase(),
      style: TvTypography.eyebrow(context).copyWith(color: color),
      overflow: TextOverflow.ellipsis,
    );
  }
}

/// Gold primary / outline secondary button pair styling.
class TvButton extends StatelessWidget {
  const TvButton({
    required this.label,
    required this.onPressed,
    this.variant = TvButtonVariant.primary,
    this.expanded = false,
    this.loading = false,
    this.icon,
    super.key,
  });

  final String label;
  final VoidCallback? onPressed;
  final TvButtonVariant variant;
  final bool expanded;
  final bool loading;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final enabled = onPressed != null && !loading;
    final bool primary = variant == TvButtonVariant.primary;
    final bool danger = variant == TvButtonVariant.danger;

    final Color bg = primary
        ? TvColors.gold
        : danger
        ? TvColors.delete
        : Colors.transparent;
    final Color fg = primary
        ? TvColors.onGold
        : danger
        ? Colors.white
        : TvColors.amber;

    final Widget child = loading
        ? SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(fg),
            ),
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[
                Icon(icon, size: 18, color: fg),
                const SizedBox(width: 8),
              ],
              Text(
                label,
                style: TvTypography.labelUI(context).copyWith(color: fg),
              ),
            ],
          );

    return SizedBox(
      width: expanded ? double.infinity : null,
      height: 44,
      child: FilledButton(
        onPressed: enabled ? onPressed : null,
        style: FilledButton.styleFrom(
          backgroundColor: bg,
          foregroundColor: fg,
          elevation: 0,
          shape: const RoundedRectangleBorder(borderRadius: tvBorderRadius),
          side: primary
              ? null
              : const BorderSide(color: TvColors.outlineVariant, width: 1),
        ),
        child: child,
      ),
    );
  }
}

enum TvButtonVariant { primary, outline, danger }

/// Underline-style text field used across the archive forms.
class TvField extends StatelessWidget {
  const TvField({
    required this.label,
    this.controller,
    this.initialValue,
    this.hint,
    this.prefixIcon,
    this.keyboardType,
    this.obscureText = false,
    this.readOnly = false,
    this.validator,
    this.suffix,
    this.maxLines = 1,
    this.onTap,
    this.onChanged,
    super.key,
  });

  final String label;
  final TextEditingController? controller;
  final String? initialValue;
  final String? hint;
  final IconData? prefixIcon;
  final TextInputType? keyboardType;
  final bool obscureText;
  final bool readOnly;
  final String? Function(String?)? validator;
  final Widget? suffix;
  final int maxLines;
  final VoidCallback? onTap;
  final ValueChanged<String>? onChanged;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      initialValue: controller == null ? initialValue : null,
      keyboardType: keyboardType,
      obscureText: obscureText,
      readOnly: readOnly,
      maxLines: maxLines,
      onTap: onTap,
      onChanged: onChanged,
      validator: validator,
      style: TvTypography.bodyLG(context),
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: prefixIcon != null
            ? Icon(prefixIcon, size: 18, color: TvColors.outline)
            : null,
        suffixIcon: suffix,
      ),
    );
  }
}

/// Small pill chip (doc-type badges, status badges).
class TvChip extends StatelessWidget {
  const TvChip({
    required this.label,
    this.selected = false,
    this.onTap,
    super.key,
  });

  final String label;
  final bool selected;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final Color fg = selected ? TvColors.onGold : TvColors.amberDim;
    final Color bg = selected ? TvColors.gold : Colors.transparent;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(999),
          border: Border.all(
            color: selected ? Colors.transparent : TvColors.outlineVariant,
          ),
        ),
        child: Text(
          label,
          style: TvTypography.labelUI(
            context,
          ).copyWith(color: fg, fontSize: 11),
        ),
      ),
    );
  }
}

/// Dashed-border empty padding (empty states, dropzones).
class DashedBox extends StatelessWidget {
  const DashedBox({required this.child, this.height, super.key});

  final Widget child;
  final double? height;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: tvBorderRadius,
        border: Border.all(color: TvColors.outlineVariant, width: 1),
        color: TvColors.plateInset,
      ),
      child: child,
    );
  }
}

/// Tappable dashed "+ action" plate used on dashboard / properties.
class DashedAction extends StatelessWidget {
  const DashedAction({required this.label, required this.onTap, super.key});

  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return DashedBox(
      child: InkWell(
        borderRadius: tvBorderRadius,
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.add, color: TvColors.amber, size: 26),
            const SizedBox(height: 8),
            Text(
              label.toUpperCase(),
              style: TvTypography.labelUI(
                context,
              ).copyWith(color: TvColors.amber, fontSize: 11, letterSpacing: 2),
            ),
          ],
        ),
      ),
    );
  }
}
