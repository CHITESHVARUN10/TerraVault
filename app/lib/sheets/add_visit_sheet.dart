import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../data/property_service.dart';
import '../data/models.dart';
import '../providers/providers.dart';
import '../theme/tv_theme.dart';
import '../widgets/widgets.dart';

/// Opens the m16 / 11_log_visit sheet: date, GPS coords (prefilled from the
/// property), notes. Directional photo capture stubbed for v1.
void openAddVisitSheet(BuildContext context, TvProperty property) {
  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: TvColors.ink,
    builder: (_) => _AddVisitSheet(property: property),
  );
}

class _AddVisitSheet extends StatefulWidget {
  const _AddVisitSheet({required this.property});

  final TvProperty property;

  @override
  State<_AddVisitSheet> createState() => _AddVisitSheetState();
}

class _AddVisitSheetState extends State<_AddVisitSheet> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _lat = TextEditingController(
    text: widget.property.latitude == 0
        ? ''
        : widget.property.latitude.toStringAsFixed(4),
  );
  late final TextEditingController _lng = TextEditingController(
    text: widget.property.longitude == 0
        ? ''
        : widget.property.longitude.toStringAsFixed(4),
  );
  late final TextEditingController _notes = TextEditingController();
  late final TextEditingController _dateField = TextEditingController(
    text: _formatDate(DateTime.now()),
  );
  DateTime _date = DateTime.now();
  bool _saving = false;
  String? _error;

  @override
  void dispose() {
    _lat.dispose();
    _lng.dispose();
    _notes.dispose();
    _dateField.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _date,
      firstDate: DateTime(1900),
      lastDate: DateTime.now().add(const Duration(days: 1)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: Theme.of(context).colorScheme.copyWith(
              primary: TvColors.amber,
              surface: TvColors.plate,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        _date = picked;
        _dateField.text = _formatDate(picked);
      });
    }
  }

  Future<void> _save() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() {
      _saving = true;
      _error = null;
    });
    final body = {
      'date':
          '${_date.year.toString().padLeft(4, '0')}-'
          '${_date.month.toString().padLeft(2, '0')}-'
          '${_date.day.toString().padLeft(2, '0')}',
      'latitude': double.tryParse(_lat.text),
      'longitude': double.tryParse(_lng.text),
      'note': _notes.text.trim(),
    };
    try {
      final updated = await PropertyService().addVisit(
        widget.property.id,
        body,
      );
      if (!mounted) return;
      context.read<PropertiesProvider>().replace(updated);
      Navigator.of(context).pop();
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = 'Could not save the log. $e');
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: SingleChildScrollView(
            child: Plate(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        const Eyebrow('Physical protocol'),
                        const Spacer(),
                        IconButton(
                          icon: const Icon(
                            Icons.close,
                            size: 20,
                            color: TvColors.onSurface,
                          ),
                          onPressed: () => Navigator.of(context).pop(),
                        ),
                      ],
                    ),
                    Text('Log Visit', style: TvTypography.headingLG(context)),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: TvField(
                            label: 'Date',
                            controller: _dateField,
                            readOnly: true,
                            onTap: _pickDate,
                            prefixIcon: Icons.calendar_today_outlined,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: TvField(
                            label: 'Latitude',
                            controller: _lat,
                            keyboardType: const TextInputType.numberWithOptions(
                              decimal: true,
                              signed: true,
                            ),
                            validator: (v) =>
                                (v == null || double.tryParse(v) == null)
                                ? 'Coordinates required.'
                                : null,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: TvField(
                            label: 'Longitude',
                            controller: _lng,
                            keyboardType: const TextInputType.numberWithOptions(
                              decimal: true,
                              signed: true,
                            ),
                            validator: (v) =>
                                (v == null || double.tryParse(v) == null)
                                ? 'Coordinates required.'
                                : null,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    TvField(
                      label: 'Notes',
                      controller: _notes,
                      maxLines: 4,
                      hint: 'What changed? What did you notice?',
                    ),
                    const SizedBox(height: 12),
                    Plate(
                      ticked: false,
                      fill: TvColors.plateInset,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 10,
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.photo_camera_outlined,
                            color: TvColors.amber,
                            size: 20,
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              '5 directional photos (standing, north, east, '
                              'south, west) will attach to this visit.',
                              style: TvTypography.bodyMD(
                                context,
                              ).copyWith(fontSize: 11),
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (_error != null) ...[
                      const SizedBox(height: 10),
                      Text(
                        _error!,
                        style: TvTypography.bodyMD(
                          context,
                        ).copyWith(color: TvColors.error, fontSize: 12),
                      ),
                    ],
                    const SizedBox(height: 16),
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
                            label: 'Save log',
                            loading: _saving,
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
        ),
      ),
    );
  }

  String _formatDate(DateTime d) => '${d.day} ${_month(d.month)} ${d.year}';

  String _month(int m) => switch (m) {
    1 => 'Jan',
    2 => 'Feb',
    3 => 'Mar',
    4 => 'Apr',
    5 => 'May',
    6 => 'Jun',
    7 => 'Jul',
    8 => 'Aug',
    9 => 'Sep',
    10 => 'Oct',
    11 => 'Nov',
    _ => 'Dec',
  };
}
