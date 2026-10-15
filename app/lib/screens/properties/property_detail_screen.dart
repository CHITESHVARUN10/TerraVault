import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../data/api_client.dart';
import '../../data/property_service.dart';
import '../../data/models.dart';
import '../../providers/providers.dart';
import '../../theme/tv_theme.dart';
import '../../utils/geo.dart' show openInMaps;
import '../../sheets/add_document_sheet.dart';
import '../../sheets/add_visit_sheet.dart';
import '../../sheets/confirm_delete_sheet.dart';
import '../../widgets/widgets.dart';
import '../../widgets/property_card.dart'
    show formatArea, formatCoords, formatMoney;

/// 06_property_detail / m08 — metadata, documents, visits, map chip.
class PropertyDetailScreen extends StatefulWidget {
  const PropertyDetailScreen({super.key, required this.id});

  final String id;

  @override
  State<PropertyDetailScreen> createState() => _PropertyDetailScreenState();
}

class _PropertyDetailScreenState extends State<PropertyDetailScreen> {
  TvProperty? _property;
  bool _busy = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    if (!mounted) return;
    final properties = context.read<PropertiesProvider>();
    final cached = properties.byId(widget.id);
    if (cached != null) {
      setState(() => _property = cached);
      return;
    }
    try {
      final property = await PropertyService().get(widget.id);
      properties.replace(property);
      if (!mounted) return;
      setState(() => _property = property);
    } on TvApiException catch (e) {
      if (!mounted) return;
      setState(() => _error = e.message);
    }
  }

  Future<void> _reload() async {
    if (mounted) {
      setState(() => _busy = true);
    }
    final properties = context.read<PropertiesProvider>();
    try {
      final property = await PropertyService().get(widget.id);
      properties.replace(property);
      if (!mounted) return;
      setState(() => _property = property);
    } on TvApiException catch (e) {
      if (!mounted) return;
      setState(() => _error = e.message);
    } finally {
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final props = context.watch<PropertiesProvider>();
    final property = props.byId(widget.id) ?? _property;

    if (_error != null && property == null) {
      return _Chrome(
        child: Plate(
          child: Text(_error!,
              style:
                  TvTypography.bodyMD(context).copyWith(color: TvColors.error)),
        ),
      );
    }
    if (property == null) {
      return const _Chrome(
        child: Center(
          child: Padding(
            padding: EdgeInsets.all(40),
            child: CircularProgressIndicator(color: TvColors.amber),
          ),
        ),
      );
    }

    final p = property;
    return RefreshIndicator(
      color: TvColors.amber,
      onRefresh: _reload,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
        children: [
          Row(
            children: [
              TextButton(
                onPressed: () => context.go('/properties'),
                child: Text(
                  'Properties',
                  style: TvTypography.labelUI(context)
                      .copyWith(color: TvColors.amber, fontSize: 12),
                ),
              ),
              const Icon(Icons.chevron_right, color: TvColors.outlineVariant, size: 16),
              Expanded(
                child: Text(
                  p.name,
                  style: TvTypography.labelUI(context).copyWith(fontSize: 12),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Eyebrow(p.category),
          const SizedBox(height: 6),
          Text(p.name, style: TvTypography.headingLG(context)),
          const SizedBox(height: 4),
          Text(
            '${p.ownership} ownership · ${p.visits.length} visits logged',
            style: TvTypography.bodyMD(context).copyWith(fontSize: 13),
          ),
          const SizedBox(height: 16),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                TvButton(
                  label: '+ Document',
                  onPressed: () => openAddDocumentSheet(context, p, _reload),
                ),
                const SizedBox(width: 10),
                TvButton(
                  label: '+ Log visit',
                  variant: TvButtonVariant.outline,
                  onPressed: () => openAddVisitSheet(context, p, _reload),
                ),
                const SizedBox(width: 10),
                TvButton(
                  label: 'Delete',
                  variant: TvButtonVariant.danger,
                  onPressed: () => openConfirmDeleteSheet(context, p),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Map preview plate
          Plate(
            ticked: false,
            fill: TvColors.plateInset,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    PulsingPin(),
                    SizedBox(width: 10),
                    Spacer(),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Text(
                      formatCoords(p),
                      style: TvTypography.mono(context).copyWith(color: TvColors.gold),
                    ),
                    const Spacer(),
                    GestureDetector(
                      onTap: () => openInMaps(p.latitude, p.longitude),
                      child: Text(
                        'Open in maps ↗',
                        style: TvTypography.labelUI(context)
                            .copyWith(color: TvColors.amber, fontSize: 11),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Eyebrow('Documents'),
          const SizedBox(height: 10),
          if (p.documents.isEmpty)
            const DashedBox(
              child: Text(
                'No documents filed yet. Store the deed first.',
                textAlign: TextAlign.center,
              ),
            )
          else
            for (final doc in p.documents)
              _DocumentRow(
                property: p,
                document: doc,
                onChanged: _reload,
              ),
          const SizedBox(height: 24),
          const Eyebrow('Visits journal'),
          const SizedBox(height: 10),
          if (p.visits.isEmpty)
            const DashedBox(
              child: Text(
                'No visits logged yet. The journal starts with the first walk.',
                textAlign: TextAlign.center,
              ),
            )
          else
            for (final visit in p.visits)
              _VisitRow(property: p, visit: visit, onChanged: _reload),
          const SizedBox(height: 24),
          const Eyebrow('Metadata'),
          const SizedBox(height: 10),
          Plate(
            child: Column(
              children: [
                _metaRow(context, 'Category', p.category),
                _metaRow(context, 'Ownership', p.ownership),
                _metaRow(context, 'Total area', formatArea(p)),
                _metaRow(context, 'Purchase date', p.purchaseDate ?? '—'),
                _metaRow(context, 'Purchase price', formatMoney(p.purchasePrice)),
                _metaRow(context, 'Market value', formatMoney(p.marketValue)),
                _metaRow(context, 'Previous owner', p.previousOwner.isEmpty ? '—' : p.previousOwner),
                _metaRow(context, 'Coordinates', formatCoords(p)),
                const SizedBox(height: 6),
                const Divider(color: TvColors.hairline, height: 1),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        '${p.documents.length} DOCS',
                        style: TvTypography.eyebrow(context)
                            .copyWith(fontSize: 10, letterSpacing: 1.6),
                      ),
                    ),
                    Expanded(
                      child: Text(
                        '${p.visits.length} VISITS',
                        style: TvTypography.eyebrow(context)
                            .copyWith(fontSize: 10, letterSpacing: 1.6),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          if (p.notes.trim().isNotEmpty) ...[
            const SizedBox(height: 12),
            Plate(
              ticked: false,
              fill: TvColors.plateInset,
              child: Text(
                p.notes,
                style: TvTypography.bodyMD(context)
                    .copyWith(fontStyle: FontStyle.italic),
              ),
            ),
          ],
          if (_busy)
            const Padding(
              padding: EdgeInsets.only(top: 16),
              child: Center(
                child: SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(strokeWidth: 2, color: TvColors.amber),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _metaRow(BuildContext context, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label.toUpperCase(),
              style: TvTypography.eyebrow(context)
                  .copyWith(fontSize: 9, letterSpacing: 1.6, color: TvColors.amberDim),
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              value,
              style: TvTypography.value(context).copyWith(fontSize: 13),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}

/// Sticky top chrome shared by detail states (still inside the shell branches
/// so the bottom bar stays).
class _Chrome extends StatelessWidget {
  const _Chrome({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: TvColors.ink,
      appBar: AppBar(
        backgroundColor: TvColors.ink,
        surfaceTintColor: Colors.transparent,
        title: Text(
          'PROPERTIES',
          style: TvTypography.labelUI(context)
              .copyWith(letterSpacing: 4, color: TvColors.gold, fontSize: 12),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: TvColors.onSurface),
          onPressed: () => context.go('/properties'),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: child,
      ),
    );
  }
}

class _DocumentRow extends StatelessWidget {
  const _DocumentRow({
    required this.property,
    required this.document,
    required this.onChanged,
  });

  final TvProperty property;
  final TvDocument document;
  final VoidCallback onChanged;

  @override
  Widget build(BuildContext context) {
    final doc = document;
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Plate(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Row(
          children: [
            const Icon(Icons.description_outlined, color: TvColors.amber, size: 20),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    doc.name,
                    style: TvTypography.labelUI(context).copyWith(fontSize: 13),
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    '${doc.type} · ${doc.size} · ${doc.uploadedAt}',
                    style: TvTypography.bodyMD(context).copyWith(fontSize: 11),
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            IconButton(
              icon: const Icon(Icons.close, color: TvColors.delete, size: 18),
              onPressed: () => _remove(context),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _remove(BuildContext context) async {
    final properties = context.read<PropertiesProvider>();
    final updated =
        await PropertyService().removeDocument(property.id, document.id);
    properties.replace(updated);
    onChanged();
  }
}

class _VisitRow extends StatelessWidget {
  const _VisitRow({
    required this.property,
    required this.visit,
    required this.onChanged,
  });

  final TvProperty property;
  final TvVisit visit;
  final VoidCallback onChanged;

  @override
  Widget build(BuildContext context) {
    final v = visit;
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Plate(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              margin: const EdgeInsets.only(top: 6),
              width: 8,
              height: 8,
              decoration: const BoxDecoration(
                color: TvColors.amber,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Eyebrow(v.date),
                  if (v.note.trim().isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      v.note,
                      style: TvTypography.bodyMD(context)
                          .copyWith(fontStyle: FontStyle.italic, fontSize: 13),
                    ),
                  ],
                  const SizedBox(height: 4),
                  Text(
                    '${v.latitude.toStringAsFixed(4)}°N / ${v.longitude.toStringAsFixed(4)}°E',
                    style: TvTypography.mono(context).copyWith(fontSize: 11),
                  ),
                ],
              ),
            ),
            IconButton(
              icon: const Icon(Icons.close, color: TvColors.delete, size: 18),
              onPressed: () => _remove(context),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _remove(BuildContext context) async {
    final properties = context.read<PropertiesProvider>();
    final updated = await PropertyService().removeVisit(property.id, visit.id);
    properties.replace(updated);
    onChanged();
  }
}

/// A tiny pulsing marker for the map preview plate.
class PulsingPin extends StatefulWidget {
  const PulsingPin({super.key});

  @override
  State<PulsingPin> createState() => _PulsingPinState();
}

class _PulsingPinState extends State<PulsingPin>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 2),
  )..repeat(reverse: true);

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: Tween(begin: 0.4, end: 1.0).animate(_controller),
      child: const Icon(Icons.location_on_rounded, color: TvColors.amber, size: 24),
    );
  }
}
