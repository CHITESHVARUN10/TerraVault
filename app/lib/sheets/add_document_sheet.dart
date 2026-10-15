import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../data/property_service.dart';
import '../data/models.dart';
import '../providers/providers.dart';
import '../theme/tv_theme.dart';
import '../widgets/widgets.dart';

/// Opens the m15 / 10_add_document sheet. Uploads to the property's Drive
/// folder when Drive is connected (fallback: metadata-only record).
void openAddDocumentSheet(
  BuildContext context,
  TvProperty property,
  VoidCallback onChanged,
) {
  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: TvColors.ink,
    builder: (_) => _AddDocumentSheet(property: property, onChanged: onChanged),
  );
}

class _AddDocumentSheet extends StatefulWidget {
  const _AddDocumentSheet({required this.property, required this.onChanged});

  final TvProperty property;
  final VoidCallback onChanged;

  @override
  State<_AddDocumentSheet> createState() => _AddDocumentSheetState();
}

class _AddDocumentSheetState extends State<_AddDocumentSheet> {
  String _type = TvEnums.documentTypes.first;
  PlatformFile? _file;
  bool _uploading = false;
  String? _error;

  Future<void> _pickFile() async {
    final files = await FilePicker.pickFiles();
    if (files.isNotEmpty) {
      setState(() => _file = files.first);
    }
  }

  Future<void> _save() async {
    setState(() {
      _uploading = true;
      _error = null;
    });
    try {
      TvProperty updated;
      if (_file != null && _file!.path != null) {
        updated = await PropertyService().uploadDocument(
          widget.property.id,
          filePath: _file!.path!,
          fileName: _file!.name,
          type: _type,
        );
      } else {
        updated = await PropertyService().addDocumentMetadata(
          widget.property.id,
          {'name': _file?.name ?? '$_type.pdf', 'type': _type},
        );
      }
      if (!mounted) return;
      context.read<PropertiesProvider>().replace(updated);
      Navigator.of(context).pop();
      widget.onChanged();
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _uploading = false);
    }
  }

  String _fileSizeLabel(PlatformFile file) {
    try {
      final bytes = file.lengthSync();
      if (bytes == null) return '';
      return bytes >= 1024 * 1024
          ? '${(bytes / 1024 / 1024).toStringAsFixed(1)} MB'
          : '${(bytes / 1024).toStringAsFixed(0)} KB';
    } catch (_) {
      return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: SingleChildScrollView(
            child: Plate(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    children: [
                      const Eyebrow('File repository'),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.close, size: 20, color: TvColors.onSurface),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    ],
                  ),
                  Text('Add Document', style: TvTypography.headingLG(context)),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    initialValue: _type,
                    dropdownColor: TvColors.plate,
                    decoration: const InputDecoration(labelText: 'Document Type'),
                    style: TvTypography.bodyLG(context).copyWith(fontSize: 13),
                    items: [
                      for (final t in TvEnums.documentTypes)
                        DropdownMenuItem(
                          value: t,
                          child: Text(t, style: TvTypography.bodyLG(context).copyWith(fontSize: 13)),
                        ),
                    ],
                    onChanged: (v) => setState(() => _type = v ?? _type),
                  ),
                  const SizedBox(height: 14),
                  DashedBox(
                    child: _file == null
                        ? Column(
                            children: [
                              const Icon(Icons.cloud_upload_outlined,
                                  color: TvColors.amber, size: 28),
                              const SizedBox(height: 8),
                              Text(
                                'Choose a file to store',
                                style: TvTypography.bodyMD(context).copyWith(fontSize: 12),
                              ),
                              const SizedBox(height: 10),
                              TvButton(
                                label: 'Browse file',
                                variant: TvButtonVariant.outline,
                                onPressed: _pickFile,
                              ),
                            ],
                          )
                        : Row(
                            children: [
                              const Icon(Icons.description_outlined,
                                  color: TvColors.amber, size: 22),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      _file!.name,
                                      style: TvTypography.labelUI(context)
                                          .copyWith(fontSize: 12),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    Text(
                                      _fileSizeLabel(_file!),
                                      style: TvTypography.bodyMD(context)
                                          .copyWith(fontSize: 11),
                                    ),
                                  ],
                                ),
                              ),
                              TextButton(
                                onPressed: _pickFile,
                                child: Text(
                                  'Change file',
                                  style: TvTypography.labelUI(context)
                                      .copyWith(color: TvColors.amber, fontSize: 11),
                                ),
                              ),
                            ],
                          ),
                  ),
                  if (_error != null) ...[
                    const SizedBox(height: 10),
                    Text(
                      _error!,
                      style: TvTypography.bodyMD(context)
                          .copyWith(color: TvColors.error, fontSize: 12),
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
                          label: 'Store in Vault',
                          loading: _uploading,
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
    );
  }
}
