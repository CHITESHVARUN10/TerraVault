import 'package:url_launcher/url_launcher.dart';

/// Launches the native map apps (Apple Maps on iOS, Google Maps on Android)
/// for navigation to a coordinate — per PRD §8.6.
Future<void> openInMaps(double latitude, double longitude) async {
  final uri = Uri.parse(
    'https://www.google.com/maps/search/?api=1&query=$latitude,$longitude',
  );
  await launchUrl(uri, mode: LaunchMode.externalApplication);
}
