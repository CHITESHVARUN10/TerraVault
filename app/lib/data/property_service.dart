import 'api_client.dart';
import 'models.dart';

class PropertyService {
  final TvApiClient _client = TvApiClient.instance;

  Future<List<TvProperty>> list() async {
    return _client.asPropertyList(await _client.get('/properties'));
  }

  Future<TvProperty> get(String id) async {
    return _client.asProperty(await _client.get('/properties/$id'));
  }

  Future<TvProperty> create(Map<String, dynamic> body) async {
    return _client.asProperty(await _client.post('/properties', body: body));
  }

  Future<TvProperty> update(String id, Map<String, dynamic> body) async {
    return _client.asProperty(
      await _client.patch('/properties/$id', body: body),
    );
  }

  Future<void> delete(String id) async {
    await _client.delete('/properties/$id');
  }

  Future<TvProperty> addDocumentMetadata(
    String id,
    Map<String, dynamic> body,
  ) async {
    return _client.asProperty(
      await _client.post('/properties/$id/documents', body: body),
    );
  }

  Future<TvProperty> removeDocument(String id, String docId) async {
    return _client.asProperty(
      await _client.delete('/properties/$id/documents/$docId'),
    );
  }

  /// Uploads a real file to the property's Drive folder when Drive is
  /// connected; otherwise records the document metadata in MongoDB only.
  Future<TvProperty> uploadDocument(
    String id, {
    required String filePath,
    required String fileName,
    required String type,
  }) async {
    try {
      final data = await _client.upload(
        '/drive/properties/$id/documents/upload',
        filePath: filePath,
        fileName: fileName,
        type: type,
      );
      final map = _client.asMap(data) ?? const {};
      if (map['property'] is Map<String, dynamic>) {
        return TvProperty.fromJson(map['property'] as Map<String, dynamic>);
      }
      return _client.asProperty(data);
    } on TvApiException catch (e) {
      final isDriveMissing =
          e.statusCode == 400 &&
          e.message.toLowerCase().contains('drive is not connected');
      if (!isDriveMissing) rethrow;
      return addDocumentMetadata(id, {'name': fileName, 'type': type});
    }
  }

  Future<TvProperty> addVisit(String id, Map<String, dynamic> body) async {
    return _client.asProperty(
      await _client.post('/properties/$id/visits', body: body),
    );
  }

  Future<TvProperty> removeVisit(String id, String visitId) async {
    return _client.asProperty(
      await _client.delete('/properties/$id/visits/$visitId'),
    );
  }
}

class DriveService {
  final TvApiClient _client = TvApiClient.instance;

  Future<DriveStatus> status() async {
    final data = await _client.get('/drive/status');
    final map = _client.asMap(data) ?? const <String, dynamic>{};
    return DriveStatus.fromJson(map);
  }

  Future<void> disconnect() async {
    await _client.post('/drive/disconnect');
  }
}
