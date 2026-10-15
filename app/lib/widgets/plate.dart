import 'package:flutter/material.dart';

import '../theme/tv_theme.dart';
import 'widgets.dart' show CornerTicks;

/// The archive-plate container: plate fill, hairline border, amber ticks.
class Plate extends StatelessWidget {
  const Plate({
    required this.child,
    this.padding = const EdgeInsets.fromLTRB(14, 14, 14, 14),
    this.fill = TvColors.plate,
    this.ticked = true,
    super.key,
  });

  final Widget child;
  final EdgeInsets padding;
  final Color fill;
  final bool ticked;

  @override
  Widget build(BuildContext context) {
    if (!ticked) {
      return Container(
        padding: padding,
        decoration: BoxDecoration(
          color: fill,
          borderRadius: tvBorderRadius,
          border: Border.all(color: TvColors.hairline),
        ),
        child: child,
      );
    }
    return CornerTicks(padding: padding, fill: fill, child: child);
  }
}
