import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../data/models.dart';
import '../providers/providers.dart';
import '../theme/tv_theme.dart';
import '../widgets/widgets.dart';

/// Opens the m10 / 12_confirm_delete sheet.
void openConfirmDeleteSheet(BuildContext context, TvProperty property) {
  showModalBottomSheet<void>(
    context: context,
    backgroundColor: TvColors.ink,
    builder: (_) => _ConfirmDeleteSheet(property: property),
  );
}

class _ConfirmDeleteSheet extends StatefulWidget {
  const _ConfirmDeleteSheet({required this.property});

  final TvProperty property;

  @override
  State<_ConfirmDeleteSheet> createState() => _ConfirmDeleteSheetState();
}

class _ConfirmDeleteSheetState extends State<_ConfirmDeleteSheet> {
  bool _deleting = false;
  String? _error;

  Future<void> _confirm() async {
    setState(() => _deleting = true);
    final ok = await context.read<PropertiesProvider>().delete(widget.property.id);
    if (!mounted) return;
    if (ok) {
      Navigator.of(context).pop();
      context.go('/properties');
    } else {
      setState(() {
        _deleting = false;
        _error = context.read<PropertiesProvider>().error;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Plate(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(Icons.warning_amber_outlined, color: TvColors.delete, size: 34),
              const SizedBox(height: 10),
              const Eyebrow('Irrevocable action'),
              const SizedBox(height: 6),
              Text('Remove "${widget.property.name}" from the vault?',
                  style: TvTypography.headingMD(context)),
              const SizedBox(height: 10),
              Text(
                'The metadata record will be deleted from TerraVault. Files '
                'that were already written to your own Google Drive remain '
                'there — nothing in your Drive is removed.',
                style: TvTypography.bodyMD(context).copyWith(fontSize: 12),
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
                      label: 'Keep record',
                      variant: TvButtonVariant.outline,
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TvButton(
                      label: 'Delete forever',
                      variant: TvButtonVariant.danger,
                      loading: _deleting,
                      onPressed: _confirm,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
