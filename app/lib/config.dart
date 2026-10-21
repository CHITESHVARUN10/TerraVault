import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class AppConfig {
  /// Android emulator reaches host machine via 10.0.2.2; iOS simulator via
  /// localhost. Port 4100: 4000 is occupied by another local project.
  static const String androidDeployedBaseUrl = 'http://10.0.2.2:4100';
  static const String iosBaseUrl = 'http://localhost:4100';

  static const String apiPath = '/api';

  static const String appName = 'TERRAVAULT';

  static String get baseUrl {
    if (kIsWeb) return iosBaseUrl;
    try {
      if (Platform.isAndroid) return androidDeployedBaseUrl;
    } catch (_) {}
    return iosBaseUrl;
  }

  static String get apiBaseUrl => '$baseUrl$apiPath';

  static String get driveConnectUrl =>
      '$apiBaseUrl/drive/connect?state=/dashboard';
}
