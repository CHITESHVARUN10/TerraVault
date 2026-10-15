import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../theme/tv_theme.dart';
import '../../widgets/widgets.dart';

/// 17_check_email / m02 — the recovery link was dispatched.
class CheckEmailScreen extends StatelessWidget {
  const CheckEmailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: TvColors.ink,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Plate(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Icon(Icons.mark_email_read_outlined,
                      color: TvColors.amber, size: 40),
                  const SizedBox(height: 12),
                  const Eyebrow('Check your mail'),
                  const SizedBox(height: 8),
                  Text('A recovery link is on its way',
                      style: TvTypography.headingLG(context)),
                  const SizedBox(height: 12),
                  Text(
                    'Open the message on the device that holds your vault '
                    'and follow the one-time link. The link expires after '
                    'thirty minutes.',
                    style: TvTypography.bodyMD(context).copyWith(fontSize: 13),
                  ),
                  const SizedBox(height: 20),
                  TvButton(
                    label: '← Back to sign in',
                    expanded: true,
                    onPressed: () => context.go('/login'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
