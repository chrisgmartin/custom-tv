// Installed apps via the Tizen Application API; a sample list when previewed in a desktop browser.
(function () {
  'use strict';

  var isTizen = typeof window.tizen !== 'undefined' && window.tizen.application;
  var homeApps = window.TV_HOME_CONFIG.homeApps;

  function tr(key, values) {
    if (window.TVI18n) return window.TVI18n.text(key, values);
    return key.replace('{name}', values ? values.name : '{name}');
  }

  function selfId() {
    try { return tizen.application.getCurrentApplication().appInfo.id; } catch (e) { return ''; }
  }

  // Icons are copied into the webapp's own origin (see tools/sync-app-icons.sh);
  // loading via a webapp-relative URL avoids cross-origin blocks on file://.
  function iconUrl(id) {
    if (!id) return '';
    return 'app-icons/' + id + '.png';
  }

  // Treat lowercase hyphenated service IDs as system apps. Real user apps have
  // a brand name and a vendor-signed id prefix; these do not.
  var SYSTEM_ID_PATTERNS = [
    /^com\.samsung\.tv\.coba\./,
    /^com\.samsung\.tv\.cobalt-app-\d+/,
    /^com\.samsung\.tv\.(aria|aov|aispeaker|ambient|appinfoviewer|arkwheel|autosetup|bbplayer|bixby|camera-launcher|hotel|mde-|SAFCommonPlugin|SelfDiagnosis|TVDeviceCare|AccountNudge|CSAccount|CSBilling|adplayer|aitech|autofill|aria-|ep-|hitcomp|mtm-|remoteapp|hotel|hitcomp|SACM|safcrash)/,
    /^com\.samsung\.ep\./,
    /^com\.samsung\.tizen\.autofill/,
    /^org\.tizen\.(channel-list|UsbSyncDisplay|browser|xmrender)/,
    /^capi-/,
    /^content-grab-service$/,
    /^SmartControlService$/
  ];
  function isSystemApp(a) {
    var id = a && a.id || '';
    for (var i = 0; i < SYSTEM_ID_PATTERNS.length; i++) if (SYSTEM_ID_PATTERNS[i].test(id)) return true;
    var name = (a && a.name || '').toLowerCase();
    if (/^(service|dtv-|dummy|plugin|framework|viewer|engine|crashservice|-service$|_service$)/.test(name)) return true;
    if (name.indexOf('framework') >= 0 || name.indexOf('-service') >= 0 || name.indexOf('_service') >= 0) return true;
    return false;
  }

  function normName(n) {
    return (n || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  }

  // Prefer the entry that looks more like a user-facing app:
  //   1. has a readable iconPath,
  //   2. has a mixed-case vendor-signed id (not a cobalt-* or samsung internal one).
  function preferAppInfo(candidate, current) {
    var cIcon = !!(candidate && candidate.iconPath);
    var pIcon = !!(current && current.iconPath);
    if (cIcon !== pIcon) return cIcon;
    var cBad = /^com\.samsung\.tv\.cobalt-/.test(candidate.id);
    var pBad = /^com\.samsung\.tv\.cobalt-/.test(current.id);
    if (cBad !== pBad) return !cBad;
    return false;
  }

  function sampleIcon(name, fg, bg) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="216"><rect width="400" height="216" fill="' + bg +
      '"/><text x="200" y="126" font-family="Helvetica, Arial" font-weight="700" font-size="46" text-anchor="middle" fill="' +
      fg + '">' + name + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  var SAMPLE = [
    ['sample.netflix', 'Netflix', '#e50914', '#000000'], ['sample.youtube', 'YouTube', '#ff0033', '#ffffff'],
    ['sample.prime', 'Prime Video', '#ffffff', '#0f79f3'], ['sample.apple', 'Apple TV', '#ffffff', '#1c1c1e'],
    ['sample.disney', 'Disney+', '#ffffff', '#0b2a43'], ['sample.max', 'Max', '#ffffff', '#002be7'],
    ['sample.spotify', 'Spotify', '#1ed760', '#121212'], ['sample.browser', 'Browser', '#ffffff', '#2b5bd7'],
    ['sample.livetv', 'Live TV', '#ffffff', '#3a3f4b'], ['sample.player', 'Media Player', '#ffffff', '#c2410c'],
    ['sample.manual', 'User Guide', '#ffffff', '#334155']
  ];

  function list() {
    if (!isTizen) {
      if (homeApps.length) return Promise.resolve(homeApps.map(function (a) {
        return { id: a.id, name: a.name, icon: a.icon, source: a.source, sample: true };
      }));
      return Promise.resolve(SAMPLE.map(function (s) {
        return { id: s[0], name: s[1], icon: sampleIcon(s[1], s[2], s[3]), sample: true };
      }));
    }
    return new Promise(function (resolve, reject) {
      tizen.application.getAppsInfo(function (infos) {
        var me = selfId();
        var pinned = Object.create(null);
        homeApps.forEach(function (h) { pinned[h.id] = h; });
        var byId = Object.create(null);
        infos.forEach(function (a) { byId[a.id] = a; });
        var apps;
        if (window.TV_HOME_CONFIG.onlyHomeApps) {
          // Strict curation: show only the configured home apps, in order.
          apps = homeApps.filter(function (h) { return !h.source; }).map(function (h) {
            var a = byId[h.id];
            return { id: h.id, name: h.name || (a && a.name) || h.id, icon: h.icon || iconUrl(h.id), missing: !a };
          });
        } else {
          var filtered = infos.filter(function (a) {
            if (a.id === me) return false;
            if (pinned[a.id]) return true;
            if (!a.show) return false;
            if (isSystemApp(a)) return false;
            return true;
          });
          var byKey = {};
          filtered.forEach(function (a) {
            var key = normName(a.name);
            if (!key) return;
            var prev = byKey[key];
            if (!prev || preferAppInfo(a, prev)) byKey[key] = a;
          });
          apps = Object.keys(byKey).map(function (k) {
            var a = byKey[k];
            var home = pinned[a.id];
            return { id: a.id, name: home ? home.name : a.name, icon: home ? home.icon : iconUrl(a.id) };
          });
        }
        resolve(apps.concat(homeApps.filter(function (a) { return a.source; })));
      }, function (err) { reject(new Error(err && err.message || 'Could not read installed apps')); });
    });
  }

  function launch(id) {
    if (!isTizen) return Promise.reject(new Error(tr('Preview mode: apps only open on the TV')));
    return new Promise(function (resolve, reject) {
      var input = homeApps.filter(function (a) { return a.id === id && a.source; })[0];
      if (input) {
        tizen.systeminfo.getPropertyValue('VIDEOSOURCE', function (video) {
          var source = video.connected.filter(function (s) {
            return s.type === input.source.type && s.number === input.source.number;
          })[0];
          if (!source) { reject(new Error(tr('{name} is not connected', { name: input.name }))); return; }
          try {
            tizen.tvwindow.setSource(source, function () {
              try { tizen.application.getCurrentApplication().hide(); resolve(); } catch (e) { reject(e); }
            }, reject, 'MAIN');
          } catch (e) { reject(e); }
        }, reject);
        return;
      }
      tizen.application.launch(id, resolve, function (err) { reject(new Error(err && err.message || 'launch failed')); });
    });
  }

  function exit() {
    if (isTizen) { try { tizen.application.getCurrentApplication().exit(); } catch (e) { /* already exiting */ } }
  }

  window.TVApps = { list: list, launch: launch, exit: exit, isTizen: !!isTizen };
})();
