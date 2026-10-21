import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../config.dart';
import '../providers/providers.dart';
import '../theme/tv_theme.dart';
import '../widgets/widgets.dart';

/// Opens the m09 → m11 connect drive flow: browser-based Google consent,
/// then polling `drive/status` when the user returns to the app.
void openConnectDriveSheet(BuildContext context) {
  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: TvColors.ink,
    builder: (_) => const _ConnectDriveSheet(),
  );
}

class _ConnectDriveSheet extends StatefulWidget {
  const _ConnectDriveSheet();

  @override
  State<_ConnectDriveSheet> createState() => _ConnectDriveSheetState();
}

class _ConnectDriveSheetState extends State<_ConnectDriveSheet> {
  bool _checking = false;

  Future<void> _connect() async {
    setState(() => _checking = true);
    final url = Uri.parse(AppConfig.driveConnectUrl);
    final driveProvider = context.read<DriveProvider>();
    try {
      await launchUrl(url, mode: LaunchMode.externalApplication);
      // Poll for the connection while the sheet is open — the callback
      // completes in the browser and stores the tokens server-side.
      for (int i = 0; i < 60; i++) {
        await Future<void>.delayed(const Duration(seconds: 3));
        if (!mounted) return;
        await driveProvider.refresh();
        if (driveProvider.connected) {
          if (mounted) {
            setState(() => _checking = false);
          }
          return;
        }
      }
    } catch (_) {
      // launcher unavailable — ignore
    }
    if (mounted) {
      setState(() => _checking = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final drive = context.watch<DriveProvider>();

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        child: SingleChildScrollView(
          child: drive.connected
              ? Plate(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.verified_user_outlined,
                        color: TvColors.success,
                        size: 40,
                      ),
                      const SizedBox(height: 10),
                      const Eyebrow('External storage'),
                      const SizedBox(height: 6),
                      Text(
                        'Drive connected',
                        style: TvTypography.headingLG(context),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        '${drive.status.email ?? "Drive"} · ${drive.status.folderName ?? "Property Vault"}'
                        '${drive.status.connectedAt.isEmptyOrNull ? "" : " · since ${drive.status.connectedAt}"}',
                        style: TvTypography.bodyMD(
                          context,
                        ).copyWith(fontSize: 12),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      TvButton(
                        label: 'Done',
                        expanded: true,
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                      const SizedBox(height: 8),
                      TvButton(
                        label: 'Disconnect',
                        variant: TvButtonVariant.danger,
                        expanded: true,
                        onPressed: () async {
                          await context.read<DriveProvider>().disconnect();
                          if (mounted) setState(() {});
                        },
                      ),
                    ],
                  ),
                )
              : Plate(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        children: [
                          const Eyebrow('External storage'),
                          const Spacer(),
                          IconButton(
                            icon: const Icon(
                              Icons.close,
                              size: 20,
                              color: TvColors.onSurface,
                            ),
                            onPressed: () => Navigator.of(context).pop(),
                          ),
                        ],
                      ),
                      Text(
                        'Connect Archive Repository',
                        style: TvTypography.headingMD(context),
                      ),
                      const SizedBox(height: 14),
                      SheetRow(
                        icon: Icons.shield_outlined,
                        title: 'Zero-trust encryption',
                        subtitle:
                            'Tokens are AES-256-GCM encrypted and never '
                            'leave our servers unencrypted. Your files live '
                            'only in your Drive.',
                      ),
                      SheetRow(
                        icon: Icons.cloud_sync_outlined,
                        title: 'Automated backup',
                        subtitle:
                            'Every document you store is placed into the '
                            'property\'s own folder inside your Drive.',
                      ),
                      SheetRow(
                        icon: Icons.key_off_outlined,
                        title: 'Sovereign file ownership',
                        subtitle:
                            'Disconnect any time — files remain in your '
                            'Drive, untouched.',
                      ),
                      const SizedBox(height: 16),
                      TvButton(
                        label: 'Connect with Google',
                        expanded: true,
                        icon: Icons.public,
                        onPressed: _connect,
                      ),
                      const SizedBox(height: 8),
                      TvButton(
                        label: 'Cancel',
                        variant: TvButtonVariant.outline,
                        expanded: true,
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                      if (_checking)
                        const Padding(
                          padding: EdgeInsets.only(top: 12),
                          child: Text(
                            'Waiting for the browser to return…',
                            textAlign: TextAlign.center,
                          ),
                        ),
                    ],
                  ),
                ),
        ),
      ),
    );
  }
}

/// Icon-bullet row used on the drive connect card.
class SheetRow extends StatelessWidget {
  const SheetRow({
    required this.icon,
    required this.title,
    required this.subtitle,
    super.key,
  });

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: TvColors.amber, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TvTypography.labelUI(context).copyWith(fontSize: 13),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TvTypography.bodyMD(context).copyWith(fontSize: 11),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

extension _E on String? {
  bool get isEmptyOrNull => this == null || this!.isEmpty;
}
