import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../theme/tv_theme.dart';
import '../../widgets/widgets.dart';

/// Landing screen — condensed 01_landing: hero, purpose, ledger demo,
/// visits, maps, privacy, CTA.
class LandingScreen extends StatefulWidget {
  const LandingScreen({super.key});

  @override
  State<LandingScreen> createState() => _LandingScreenState();
}

class _LandingScreenState extends State<LandingScreen> {
  final _purposeKey = GlobalKey();

  void _scrollToPurpose() {
    final target = _purposeKey.currentContext;
    if (target != null) {
      Scrollable.ensureVisible(
        target,
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOutCubic,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: TvColors.ink,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 40),
          children: [
            Row(
              children: [
                Text(
                  'TERRAVAULT',
                  style: TvTypography.labelUI(
                    context,
                  ).copyWith(letterSpacing: 4, color: TvColors.gold),
                ),
                const Spacer(),
                TextButton(
                  onPressed: () => context.go('/login'),
                  child: Text(
                    'Sign in',
                    style: TvTypography.labelUI(
                      context,
                    ).copyWith(color: TvColors.amber),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 48),
            const Eyebrow('A private vault for your land'),
            const SizedBox(height: 14),
            Text.rich(
              TextSpan(
                text: 'Your land, ',
                style: TvTypography.headingXL(context),
                children: [
                  TextSpan(
                    text: 'kept',
                    style: TvTypography.headingXL(context).copyWith(
                      color: TvColors.gold,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const TextSpan(text: ' for good'),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Documents, coordinates, photographs and visit history — '
              'preserved in your own Google Drive. Never on ours.',
              style: TvTypography.bodyMD(context).copyWith(fontSize: 15),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: TvButton(
                    label: 'Open your vault',
                    onPressed: () => context.go('/login'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TvButton(
                    label: 'Learn more',
                    variant: TvButtonVariant.outline,
                    onPressed: _scrollToPurpose,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Plate(
              ticked: false,
              fill: TvColors.plateInset,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Eyebrow('Coordinates'),
                  const SizedBox(height: 4),
                  Text(
                    'N 27°12′04″ · E 78°00′18″',
                    style: TvTypography.mono(
                      context,
                    ).copyWith(color: TvColors.gold),
                  ),
                  const SizedBox(height: 12),
                  const Divider(color: TvColors.hairline, height: 1),
                  const SizedBox(height: 12),
                  const Eyebrow('Vault status'),
                  const SizedBox(height: 4),
                  Text('SECURE', style: TvTypography.value(context)),
                ],
              ),
            ),
            const SizedBox(height: 48),
            Container(key: _purposeKey),
            const Eyebrow('Purpose'),
            const SizedBox(height: 10),
            Text(
              'Landmarks shift, roads move, boundaries blur. TerraVault keeps '
              'the permanent record — one structured file per property, one '
              'folder in a Drive you own.',
              style: TvTypography.bodyMD(context),
            ),
            const SizedBox(height: 48),
            const Eyebrow('Visits'),
            const SizedBox(height: 10),
            for (int year = 2028; year >= 2026; year--)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 6),
                child: Plate(
                  child: Row(
                    children: [
                      SizedBox(
                        width: 56,
                        child: Text(
                          '$year',
                          style: TvTypography.headingSM(
                            context,
                          ).copyWith(color: TvColors.amber, fontSize: 16),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Standing, north, east, south, west — five frames '
                          'per visit, timestamped, permanent.',
                          style: TvTypography.bodyMD(
                            context,
                          ).copyWith(fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 48),
            const Eyebrow('Privacy'),
            const SizedBox(height: 10),
            Text(
              'Even a full compromise of our backend exposes nothing of yours '
              '— because nothing of yours is there. Zero-trust by design.',
              style: TvTypography.bodyMD(context),
            ),
            const SizedBox(height: 48),
            TvButton(
              label: 'Open your vault →',
              expanded: true,
              onPressed: () => context.go('/login'),
            ),
            const SizedBox(height: 24),
            Center(
              child: Text(
                '© 2026 TerraVault · Your data, yours.',
                style: TvTypography.bodyMD(context).copyWith(fontSize: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
