import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../theme/tv_theme.dart';
import '../../widgets/widgets.dart';

/// 16_reset_password / m01 — request a recovery link.
class ResetPasswordScreen extends StatefulWidget {
  const ResetPasswordScreen({super.key});

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _email = TextEditingController();

  @override
  void dispose() {
    _email.dispose();
    super.dispose();
  }

  void _submit() {
    if (_formKey.currentState?.validate() ?? false) {
      context.go('/check-email');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: TvColors.ink,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
            child: Plate(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Eyebrow('Recovery protocol'),
                    const SizedBox(height: 8),
                    Text(
                      'Reset your security key',
                      style: TvTypography.headingLG(context),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Enter the email bound to your vault. We will send a '
                      'one-time recovery link.',
                      style: TvTypography.bodyMD(
                        context,
                      ).copyWith(fontSize: 13),
                    ),
                    const SizedBox(height: 20),
                    TvField(
                      label: 'Email Address',
                      controller: _email,
                      prefixIcon: Icons.mail_outline,
                      keyboardType: TextInputType.emailAddress,
                      validator: (v) => (v == null || !v.contains('@'))
                          ? 'A valid email is required.'
                          : null,
                    ),
                    const SizedBox(height: 16),
                    TvButton(
                      label: 'Send recovery link →',
                      expanded: true,
                      onPressed: _submit,
                    ),
                    const SizedBox(height: 16),
                    TextButton(
                      onPressed: () => context.go('/login'),
                      child: Text(
                        '← Back to sign in',
                        style: TvTypography.labelUI(
                          context,
                        ).copyWith(color: TvColors.amber, fontSize: 13),
                      ),
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
}
