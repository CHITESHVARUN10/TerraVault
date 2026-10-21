import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../providers/providers.dart';
import '../../theme/tv_theme.dart';
import '../../widgets/widgets.dart';

/// 02_login — single archive plate, email + security key.
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _obscure = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) context.read<AuthProvider>().clearError();
    });
  }

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    final ok = await context.read<AuthProvider>().login(
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
                    const Eyebrow('Vault access'),
                    const SizedBox(height: 8),
                    Text('Sign in', style: TvTypography.headingLG(context)),
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
                    const SizedBox(height: 12),
                    TvField(
                      label: 'Security Key',
                      controller: _password,
                      prefixIcon: Icons.key_outlined,
                      obscureText: _obscure,
                      suffix: IconButton(
                        icon: Icon(
                          _obscure
                              ? Icons.visibility_off_outlined
                              : Icons.visibility_outlined,
                          color: TvColors.outline,
                          size: 18,
                        ),
                        onPressed: () => setState(() => _obscure = !_obscure),
                      ),
                      validator: (v) => (v == null || v.isEmpty)
                          ? 'Your security key is required.'
                          : null,
                    ),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () => context.go('/reset-password'),
                        child: Text(
                          'Forgot your security key?',
                          style: TvTypography.bodyMD(
                            context,
                          ).copyWith(color: TvColors.amber, fontSize: 12),
                        ),
                      ),
                    ),
                    if (auth.error != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        auth.error!,
                        style: TvTypography.bodyMD(
                          context,
                        ).copyWith(color: TvColors.error, fontSize: 12),
                      ),
                    ],
                    const SizedBox(height: 12),
                    TvButton(
                      label: 'Sign in →',
                      expanded: true,
                      loading: auth.busy,
                      onPressed: _submit,
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'New to TerraVault?',
                          style: TvTypography.bodyMD(
                            context,
                          ).copyWith(fontSize: 13),
                        ),
                        TextButton(
                          onPressed: () => context.go('/register'),
                          child: Text(
                            'Open your vault',
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
