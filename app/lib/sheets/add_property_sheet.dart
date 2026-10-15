import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../data/models.dart';
import '../providers/providers.dart';
import '../theme/tv_theme.dart';
import '../widgets/widgets.dart';

/// Opens the m17 / 09_add_property registration sheet.
void openAddPropertySheet(BuildContext context) {
  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: TvColors.ink,
    builder: (_) => const _AddPropertySheet(),
  );
}

class _AddPropertySheet extends StatefulWidget {
  const _AddPropertySheet();

  @override
  State<_AddPropertySheet> createState() => _AddPropertySheetState();
}

class _AddPropertySheetState extends State<_AddPropertySheet> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _area = TextEditingController();
  final _purchaseDate = TextEditingController();
  final _purchasePrice = TextEditingController();
  final _marketValue = TextEditingController();
  final _previousOwner = TextEditingController();
  final _latitude = TextEditingController();
  final _longitude = TextEditingController();
  final _notes = TextEditingController();

  String _category = TvEnums.categories.first;
  String _ownership = TvEnums.ownershipTypes.first;
  String _areaUnit = TvEnums.areaUnits[2];

  @override
  void dispose() {
    for (final c in [
      _name, _area, _purchaseDate, _purchasePrice, _marketValue,
      _previousOwner, _latitude, _longitude, _notes,
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: now,
      firstDate: DateTime(1900),
      lastDate: now.add(const Duration(days: 1)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: Theme.of(context)
                .colorScheme
                .copyWith(primary: TvColors.amber, surface: TvColors.plate),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      _purchaseDate.text =
          '${picked.year.toString().padLeft(4, '0')}-'
          '${picked.month.toString().padLeft(2, '0')}-'
          '${picked.day.toString().padLeft(2, '0')}';
      setState(() {});
    }
  }

  Future<void> _save() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    final body = {
      'name': _name.text.trim(),
      'category': _category,
      'ownership': _ownership,
      'area': double.tryParse(_area.text) ?? 0,
      'areaUnit': _areaUnit,
      'purchaseDate': _purchaseDate.text.isEmpty ? null : _purchaseDate.text,
      'purchasePrice': double.tryParse(_purchasePrice.text) ?? 0,
      'marketValue': double.tryParse(_marketValue.text) ?? 0,
      'previousOwner': _previousOwner.text.trim(),
      'notes': _notes.text.trim(),
      'latitude': double.tryParse(_latitude.text),
      'longitude': double.tryParse(_longitude.text),
    };

    final ok = await context.read<PropertiesProvider>().create(body);
    if (!mounted) return;
    if (ok) {
      await context.read<PropertiesProvider>().refresh();
      if (mounted) Navigator.of(context).pop();
    } else {
      final err = context.read<PropertiesProvider>().error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: TvColors.plate,
          content: Text(err ?? 'Could not save the record.',
              style: TvTypography.bodyMD(context)
                  .copyWith(color: TvColors.error, fontSize: 12)),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: ConstrainedBox(
        constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.92),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Column(
              children: [
                Row(
                  children: [
                    const Eyebrow('Registry'),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.close, color: TvColors.onSurface, size: 20),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ],
                ),
                Text('Add Property', style: TvTypography.headingLG(context)),
                const SizedBox(height: 12),
                Expanded(
                  child: Form(
                    key: _formKey,
                    child: ListView(
                      padding: const EdgeInsets.only(bottom: 8),
                      children: [
                        TvField(
                          label: 'Name *',
                          controller: _name,
                          validator: (v) =>
                              (v == null || v.trim().isEmpty) ? 'The record needs a name.' : null,
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: _dropdown(
                                'Category *',
                                TvEnums.categories,
                                _category,
                                (v) => setState(() => _category = v!),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: _dropdown(
                                'Ownership *',
                                TvEnums.ownershipTypes,
                                _ownership,
                                (v) => setState(() => _ownership = v!),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              flex: 2,
                              child: TvField(
                                label: 'Total Area *',
                                controller: _area,
                                keyboardType:
                                    const TextInputType.numberWithOptions(decimal: true),
                                validator: (v) => (v == null ||
                                        v.trim().isEmpty ||
                                        double.tryParse(v) == null)
                                    ? 'Numeric area required.'
                                    : null,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: _dropdown(
                                'Unit',
                                TvEnums.areaUnits,
                                _areaUnit,
                                (v) => setState(() => _areaUnit = v!),
                                labelBuilder: TvEnums.areaUnitLabel,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: TvField(
                                label: 'Purchase Price (₹)',
                                controller: _purchasePrice,
                                keyboardType:
                                    const TextInputType.numberWithOptions(decimal: true),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: TvField(
                                label: 'Market Value (₹)',
                                controller: _marketValue,
                                keyboardType:
                                    const TextInputType.numberWithOptions(decimal: true),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: TvField(
                                label: 'Purchase Date',
                                controller: _purchaseDate,
                                readOnly: true,
                                onTap: _pickDate,
                                prefixIcon: Icons.calendar_today_outlined,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: TvField(
                                label: 'Previous Owner',
                                controller: _previousOwner,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Plate(
                          ticked: false,
                          fill: TvColors.plateInset,
                          padding: const EdgeInsets.all(12),
                          child: Column(
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: TvField(
                                      label: 'Latitude *',
                                      controller: _latitude,
                                      keyboardType: const TextInputType
                                          .numberWithOptions(decimal: true, signed: true),
                                      validator: (v) => (v == null ||
                                              double.tryParse(v) == null)
                                          ? 'Coordinate precision required.'
                                          : null,
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: TvField(
                                      label: 'Longitude *',
                                      controller: _longitude,
                                      keyboardType: const TextInputType
                                          .numberWithOptions(decimal: true, signed: true),
                                      validator: (v) => (v == null ||
                                              double.tryParse(v) == null)
                                          ? 'Coordinate precision required.'
                                          : null,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 10),
                        TvField(
                          label: 'Notes',
                          controller: _notes,
                          maxLines: 3,
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TvButton(
                        label: 'Cancel',
                        variant: TvButtonVariant.outline,
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TvButton(
                        label: 'Save Record',
                        onPressed: _save,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _dropdown(
    String label,
    List<String> items,
    String value,
    ValueChanged<String?> onChanged, {
    String Function(String)? labelBuilder,
  }) {
    return DropdownButtonFormField<String>(
      initialValue: value,
      dropdownColor: TvColors.plate,
      decoration: InputDecoration(
        labelText: label,
      ),
      style: TvTypography.bodyLG(context),
      items: [
        for (final item in items)
          DropdownMenuItem(
            value: item,
            child: Text(
              labelBuilder != null ? labelBuilder(item) : item,
              style: TvTypography.bodyLG(context).copyWith(fontSize: 13),
            ),
          ),
      ],
      onChanged: onChanged,
    );
  }
}
