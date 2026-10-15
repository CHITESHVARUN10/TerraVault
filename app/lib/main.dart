import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'data/api_client.dart';
import 'providers/providers.dart';
import 'routing/app_router.dart';
import 'theme/tv_theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await TvApiClient.instance.init();

  final auth = AuthProvider();
  await auth.bootstrap();

  runApp(TerraVaultApp(auth: auth));
}

class TerraVaultApp extends StatelessWidget {
  const TerraVaultApp({required this.auth, super.key});

  final AuthProvider auth;

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<AuthProvider>.value(value: auth),
        ChangeNotifierProvider<PropertiesProvider>(
          create: (_) => PropertiesProvider(),
        ),
        ChangeNotifierProvider<DriveProvider>(create: (_) => DriveProvider()),
      ],
      child: MaterialApp.router(
        title: 'TerraVault',
        debugShowCheckedModeBanner: false,
        theme: buildTvTheme(),
        routerConfig: buildRouter(auth),
      ),
    );
  }
}
