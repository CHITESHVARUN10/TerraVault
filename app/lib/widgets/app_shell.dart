import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../providers/providers.dart';
import '../theme/tv_theme.dart';

/// The signed-in shell: top bar + drawer (m12) + bottom nav bar (m06),
/// hosting the tab branches via [StatefulNavigationRoute].
class AppShell extends StatelessWidget {
  const AppShell({required this.navigationShell, super.key});

  final StatefulNavigationShell navigationShell;

  static const _destinations = [
    ('Vault', Icons.lock_open_outlined), // dashboard
    ('Scan', Icons.document_scanner_outlined), // properties
    ('Secure', Icons.verified_user_outlined), // profile
    ('Log', Icons.history_edu_outlined), // contact
  ];

  void _goBranch(int index) {
    navigationShell.goBranch(
      index,
      initialLocation: index == navigationShell.currentIndex,
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;
    final initials = (user?.initials.isNotEmpty ?? false)
        ? user!.initials
        : 'TV';
    final currentIndex = navigationShell.currentIndex;

    return Scaffold(
      backgroundColor: TvColors.ink,
      drawer: const _TvDrawer(),
      appBar: AppBar(
        backgroundColor: TvColors.ink,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: Builder(
          builder: (ctx) => IconButton(
            icon: const Icon(Icons.menu, color: TvColors.onSurface),
            onPressed: () => Scaffold.of(ctx).openDrawer(),
          ),
        ),
        title: Text(
          'TERRAVAULT',
          style: TvTypography.labelUI(
            context,
          ).copyWith(letterSpacing: 4, color: TvColors.gold),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: GestureDetector(
              onTap: () => context.go('/profile'),
              behavior: HitTestBehavior.opaque,
              child: Center(
                child: CircleAvatar(
                  radius: 14,
                  backgroundColor: TvColors.plateInset,
                  child: Text(
                    initials,
                    style: TvTypography.labelUI(
                      context,
                    ).copyWith(color: TvColors.amber, fontSize: 11),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      body: navigationShell,
      bottomNavigationBar: NavigationBarTheme(
        data: NavigationBarThemeData(
          backgroundColor: TvColors.plate,
          indicatorColor: TvColors.hairlineHover,
          height: 62,
          labelTextStyle: WidgetStateProperty.resolveWith(
            (states) => TvTypography.labelUI(
              context,
            ).copyWith(fontSize: 10, letterSpacing: 1),
          ),
        ),
        child: NavigationBar(
          selectedIndex: currentIndex,
          onDestinationSelected: _goBranch,
          destinations: [
            for (final (i, d) in _destinations.indexed)
              NavigationDestination(
                icon: Icon(
                  d.$2,
                  color: currentIndex == i ? TvColors.amber : TvColors.outline,
                ),
                selectedIcon: Icon(d.$2, color: TvColors.amber),
                label: d.$1,
              ),
          ],
        ),
      ),
    );
  }
}

/// Slide-out drawer mirroring m12_mobile_navigation.
class _TvDrawer extends StatelessWidget {
  const _TvDrawer();

  static const _links = [
    ('Dashboard', Icons.lock_open_outlined, '/dashboard'),
    ('Properties', Icons.document_scanner_outlined, '/properties'),
    ('Contact', Icons.history_edu_outlined, '/contact'),
  ];

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;
    final route = GoRouterState.of(context).uri.path;
    final properties = context.watch<PropertiesProvider>();

    return Drawer(
      width: MediaQuery.of(context).size.width * 0.85,
      backgroundColor: TvColors.ink,
      shape: const Border(right: BorderSide(color: TvColors.hairline)),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
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
                  IconButton(
                    icon: const Icon(Icons.close, color: TvColors.onSurface),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
              const Divider(color: TvColors.hairline, height: 32),
              for (final (label, icon, path) in _links)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Icon(
                      icon,
                      color: route.startsWith(path)
                          ? TvColors.gold
                          : TvColors.outline,
                    ),
                    title: Text(
                      label,
                      style: TvTypography.headingSM(context).copyWith(
                        color: route.startsWith(path)
                            ? TvColors.onSurface
                            : TvColors.onSurfaceVariant,
                        fontSize: 22,
                      ),
                    ),
                    onTap: () {
                      Navigator.of(context).pop();
                      context.go(path);
                    },
                  ),
                ),
              const Spacer(),
              const Divider(color: TvColors.hairline),
              const SizedBox(height: 12),
              Row(
                children: [
                  CircleAvatar(
                    radius: 16,
                    backgroundColor: TvColors.plateInset,
                    child: Text(
                      user?.initials ?? 'TV',
                      style: TvTypography.labelUI(
                        context,
                      ).copyWith(color: TvColors.amber, fontSize: 12),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user?.name ?? '',
                          style: TvTypography.labelUI(context),
                        ),
                        Text(
                          '${properties.all.length} RECORDS · LOGGED IN',
                          style: TvTypography.eyebrow(
                            context,
                          ).copyWith(fontSize: 9, letterSpacing: 1.6),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextButton.icon(
                onPressed: () async {
                  Navigator.of(context).pop();
                  await context.read<AuthProvider>().logout();
                  if (context.mounted) context.go('/login');
                },
                icon: const Icon(Icons.logout, color: TvColors.amber, size: 18),
                label: Text(
                  'Sign out',
                  style: TvTypography.labelUI(
                    context,
                  ).copyWith(color: TvColors.amber),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
