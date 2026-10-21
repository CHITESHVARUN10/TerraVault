import 'package:go_router/go_router.dart';

import '../providers/providers.dart';
import '../screens/auth/check_email_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/auth/reset_password_screen.dart';
import '../screens/contact/contact_screen.dart';
import '../screens/dashboard/dashboard_screen.dart';
import '../screens/landing/landing_screen.dart';
import '../screens/not_found/not_found_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/properties/properties_screen.dart';
import '../screens/properties/property_detail_screen.dart';
import '../widgets/app_shell.dart';

GoRouter buildRouter(AuthProvider auth) {
  return GoRouter(
    initialLocation: '/',
    refreshListenable: auth,
    redirect: (context, state) {
      final authenticated = auth.isAuthenticated;
      final isAuthRoute = [
        '/login',
        '/register',
        '/reset-password',
        '/check-email',
      ].any(state.matchedLocation.startsWith);
      final isProtected =
          !isAuthRoute &&
          state.matchedLocation != '/' &&
          state.matchedLocation != '/not-found';

      if (isProtected && !authenticated) return '/login';
      if (isAuthRoute && authenticated) return '/dashboard';
      return null;
    },
    routes: [
      GoRoute(path: '/', builder: (context, state) => const LandingScreen()),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/reset-password',
        builder: (context, state) => const ResetPasswordScreen(),
      ),
      GoRoute(
        path: '/check-email',
        builder: (context, state) => const CheckEmailScreen(),
      ),
      GoRoute(
        path: '/not-found',
        builder: (context, state) => const NotFoundScreen(),
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) =>
            AppShell(navigationShell: navigationShell),
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/dashboard',
                builder: (context, state) => const DashboardScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/properties',
                builder: (context, state) => const PropertiesScreen(),
                routes: [
                  GoRoute(
                    path: ':id',
                    builder: (context, state) =>
                        PropertyDetailScreen(id: state.pathParameters['id']!),
                  ),
                ],
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/profile',
                builder: (context, state) => const ProfileScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/contact',
                builder: (context, state) => const ContactScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
    errorBuilder: (context, state) => const NotFoundScreen(),
  );
}
