import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:path_provider/path_provider.dart';

import '../config.dart';
import 'models.dart';

/// Thrown by services when the backend returns an error payload.
class TvApiException implements Exception {
  final String message;
  final int? statusCode;
  const TvApiException(this.message, {this.statusCode});

  @override
  String toString() => message;
}

class TvApiClient {
  TvApiClient._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.apiBaseUrl,
        connectTimeout: const Duration(seconds: 12),
        receiveTimeout: const Duration(seconds: 20),
        headers: {'Accept': 'application/json'},
      ),
    );
  }

  static final TvApiClient instance = TvApiClient._internal();

  late final Dio _dio;
  PersistCookieJar? get cookieJar => _jar;
  PersistCookieJar? _jar;

  /// Wires the persistent cookie jar. Call once from main() before any
  /// request so the session cookie survives restarts.
  Future<void> init() async {
    if (_jar != null || kIsWeb) return;
    final dir = (await getApplicationDocumentsDirectory()).path;
    _jar = PersistCookieJar(ignoreExpires: true, storage: FileStorage('$dir/.cookies/'));
    _dio.interceptors.add(CookieManager(_jar!));
  }

  /// Unwraps `{user}` / `{property}` / `{properties}` style envelopes and
  /// converts Dio failures into [TvApiException].
  TvApiException _fromDioError(DioException e) {
    final data = e.response?.data;
    String message = 'Request failed. Check your connection and the backend.';
    if (data is Map<String, dynamic> && data['error'] is String) {
      message = data['error'] as String;
    } else if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.connectionError) {
      message = 'Cannot reach the TerraVault backend.';
    }
    return TvApiException(message, statusCode: e.response?.statusCode);
  }

  dynamic get(String path, {Map<String, dynamic>? query}) async {
    try {
      final res = await _dio.get<dynamic>(path, queryParameters: query);
      return res.data;
    } on DioException catch (e) {
      throw _fromDioError(e);
    }
  }

  dynamic post(String path, {Object? body, Map<String, dynamic>? query}) async {
    try {
      final res = await _dio.post<dynamic>(path,
          data: body, queryParameters: query);
      return res.data;
    } on DioException catch (e) {
      throw _fromDioError(e);
    }
  }

  dynamic patch(String path, {Object? body}) async {
    try {
      final res = await _dio.patch<dynamic>(path, data: body);
      return res.data;
    } on DioException catch (e) {
      throw _fromDioError(e);
    }
  }

  dynamic delete(String path) async {
    try {
      final res = await _dio.delete<dynamic>(path);
      return res.data;
    } on DioException catch (e) {
      throw _fromDioError(e);
    }
  }

  dynamic upload(String path, {required String filePath, required String fileName, required String type}) async {
    try {
      final form = FormData.fromMap({
        'type': type,
        'file': await MultipartFile.fromFile(filePath, filename: fileName),
      });
      final res = await _dio.post<dynamic>(path, data: form);
      return res.data;
    } on DioException catch (e) {
      throw _fromDioError(e);
    }
  }

  Map<String, dynamic>? asMap(dynamic data) => data is Map<String, dynamic> ? data : null;

  List<TvProperty> asPropertyList(dynamic data) {
    final m = asMap(data);
    final list = m?['properties'] as List<dynamic>? ?? const [];
    return list.map((p) => TvProperty.fromJson(p)).toList();
  }

  TvProperty asProperty(dynamic data) {
    final m = asMap(data);
    return TvProperty.fromJson((m?['property'] ?? m) ?? <String, dynamic>{});
  }
}
