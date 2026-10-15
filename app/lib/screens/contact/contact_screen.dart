import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../theme/tv_theme.dart';
import '../../widgets/widgets.dart';

/// 08_contact / m19 — contact registry.
class ContactScreen extends StatelessWidget {
  const ContactScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
      children: [
        Text('Contact', style: TvTypography.headingLG(context)),
        const SizedBox(height: 6),
        Text('Contact registry', style: TvTypography.eyebrow(context).copyWith(fontSize: 10)),
        const SizedBox(height: 16),
        Plate(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Eyebrow('Email'),
              const SizedBox(height: 6),
              Text('registry@terravault.io', style: TvTypography.value(context)),
              const SizedBox(height: 16),
              const Eyebrow('Custody hours'),
              const SizedBox(height: 6),
              Text('GMT — weekdays, 09:00 to 18:00.',
                  style: TvTypography.bodyMD(context)),
              const SizedBox(height: 16),
              TvButton(
                label: 'Write to the registry →',
                expanded: true,
                onPressed: () => launchUrl(
                  Uri.parse('mailto:registry@terravault.io'),
                  mode: LaunchMode.externalApplication,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        const Eyebrow('Privacy protocol'),
        const SizedBox(height: 10),
        Plate(
          ticked: false,
          fill: TvColors.plateInset,
          child: Text(
            'TerraVault never reads your Drive content beyond the "Property '
            'Vault" folder it creates. If you disconnect, all our tokens are '
            'destroyed — the data in your Drive remains untouched and yours.',
            style: TvTypography.bodyMD(context).copyWith(fontSize: 12),
          ),
        ),
      ],
    );
  }
}
