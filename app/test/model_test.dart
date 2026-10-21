import 'package:flutter_test/flutter_test.dart';
import 'package:app/data/models.dart';
import 'package:app/data/api_client.dart';

void main() {
  test('TvProperty parses a backend property payload', () {
    final property = TvProperty.fromJson(<String, dynamic>{
      'name': 'Village Property',
      'category': 'Agricultural Land',
      'ownership': 'Purchased',
      'purchasePrice': 450000,
      'area': 1.5,
      'areaUnit': 'acres',
      'marketValue': 1200000,
      'latitude': 27.12,
      'longitude': 78.0012,
      'documents': [
        <String, dynamic>{
          'id': 'd1',
          'name': 'Ownership.pdf',
          'type': 'Ownership Deed',
          'uploadedAt': '2021-10-12',
          'size': '2.4 MB',
        },
      ],
      'visits': [
        <String, dynamic>{
          'id': 'v1',
          'date': '2024-03-15',
          'note': 'Boundary walk',
          'latitude': 27.1205,
          'longitude': 78.0012,
        },
      ],
    });

    expect(property.name, 'Village Property');
    expect(property.documents, hasLength(1));
    expect(property.visits.first.note, 'Boundary walk');
    expect(TvEnums.areaUnitLabel(property.areaUnit), 'Acres');
  });

  test('TvApiClient unwraps the properties envelope', () {
    final list = TvApiClient.instance.asPropertyList(<String, dynamic>{
      'properties': [
        <String, dynamic>{'name': 'A', 'area': 1, 'areaUnit': 'acres'},
      ],
    });
    expect(list, hasLength(1));
    expect(list.first.name, 'A');
  });
}
