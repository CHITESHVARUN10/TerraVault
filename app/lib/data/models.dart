/// Domain models mirroring the TerraVault backend responses.
///
/// The backend serializes Mongo documents with `_id`; all `id` lookups
/// fall back to `_id`.
String _resolveId(Map<String, dynamic> j) =>
    (j['id'] ?? j['_id'])?.toString() ?? '';

class TvUser {
  final String id;
  final String name;
  final String email;
  final String initials;
  final String? joinedAt;
  final String plan;

  const TvUser({
    required this.id,
    required this.name,
    required this.email,
    required this.initials,
    required this.plan,
    this.joinedAt,
  });

  factory TvUser.fromJson(Map<String, dynamic> j) => TvUser(
        id: _resolveId(j),
        name: j['name']?.toString() ?? '',
        email: j['email']?.toString() ?? '',
        initials: j['initials']?.toString() ?? '',
        plan: j['plan']?.toString() ?? 'Free',
        joinedAt: j['joinedAt']?.toString(),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'initials': initials,
        'joinedAt': joinedAt,
        'plan': plan,
      };
}

class TvDocument {
  final String id;
  final String name;
  final String type;
  final String uploadedAt;
  final String size;
  final String driveFileId;

  const TvDocument({
    required this.id,
    required this.name,
    required this.type,
    required this.uploadedAt,
    required this.size,
    required this.driveFileId,
  });

  factory TvDocument.fromJson(Map<String, dynamic> j) => TvDocument(
        id: _resolveId(j),
        name: j['name']?.toString() ?? '',
        type: j['type']?.toString() ?? '',
        uploadedAt: j['uploadedAt']?.toString() ?? '',
        size: j['size']?.toString() ?? '',
        driveFileId: j['driveFileId']?.toString() ?? '',
      );
}

class TvVisit {
  final String id;
  final String date;
  final String note;
  final double latitude;
  final double longitude;

  const TvVisit({
    required this.id,
    required this.date,
    required this.note,
    required this.latitude,
    required this.longitude,
  });

  factory TvVisit.fromJson(Map<String, dynamic> j) => TvVisit(
        id: _resolveId(j),
        date: j['date']?.toString() ?? '',
        note: j['note']?.toString() ?? '',
        latitude: _toNum(j['latitude']).toDouble(),
        longitude: _toNum(j['longitude']).toDouble(),
      );

  static num _toNum(Object? v) =>
      v is num ? v : num.tryParse(v?.toString() ?? '') ?? 0;
}

class TvProperty {
  final String id;
  final String name;
  final String category;
  final String ownership;
  final String? purchaseDate;
  final double purchasePrice;
  final double area;
  final String areaUnit;
  final double marketValue;
  final String previousOwner;
  final String notes;
  final double latitude;
  final double longitude;
  final List<TvDocument> documents;
  final List<TvVisit> visits;

  const TvProperty({
    required this.id,
    required this.name,
    required this.category,
    required this.ownership,
    required this.purchasePrice,
    required this.area,
    required this.areaUnit,
    required this.marketValue,
    required this.previousOwner,
    required this.notes,
    required this.latitude,
    required this.longitude,
    required this.documents,
    required this.visits,
    this.purchaseDate,
  });

  factory TvProperty.fromJson(Map<String, dynamic> j) {
    final docs = j['documents'] as List<dynamic>? ?? const [];
    final visits = j['visits'] as List<dynamic>? ?? const [];
    return TvProperty(
      id: _resolveId(j),
      name: j['name']?.toString() ?? '',
      category: j['category']?.toString() ?? '',
      ownership: j['ownership']?.toString() ?? '',
      purchaseDate: j['purchaseDate']?.toString(),
      purchasePrice: TvVisit._toNum(j['purchasePrice']).toDouble(),
      area: TvVisit._toNum(j['area']).toDouble(),
      areaUnit: j['areaUnit']?.toString() ?? '',
      marketValue: TvVisit._toNum(j['marketValue']).toDouble(),
      previousOwner: j['previousOwner']?.toString() ?? '',
      notes: j['notes']?.toString() ?? '',
      latitude: TvVisit._toNum(j['latitude']).toDouble(),
      longitude: TvVisit._toNum(j['longitude']).toDouble(),
      documents: docs.map((d) => TvDocument.fromJson(d)).toList(),
      visits: visits.map((v) => TvVisit.fromJson(v)).toList(),
    );
  }

  Map<String, dynamic> toMetadataJson() => {
        'name': name,
        'category': category,
        'ownership': ownership,
        'purchaseDate': purchaseDate,
        'purchasePrice': purchasePrice,
        'area': area,
        'areaUnit': areaUnit,
        'marketValue': marketValue,
        'previousOwner': previousOwner,
        'notes': notes,
        'latitude': latitude,
        'longitude': longitude,
      };
}

class DriveStatus {
  final bool connected;
  final String? email;
  final String? folderName;
  final String? connectedAt;

  const DriveStatus({
    required this.connected,
    this.email,
    this.folderName,
    this.connectedAt,
  });

  factory DriveStatus.fromJson(Map<String, dynamic> j) => DriveStatus(
        connected: j['connected'] == true,
        email: j['email']?.toString(),
        folderName: j['folderName']?.toString(),
        connectedAt: j['connectedAt']?.toString(),
      );
}

/// Enumerations shared with the web app / backend.
abstract class TvEnums {
  static const categories = [
    'Agricultural Land',
    'Residential Plot',
    'Commercial Property',
    'Open Land',
    'Farm',
    'Industrial Land',
    'Other',
  ];

  static const categoriesForFilter = [
    'Agricultural',
    'Residential',
    'Commercial',
    'Industrial',
  ];

  static const ownershipTypes = [
    'Purchased',
    'Inherited',
    'Gifted',
    'Trust',
    'Court Transfer',
  ];

  static const documentTypes = [
    'Ownership Deed',
    'Inheritance Document',
    'Will',
    'Trust Document',
    'Survey Map',
    'Property Tax Receipt',
    'Chain of Ownership',
    'Court Order',
    'Other',
  ];

  static const areaUnits = ['acres', 'hectares', 'sqft', 'sqm', 'guntha', 'bigha'];

  static String areaUnitLabel(String unit) {
    switch (unit) {
      case 'acres':
        return 'Acres';
      case 'hectares':
        return 'Hectares';
      case 'sqft':
        return 'Sq Ft';
      case 'sqm':
        return 'Sq M';
      case 'guntha':
        return 'Guntha';
      case 'bigha':
        return 'Bigha';
      default:
        return unit;
    }
  }
}
