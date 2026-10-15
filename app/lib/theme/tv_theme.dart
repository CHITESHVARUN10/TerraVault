import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// TerraVault "dark golden archive" design tokens, extracted from the
/// stitch screens + frontend design system.
abstract class TvColors {
  static const ink = Color(0xFF0C0B09); // page background
  static const plate = Color(0xFF1A1813); // card background
  static const plateInset = Color(0xFF14120E); // darker inset plates
  static const fieldFill = Color(0xFF1E1B16); // filled inputs
  static const hairline = Color(0xFF241F17); // card borders
  static const hairlineHover = Color(0xFF2E2A20); // filled-input borders
  static const gold = Color(0xFFE8C877); // primary
  static const goldHover = Color(0xFFFFE5A8); // primary hover
  static const onGold = Color(0xFF3E2E00); // text on gold
  static const amber = Color(0xFFD4A845); // accent
  static const amberDim = Color(0xFFB39B5C); // dim amber text
  static const onSurface = Color(0xFFE9E1D8); // main text
  static const onSurfaceVariant = Color(0xFFCFC5B3); // secondary text
  static const outline = Color(0xFF98907F);
  static const outlineVariant = Color(0xFF4C4638);
  static const error = Color(0xFFFFB4AB);
  static const delete = Color(0xFFF0674F);
  static const success = Color(0xFFC1D0B2);
}

abstract class TvTypography {
  static TextStyle headingXL(BuildContext c) => GoogleFonts.fraunces(
        fontSize: 32,
        fontWeight: FontWeight.w600,
        letterSpacing: -0.5,
        color: TvColors.onSurface,
      );

  static TextStyle headingLG(BuildContext c) => GoogleFonts.fraunces(
        fontSize: 28,
        fontWeight: FontWeight.w600,
        letterSpacing: -0.4,
        color: TvColors.onSurface,
      );

  static TextStyle headingMD(BuildContext c) => GoogleFonts.fraunces(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: TvColors.onSurface,
      );

  static TextStyle headingSM(BuildContext c) => GoogleFonts.fraunces(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: TvColors.onSurface,
      );

  static TextStyle bodyLG(BuildContext c) => GoogleFonts.manrope(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: TvColors.onSurface,
      );

  static TextStyle bodyMD(BuildContext c) => GoogleFonts.manrope(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: TvColors.onSurfaceVariant,
      );

  static TextStyle labelUI(BuildContext c) => GoogleFonts.manrope(
        fontSize: 13,
        fontWeight: FontWeight.w600,
        color: TvColors.onSurface,
      );

  static TextStyle eyebrow(BuildContext c) => GoogleFonts.manrope(
        fontSize: 11,
        fontWeight: FontWeight.w800,
        letterSpacing: 2.6,
        color: TvColors.amber,
      );

  static TextStyle value(BuildContext c) => GoogleFonts.fraunces(
        fontSize: 15,
        fontWeight: FontWeight.w500,
        color: TvColors.onSurface,
      );

  static TextStyle mono(BuildContext c) => GoogleFonts.jetBrainsMono(
        fontSize: 12,
        color: TvColors.amberDim,
      );
}

ThemeData buildTvTheme() {
  final base = ThemeData.dark(useMaterial3: true);
  const scheme = ColorScheme.dark(
    primary: TvColors.gold,
    onPrimary: TvColors.onGold,
    secondary: TvColors.amber,
    onSecondary: TvColors.ink,
    tertiary: TvColors.success,
    error: TvColors.error,
    onError: Color(0xFF4C0A02),
    surface: TvColors.ink,
    onSurface: TvColors.onSurface,
    onSurfaceVariant: TvColors.onSurfaceVariant,
    outline: TvColors.outline,
    outlineVariant: TvColors.outlineVariant,
  );

  return base.copyWith(
    colorScheme: scheme,
    scaffoldBackgroundColor: TvColors.ink,
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(foregroundColor: TvColors.amber),
    ),
    inputDecorationTheme: const InputDecorationTheme(
      filled: true,
      fillColor: TvColors.fieldFill,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.all(Radius.circular(2)),
        borderSide: BorderSide(color: TvColors.hairlineHover),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.all(Radius.circular(2)),
        borderSide: BorderSide(color: TvColors.hairlineHover),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.all(Radius.circular(2)),
        borderSide: BorderSide(color: TvColors.amber),
      ),
      hintStyle: TextStyle(color: Color(0xFF6B6558)),
      contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      labelStyle: TextStyle(color: TvColors.onSurfaceVariant, fontSize: 13),
      floatingLabelStyle: TextStyle(color: TvColors.amber, fontSize: 12),
    ),
    snackBarTheme: const SnackBarThemeData(
      backgroundColor: TvColors.plate,
      contentTextStyle: TextStyle(color: TvColors.onSurface),
    ),
  );
}

/// Signature rounding used across the archive plates.
const tvRadius = Radius.circular(2);
const tvBorderRadius = BorderRadius.all(tvRadius);
const BorderSide tvHairline = BorderSide(color: TvColors.hairline);
