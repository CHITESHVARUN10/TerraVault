import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../providers/providers.dart';
import '../../theme/tv_theme.dart';
import '../../widgets/widgets.dart';

/// 03_register — open a vault.
class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) context.read<AuthProvider>().clearError();
    });
  }

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    final ok = await context.read<AuthProvider>().register(
      _name.text.trim(),
      _email.text.trim(),
      _password.text,
    );
    if (ok && mounted) context.go('/dashboard');
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
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
                    const Eyebrow('New custodian'),
                    const SizedBox(height: 8),
                    Text(
                      'Open your vault',
                      style: TvTypography.headingLG(context),
                    ),
                    const SizedBox(height: 20),
                    TvField(
                      label: 'Full Name',
                      controller: _name,
                      prefixIcon: Icons.person_outline,
                      validator: (v) => (v == null || v.trim().length < 2)
                          ? 'Your name is required.'
                          : null,
                    ),
                    const SizedBox(height: 12),
                    TvField(
                      label: 'Email Address',
                      controller: _email,
                      prefixIcon: Icons.mail_outline,
                      keyboardType: TextInputType.emailAddress,
                      validator: (v) => (v == null || !v.contains('@'))
                          ? 'A valid email is required.'
                          : null,
                    ),
                    const SizedBox(height: 12),
                    TvField(
                      label: 'Security Key',
                      controller: _password,
                      prefixIcon: Icons.key_outlined,
                      obscureText: true,
                      validator: (v) => (v == null || v.length < 6)
                          ? 'At least 6 characters.'
                          : null,
                    ),
                    if (auth.error != null) ...[
                      const SizedBox(height: 12),
                      Text(
                        auth.error!,
                        style: TvTypography.bodyMD(
                          context,
                        ).copyWith(color: TvColors.error, fontSize: 12),
                      ),
                    ],
                    const SizedBox(height: 16),
                    TvButton(
                      label: 'Create vault →',
                      expanded: true,
                      loading: auth.busy,
                      onPressed: _submit,
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Already hold a vault?',
                          style: TvTypography.bodyMD(
                            context,
                          ).copyWith(fontSize: 13),
                        ),
                        TextButton(
                          onPressed: () => context.go('/login'),
                          child: Text(
                            'Sign in',
                            style: TvTypography.labelUI(
                              context,
                            ).copyWith(color: TvColors.amber, fontSize: 13),
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
}
