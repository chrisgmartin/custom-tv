# 1. Install the launcher

This installs TV Home as an ordinary app. It doesn't touch any system settings. Afterwards it appears in your apps list as **Home**, and the remote's Home button still opens Samsung's own Home screen until you do [level 2](2-set-as-home.md).

The scripts assume macOS with Tizen Studio installed in `~/tizen-studio`. On Linux or Windows, adjust the paths at the top of `tools/install.sh`.

## What you need

- A Samsung Tizen TV and a computer on the same network. Find the TV's IP address in its network settings, under **Network Status › IP Settings**.
- A free [Samsung Account](https://account.samsung.com), which is used to issue your signing certificate.
- [Tizen Studio](https://developer.tizen.org/development/tizen-studio/download) (the CLI-only installer is enough).

## Step 1: turn on Developer Mode

1. On the TV, open **Apps**.
2. With the Apps screen showing, press **1 2 3 4 5** on the remote. On remotes without number keys, use the on-screen number pad.
3. Switch **Developer mode** to **On** and enter your **computer's** IP address.
4. Restart the TV by holding the power button until it turns off and on again.

Samsung's guide: [Connecting the TV and SDK](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html).

## Step 2: install the Tizen tools

1. Install Tizen Studio into `~/tizen-studio`.
2. Open its **Package Manager**. Under **Extension SDK**, install **Samsung Certificate Extension** and the **TV Extensions** for your TV's Tizen version.

Samsung's guide: [Installing TV SDK](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/installing-tv-sdk.html).

Then check that your computer can reach the TV:

```bash
~/tizen-studio/tools/sdb connect 192.168.1.50
```

```bash
~/tizen-studio/tools/sdb devices
```

Replace `192.168.1.50` with your TV's IP address. The TV should be listed as a device. If the connection is refused, check that the IP address in Developer Mode is your computer's, and restart the TV again.

## Step 3: create a Samsung certificate

Retail Samsung TVs refuse apps signed with the generic Tizen certificate. You need a Samsung certificate that names your TV's DUID (its device ID).

1. Keep the TV connected with `sdb connect` so Certificate Manager can read its DUID.
2. Open **Tizen Studio › Tools › Certificate Manager** and click **+**.
3. Choose **Samsung**, then **TV**.
4. Name the profile **`tv-home`**. If you choose another name, set `TVHOME_PROFILE` when you run `install.sh`.
5. Create a new author certificate and sign in with your Samsung Account when asked.
6. Create the distributor certificate. Check that your TV's DUID appears in the device list.

Samsung's guide: [Creating certificates](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/creating-certificates.html).

> [!IMPORTANT]
> Back up the author certificate (`~/tizen-studio-data/keystore/`) and its password somewhere private.
> Every future update must be signed by the same author. Never commit these files: `.gitignore` already excludes `*.p12`, `*.pwd` and `profiles.xml`.

## Step 4: configure

Edit [`js/config.js`](../js/config.js):

- **`location`**: your town's name and coordinates, which are used for the weather.
- **`homeApps`**: the tiles that come first, in order. To find app IDs, list the installed apps and use the `app_tizen_id` values:

  ```bash
  ~/tizen-studio/tools/sdb -s 192.168.1.50:26101 shell 0 vd_applist
  ```

  HDMI tiles use an `input.*` ID and a `source`. There's a commented example in the file.
- **`defaults`**: the language (`en-GB` or `pt-PT`), units, clock and whether rain and snow effects are on. Viewers can change these later in Settings.

## Step 5: install

```bash
tools/install.sh 192.168.1.50
```

The script copies the app into `build/`, then signs it with your `tv-home` profile, installs it on the TV and launches it. Run the same command after every change.

## Uninstall

If you did level 2, first [restore Samsung's Home](2-set-as-home.md#switch-back-to-samsungs-home). Then run:

```bash
~/tizen-studio/tools/ide/bin/tizen uninstall -p TvHomeLnch.Home -s 192.168.1.50:26101
```

## Changing the app ID (optional)

The package ID is `TvHomeLnch` and the app ID is `TvHomeLnch.Home`. To use your own, change both in:

- `config.xml`
- `tools/install.sh`
- `tools/home-routing.py`
- `tools/home-routing/Program.cs`
