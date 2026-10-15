import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../providers/providers.dart';
import '../../theme/tv_theme.dart';
import '../../widgets/property_card.dart' show StatTile, formatMoney;
import '../../widgets/widgets.dart';
import '../../sheets/connect_drive_sheet.dart';

/// 07_profile / m18 — identity, drive storage, vault summary.
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final drive = context.watch<DriveProvider>();
    final props = context.watch<PropertiesProvider>();
    final user = auth.user;

    if (user == null) {
      return const Center(child: CircularProgressIndicator(color: TvColors.amber));
    }

    final docCount = props.all.fold<int>(0, (a, p) => a + p.documents.length);
    final visitCount = props.all.fold<int>(0, (a, p) => a + p.visits.length);
    final vaultValue = props.all.fold<double>(0, (a, p) => a + p.marketValue);

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
      children: [
        Text('Profile', style: TvTypography.headingLG(context)),
        const SizedBox(height: 6),
        Text('Account', style: TvTypography.eyebrow(context).copyWith(fontSize: 10)),
        const SizedBox(height: 16),
        Center(
          child: Stack(
            children: [
              CircleAvatar(
                radius: 32,
                backgroundColor: TvColors.plateInset,
                child: Text(
                  user.initials,
                  style: TvTypography.headingMD(context)
                      .copyWith(color: TvColors.amber, fontSize: 20),
                ),
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: Container(
                  width: 22,
                  height: 22,
                  decoration: BoxDecoration(
                    color: TvColors.gold,
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(color: TvColors.ink, width: 2),
                  ),
                  child: const Icon(Icons.lock, size: 12, color: TvColors.onGold),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Center(
          child: Text(user.name, style: TvTypography.headingSM(context)),
        ),
        Center(
          child: Text(
            'Joined ${user.joinedAt ?? "-"}',
            style: TvTypography.bodyMD(context).copyWith(fontSize: 12),
          ),
        ),
        const SizedBox(height: 12),
        Center(child: TvChip(label: '${user.plan.toUpperCase()} TIER', selected: true)),
        const SizedBox(height: 24),
        const Eyebrow('Personal details'),
        const SizedBox(height: 10),
        Plate(
          child: Column(
            children: [
              TvField(
                label: 'Full Name',
                initialValue: user.name,
                prefixIcon: Icons.person_outline,
                readOnly: true,
              ),
              const SizedBox(height: 8),
              TvField(
                label: 'Email',
                initialValue: user.email,
                prefixIcon: Icons.lock_outline,
                readOnly: true,
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        const Eyebrow('Storage'),
        const SizedBox(height: 10),
        Plate(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    drive.connected
                        ? Icons.cloud_done_outlined
                        : Icons.cloud_off_outlined,
                    color: drive.connected ? TvColors.success : TvColors.outline,
                    size: 24,
                  ),
                  const Spacer(),
                  TvChip(
                    label: drive.connected ? 'Connected' : 'Not connected',
                    selected: drive.connected,
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                'Google Drive Integration',
                style: TvTypography.labelUI(context).copyWith(fontSize: 13),
              ),
              Text(
                '/${drive.status.folderName ?? "Property Vault"}'
                '${drive.status.email.isEmptyOrNull ? "" : " · ${drive.status.email}"}',
                style: TvTypography.mono(context).copyWith(fontSize: 11),
              ),
              const SizedBox(height: 12),
              TvButton(
                label: drive.connected ? 'Manage connection' : 'Connect Drive',
                variant: TvButtonVariant.outline,
                expanded: true,
                onPressed: () => openConnectDriveSheet(context),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        const Eyebrow('Vault summary'),
        const SizedBox(height: 10),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 2.2,
          children: [
            StatTile(label: 'Assets', value: props.all.length.toString()),
            StatTile(label: 'Records', value: docCount.toString()),
            StatTile(label: 'Logs', value: visitCount.toString()),
            StatTile(label: 'Est. value', value: formatMoney(vaultValue)),
          ],
        ),
        const SizedBox(height: 16),
        Plate(
          ticked: false,
          fill: TvColors.plateInset,
          child: Row(
            children: [
              const Icon(Icons.shield_outlined, color: TvColors.amber, size: 20),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Zero-Trust Security Protocol — even a full backend '
                  'compromise exposes none of your vault.',
                  style: TvTypography.bodyMD(context).copyWith(fontSize: 11),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        TvButton(
          label: 'Sign out',
          variant: TvButtonVariant.outline,
          expanded: true,
          onPressed: () async {
            await auth.logout();
            if (context.mounted) context.go('/login');
          },
        ),
      ],
    );
  }
}

extension _Empty on String? {
  bool get isEmptyOrNull => this == null || this!.isEmpty;
}
