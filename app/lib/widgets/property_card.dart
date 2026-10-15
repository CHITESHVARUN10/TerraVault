import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../data/models.dart';
import '../theme/tv_theme.dart';
import 'widgets.dart';

String formatMoney(num v) =>
    '₹${v.toStringAsFixed(v.truncateToDouble() == v ? 0 : 1)}';

String formatArea(TvProperty p) =>
    '${_trim(p.area)} ${TvEnums.areaUnitLabel(p.areaUnit)}';

String _trim(num v) =>
    v % 1 == 0 ? v.toInt().toString() : v.toStringAsFixed(1);

String formatCoords(TvProperty p) =>
    '${p.latitude.toStringAsFixed(4)}°N / ${p.longitude.toStringAsFixed(4)}°E';

/// Property record card from 04_dashboard / m06_dashboard / 05_all_properties.
class PropertyCard extends StatelessWidget {
  const PropertyCard({required this.property, super.key});

  final TvProperty property;

  @override
  Widget build(BuildContext context) {
    final p = property;
    return Plate(
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 14, 14, 0),
            child: Eyebrow(_categoryShort(p.category)),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 6, 14, 0),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    p.name,
                    style: TvTypography.headingSM(context).copyWith(fontSize: 18),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                TvChip(
                  label: _ownershipShort(p.ownership),
                  selected: true,
                ),
              ],
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 10),
            child: Divider(color: TvColors.hairline, height: 1),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            child: Column(
              children: [
                _row(context, 'Area', formatArea(p)),
                _row(context, 'Value', formatMoney(p.marketValue)),
                _row(context, 'Coord', formatCoords(p)),
                _row(context, 'Acquired', p.purchaseDate ?? '—'),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    '${p.documents.length} documents · ${p.visits.length} visits',
                    style: TvTypography.bodyMD(context).copyWith(fontSize: 12),
                  ),
                ),
                TextButton(
                  onPressed: () => context.go('/properties/${p.id}'),
                  child: Text(
                    'Open →',
                    style: TvTypography.labelUI(context)
                        .copyWith(color: TvColors.gold, fontSize: 12),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _row(BuildContext context, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          SizedBox(
            width: 64,
            child: Text(
              label.toUpperCase(),
              style: TvTypography.eyebrow(context)
                  .copyWith(fontSize: 9, letterSpacing: 1.6, color: TvColors.amberDim),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TvTypography.value(context).copyWith(fontSize: 13),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  String _categoryShort(String c) {
    if (c.toLowerCase().startsWith('agricultural')) return 'Agricultural';
    if (c.toLowerCase().startsWith('residential')) return 'Residential';
    if (c.toLowerCase().startsWith('commercial')) return 'Commercial';
    if (c.toLowerCase().startsWith('industrial')) return 'Industrial';
    return c;
  }

  String _ownershipShort(String o) {
    switch (o) {
      case 'Purchased':
        return 'Primary';
      case 'Inherited':
        return 'Secured';
      case 'Trust':
        return 'Held';
      default:
        return o;
    }
  }
}

/// Small stat tile for the dashboard ledger (2×2 grid on m06).
class StatTile extends StatelessWidget {
  const StatTile({
    required this.label,
    required this.value,
    super.key,
  });

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Plate(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label.toUpperCase(),
            style: TvTypography.eyebrow(context)
                .copyWith(fontSize: 9, letterSpacing: 1.6, color: TvColors.amberDim),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: TvTypography.headingSM(context).copyWith(fontSize: 18),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
