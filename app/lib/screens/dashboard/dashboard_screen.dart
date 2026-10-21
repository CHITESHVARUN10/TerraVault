import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../providers/providers.dart';
import '../../theme/tv_theme.dart';
import '../../widgets/property_card.dart';
import '../../widgets/widgets.dart';
import '../../sheets/connect_drive_sheet.dart';
import '../../sheets/add_property_sheet.dart';

/// 04_dashboard / m06_dashboard — welcome, stat ledger, drive status,
/// recent records.
class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    if (!mounted) return;
    await context.read<PropertiesProvider>().refresh();
    if (!mounted) return;
    await context.read<DriveProvider>().refresh();
  }

  double _sum(Iterable<double> values) {
    double total = 0;
    for (final v in values) {
      total += v;
    }
    return total;
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final props = context.watch<PropertiesProvider>();
    final drive = context.watch<DriveProvider>();
    final user = auth.user;
    final firstName = (user?.name ?? 'Custodian').split(' ').first;
    final list = props.all;

    final totalArea = _sum(list.map((p) => p.area));
    final totalValue = _sum(list.map((p) => p.marketValue));
    final docCount = list.fold<int>(0, (a, p) => a + p.documents.length);
    final visitCount = list.fold<int>(0, (a, p) => a + p.visits.length);

    return RefreshIndicator(
      color: TvColors.amber,
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
        children: [
          Text(
            'Welcome back, $firstName.',
            style: TvTypography.headingLG(context),
          ),
          const SizedBox(height: 6),
          Text(
            'The archive is ready. Every record is yours.',
            style: TvTypography.bodyMD(context),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: TvButton(
                  label: '+ Register property',
                  onPressed: () => openAddPropertySheet(context),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TvButton(
                  label: drive.connected ? 'Drive connected' : 'Connect Drive',
                  variant: TvButtonVariant.outline,
                  onPressed: () => openConnectDriveSheet(context),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          const Eyebrow('Stat ledger'),
          const SizedBox(height: 10),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 4,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              mainAxisExtent: 78,
            ),
            itemBuilder: (context, index) {
              final tiles = [
                StatTile(label: 'Properties', value: list.length.toString()),
                StatTile(
                  label: 'Total area',
                  value: '${_trimNum(totalArea)} sq units',
                ),
                StatTile(
                  label: 'Est. market value',
                  value: formatMoney(totalValue),
                ),
                StatTile(
                  label: 'Documents / Visits',
                  value: '$docCount / $visitCount',
                ),
              ];
              return tiles[index];
            },
          ),
          const SizedBox(height: 24),
          Plate(
            ticked: false,
            fill: TvColors.plateInset,
            child: Row(
              children: [
                Icon(
                  drive.connected
                      ? Icons.cloud_done_outlined
                      : Icons.cloud_off_outlined,
                  color: drive.connected ? TvColors.success : TvColors.outline,
                  size: 22,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        drive.connected
                            ? 'Google Drive connected'
                            : 'Connect Google Drive',
                        style: TvTypography.labelUI(
                          context,
                        ).copyWith(fontSize: 13),
                      ),
                      Text(
                        drive.connected
                            ? '${drive.status.folderName ?? "Property Vault"} · ${drive.status.email ?? ""}'
                            : 'Your records live in your own Drive.',
                        style: TvTypography.bodyMD(
                          context,
                        ).copyWith(fontSize: 11),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                TextButton(
                  onPressed: () => openConnectDriveSheet(context),
                  child: Text(
                    drive.connected ? 'Manage' : 'Connect',
                    style: TvTypography.labelUI(
                      context,
                    ).copyWith(color: TvColors.amber, fontSize: 12),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Eyebrow('Recent records'),
          const SizedBox(height: 10),
          if (props.loading && list.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 40),
              child: Center(
                child: CircularProgressIndicator(color: TvColors.amber),
              ),
            )
          else if (props.error != null && list.isEmpty)
            Plate(
              child: Text(
                props.error!,
                style: TvTypography.bodyMD(
                  context,
                ).copyWith(color: TvColors.error),
              ),
            )
          else if (list.isEmpty)
            DashedAction(
              label: '+ Register property',
              onTap: () => openAddPropertySheet(context),
            )
          else ...[
            for (final p in list.take(3))
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: PropertyCard(property: p),
              ),
            TextButton(
              onPressed: () => context.go('/properties'),
              child: Text(
                'View all ${list.length} records →',
                style: TvTypography.labelUI(
                  context,
                ).copyWith(color: TvColors.amber, fontSize: 12),
              ),
            ),
          ],
        ],
      ),
    );
  }

  String _trimNum(num v) =>
      v % 1 == 0 ? v.toInt().toString() : v.toStringAsFixed(1);
}
