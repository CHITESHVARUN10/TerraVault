import 'package:flutter/foundation.dart';

import '../data/api_client.dart';
import '../data/auth_service.dart';
import '../data/property_service.dart';
import '../data/models.dart';

/// Session-level state: bootstraps from `/auth/me` at app start.
class AuthProvider extends ChangeNotifier {
  AuthProvider({AuthService? service}) : _service = service ?? AuthService();

  final AuthService _service;

  TvUser? user;
  bool bootstrapped = false;
  bool busy = false;
  String? error;

  bool get isAuthenticated => user != null;

  /// Restores the session from the persisted cookie. Returns the user when
  /// the session is alive so the router can send us to `/dashboard`.
  Future<TvUser?> bootstrap() async {
    try {
      user = await _service.me();
    } catch (_) {
      user = null;
    }
    bootstrapped = true;
    notifyListeners();
    return user;
  }

  Future<bool> login(String email, String password) =>
      _run(() => _service.login(email, password));

  Future<bool> register(String name, String email, String password) =>
      _run(() => _service.register(name, email, password));

  Future<void> logout() async {
    try {
      await _service.logout();
    } finally {
      user = null;
      notifyListeners();
    }
  }

  Future<bool> _run<T>(Future<TvUser> Function() op) async {
    busy = true;
    error = null;
    notifyListeners();
    try {
      user = await op();
      return true;
    } on TvApiException catch (e) {
      error = e.message;
      return false;
    } catch (e) {
      error = e.toString();
      return false;
    } finally {
      busy = false;
      notifyListeners();
    }
  }
}

/// Workspace state: the property ledger and the active property.
class PropertiesProvider extends ChangeNotifier {
  PropertiesProvider({PropertyService? service})
      : _service = service ?? PropertyService();

  final PropertyService _service;

  List<TvProperty> all = [];
  bool loading = false;
  bool loaded = false;
  String? error;
  String searchQuery = '';
  String categoryFilter = 'All Categories';

  List<TvProperty> get visible {
    Iterable<TvProperty> out = all;
    if (categoryFilter != 'All Categories') {
      final f = categoryFilter.toLowerCase();
      out = out.where((p) => p.category.toLowerCase().contains(f));
    }
    if (searchQuery.trim().isNotEmpty) {
      final q = searchQuery.toLowerCase();
      out = out.where((p) =>
          p.name.toLowerCase().contains(q) ||
          p.category.toLowerCase().contains(q) ||
          p.previousOwner.toLowerCase().contains(q));
    }
    return out.toList();
  }

  TvProperty? byId(String id) {
    for (final p in all) {
      if (p.id == id) return p;
    }
    return null;
  }

  Future<bool> refresh() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      all = await _service.list();
      loaded = true;
      return true;
    } on TvApiException catch (e) {
      error = e.message;
      return false;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<bool> create(Map<String, dynamic> body) async {
    try {
      final property = await _service.create(body);
      all = [property, ...all];
      notifyListeners();
      return true;
    } on TvApiException catch (e) {
      error = e.message;
      return false;
    }
  }

  /// Optimistically replaces a property returned from a nested mutation
  /// (documents / visits).
  void replace(TvProperty property) {
    final idx = all.indexWhere((p) => p.id == property.id);
    if (idx >= 0) {
      all[idx] = property;
    } else {
      all.insert(0, property);
    }
    notifyListeners();
  }

  Future<bool> delete(String id) async {
    try {
      await _service.delete(id);
      all = all.where((p) => p.id != id).toList();
      notifyListeners();
      return true;
    } on TvApiException catch (e) {
      error = e.message;
      return false;
    }
  }

  void setSearch(String query) {
    searchQuery = query;
    notifyListeners();
  }

  void setCategoryFilter(String filter) {
    categoryFilter = filter;
    notifyListeners();
  }
}

/// Drive connection state (m09 → m11 flow).
class DriveProvider extends ChangeNotifier {
  DriveProvider({DriveService? service}) : _service = service ?? DriveService();

  final DriveService _service;

  DriveStatus status = const DriveStatus(connected: false);
  bool loading = false;

  bool get connected => status.connected;

  Future<void> refresh() async {
    loading = true;
    notifyListeners();
    try {
      status = await _service.status();
    } catch (_) {
      status = const DriveStatus(connected: false);
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> disconnect() async {
    try {
      await _service.disconnect();
    } finally {
      status = const DriveStatus(connected: false);
      notifyListeners();
    }
  }
}
