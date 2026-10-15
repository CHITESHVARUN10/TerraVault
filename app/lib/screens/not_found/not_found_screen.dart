import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../theme/tv_theme.dart';
import '../../widgets/widgets.dart';

/// 15_page_not_found / m13_lost_ground.
class NotFoundScreen extends StatelessWidget {
  const NotFoundScreen({super.key});

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
                  Text('072', style: TvTypography.headingXL(context)
                      .copyWith(color: TvColors.amberDim)),
                  const SizedBox(height: 6),
                  const Eyebrow('Lost ground'),
                  const SizedBox(height: 8),
                  Text('This coordinate is outside the survey.',
                      style: TvTypography.headingLG(context)),
                  const SizedBox(height: 12),
                  Text(
                    'The route you followed does not resolve to a record in '
                    'this vault. Return to firm ground and try again.',
                    style: TvTypography.bodyMD(context).copyWith(fontSize: 13),
                  ),
                  const SizedBox(height: 20),
                  TvButton(
                    label: '← Back to the vault',
                    expanded: true,
                    onPressed: () => context.go('/dashboard'),
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
