import 'api_client.dart';
import 'models.dart';

class AuthService {
  final TvApiClient _client = TvApiClient.instance;

  Future<TvUser> register(String name, String email, String password) async {
    final data = await _client.post(
      '/auth/register',
      body: {'name': name, 'email': email, 'password': password},
    );
    final map = _client.asMap(data) ?? const {};
    return TvUser.fromJson(map['user'] as Map<String, dynamic>);
  }

  Future<TvUser> login(String email, String password) async {
    final data = await _client.post(
      '/auth/login',
      body: {'email': email, 'password': password},
    );
    final map = _client.asMap(data) ?? const {};
    return TvUser.fromJson(map['user'] as Map<String, dynamic>);
  }

  /// Returns null when there is no saved session.
  Future<TvUser?> me() async {
    final data = await _client.get('/auth/me');
    final map = _client.asMap(data);
    final user = map?['user'];
    if (user is Map<String, dynamic>) return TvUser.fromJson(user);
    return null;
  }

  Future<void> logout() async {
    await _client.post('/auth/logout');
    await TvApiClient.instance.cookieJar?.deleteAll();
  }
}
