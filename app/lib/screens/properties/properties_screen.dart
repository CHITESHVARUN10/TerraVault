import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../data/models.dart';
import '../../providers/providers.dart';
import '../../theme/tv_theme.dart';
import '../../widgets/property_card.dart';
import '../../widgets/widgets.dart';
import '../../sheets/add_property_sheet.dart';

/// 05_all_properties / m07 — search, category filter, record grid.
class PropertiesScreen extends StatefulWidget {
  const PropertiesScreen({super.key});

  @override
  State<PropertiesScreen> createState() => _PropertiesScreenState();
}

class _PropertiesScreenState extends State<PropertiesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final props = context.read<PropertiesProvider>();
      if (!props.loaded) props.refresh();
    });
  }

  @override
  Widget build(BuildContext context) {
    final props = context.watch<PropertiesProvider>();
    final visible = props.visible;

    return RefreshIndicator(
      color: TvColors.amber,
      onRefresh: () => context.read<PropertiesProvider>().refresh(),
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Text(
                  'All properties',
                  style: TvTypography.headingLG(context),
                ),
              ),
              Text(
                '${visible.length.toString().padLeft(2, '0')} ${visible.length == 1 ? 'record' : 'records'}',
                style: TvTypography.eyebrow(context).copyWith(
                  fontSize: 10,
                  letterSpacing: 1.6,
                  color: TvColors.amberDim,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          TvField(
            label: 'Search vault',
            hint: 'Name, category or previous owner…',
            prefixIcon: Icons.search,
            onChanged: (v) => props.setSearch(v),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 36,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                for (final c in [
                  'All Categories',
                  ...TvEnums.categoriesForFilter,
                ])
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: TvChip(
                      label: c == 'All Categories' ? 'All' : c,
                      selected: props.categoryFilter == c,
                      onTap: () => props.setCategoryFilter(c),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          if (props.loading && !props.loaded)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 40),
              child: Center(
                child: CircularProgressIndicator(color: TvColors.amber),
              ),
            )
          else if (visible.isEmpty)
            DashedBox(
              child: Column(
                children: [
                  Text(
                    'No matches found',
                    style: TvTypography.headingSM(
                      context,
                    ).copyWith(color: TvColors.onSurfaceVariant, fontSize: 16),
                  ),
                  const SizedBox(height: 12),
                  TvButton(
                    label: 'Clear filters',
                    variant: TvButtonVariant.outline,
                    onPressed: () {
                      props.setSearch('');
                      props.setCategoryFilter('All Categories');
                    },
                  ),
                ],
              ),
            )
          else
            LayoutBuilder(
              builder: (context, constraints) {
                final crossCount = constraints.maxWidth > 600 ? 2 : 1;
                return GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: visible.length,
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: crossCount,
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    mainAxisExtent: 248,
                  ),
                  itemBuilder: (context, index) =>
                      PropertyCard(property: visible[index]),
                );
              },
            ),
          const SizedBox(height: 16),
          TvButton(
            label: '+ Register property',
            expanded: true,
            onPressed: () => openAddPropertySheet(context),
          ),
        ],
      ),
    );
  }
}
