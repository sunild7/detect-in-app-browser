/**
 * In-App Browser Detection Library
 * Detects if the current browser is an in-app browser (WebView) or a regular browser
 *
 * @version 1.0.0
 * @license MIT
 */

import {
  getParser,
} from "bowser";

import type { BrowserName, EnvironmentInfo, PlatformType } from "./types.js";

const REFERRER_PREFIXES = [
  // Google / Gmail
  "android-app://com.google.android.gm",
  "android-app://com.google.android.apps.inbox",
  // Microsoft Outlook
  "android-app://com.microsoft.office.outlook",
  "android-app://com.microsoft.office.outlooklite",
  // Yahoo Mail
  "android-app://com.yahoo.mobile.client.android.mail",
  "android-app://com.yahoo.mobile.client.android.mail.lite",
  // Proton Mail
  "android-app://ch.protonmail.android",
  // Spark Mail
  "android-app://com.readdle.spark",
  // Zoho Mail
  "android-app://com.zoho.mail",
  // Yandex Mail
  "android-app://ru.yandex.mail",
  // AOL Mail
  "android-app://com.aol.mobile.aolapp",
  // BlueMail / TypeApp
  "android-app://me.bluemail.mail",
  // K-9 / Thunderbird
  "android-app://com.fsck.k9",
  "android-app://org.mozilla.thunderbird",
  // Mail.ru
  "android-app://ru.mail.mailapp",
];

const REFERRER_HOSTS = [
  // Gmail / Google Workspace
  "mail.google.com",
  "inbox.google.com",
  "mail.workspace.google.com",
  // Outlook / Microsoft 365
  "outlook.live.com",
  "outlook.office365.com",
  "mail.live.com",
  "outlook.office.com",
  // iCloud / Apple Mail
  "mail.icloud.com",
  "icloud.com",
  // Yahoo Mail
  "mail.yahoo.com",
  // Proton Mail
  "mail.proton.me",
  "mail.protonmail.com",
  // Zoho Mail
  "mail.zoho.com",
  "mail.zoho.in",
  // Yandex Mail
  "mail.yandex.com",
  "mail.yandex.ru",
  // AOL Mail
  "mail.aol.com",
  // Mail.ru
  "mail.ru",
  "e.mail.ru",
  // Hey
  "app.hey.com",
  // Fastmail
  "www.fastmail.com",
  "app.fastmail.com",
  // Spark
  "sparkmailapp.com",
];

const IN_APP_TOKENS = [
  // Generic WebView / Google app
  "gsa/",
  "wv",
  // Gmail / Google Workspace
  "gmail",
  "com.google.android.gm",
  "googlemail",
  // Outlook / Microsoft
  "outlook",
  "hotmail",
  "com.microsoft.office.outlook",
  "com.microsoft.office.outlooklite",
  // Yahoo Mail
  "ymail",
  "yahoo mail",
  "com.yahoo.mobile.client.android.mail",
  // Proton Mail
  "protonmail",
  "ch.protonmail.android",
  // Zoho Mail
  "zoho mail",
  "com.zoho.mail",
  // Spark Mail
  "sparkmail",
  "com.readdle.spark",
  // Yandex Mail
  "yandexmail",
  "ru.yandex.mail",
  // AOL Mail
  "aolmail",
  "com.aol.mobile.aolapp",
  // BlueMail / TypeApp
  "bluemail",
  "typeapp",
  "me.bluemail.mail",
  // K-9 / Thunderbird
  "k-9 mail",
  "thunderbird",
  "com.fsck.k9",
  "org.mozilla.thunderbird",
  // Mail.ru
  "mail.ru",
  "ru.mail.mailapp",
  // Fastmail
  "fastmail",
  // Hey
  "hey.com",
];

const WEBVIEW_TOKENS = [" wv", "; wv", "_wv", "webview", " crosswalk"];

export class InAppBrowserDetector {
  /**
   * Detect if the current context is an in-app browser.
   */
  static detectInAppBrowser(
    userAgentOverride?: string,
    referrerOverride?: string
  ): boolean {
    const ua = this.getUserAgent(userAgentOverride);
    if (!ua) {
      return false;
    }

    const referrer = this.getReferrer(referrerOverride);
    if (this.hasKnownReferrer(referrer)) {
      return true;
    }

    const parser = getParser(ua);
    const platformType = (parser.getPlatformType() ??
      "unknown") as PlatformType;
    const isMobileLike = platformType === "mobile" || platformType === "tablet";

    if (!isMobileLike) {
      return false;
    }

    const normalizedUA = ua.toLowerCase();
    if (IN_APP_TOKENS.some((token) => normalizedUA.includes(token))) {
      return true;
    }

    return WEBVIEW_TOKENS.some((token) => normalizedUA.includes(token));
  }

  /**
   * Convenience helper to expose browser/environment information parsed via Bowser.
   */
  static getEnvironmentInfo(userAgentOverride?: string): EnvironmentInfo {
    const ua = this.getUserAgent(userAgentOverride);
    if (!ua) {
      return {
        browserName: "Unknown Browser",
        browserVersion: "Unknown",
        osName: "Unknown",
        osVersion: "Unknown",
        platformType: "unknown",
      };
    }

    const parser = getParser(ua);

    return {
      browserName: (parser.getBrowserName() ??
        "Unknown Browser") as BrowserName,
      browserVersion: parser.getBrowserVersion() ?? "Unknown",
      osName: parser.getOSName() ?? "Unknown",
      osVersion: parser.getOSVersion() ?? "Unknown",
      platformType: (parser.getPlatformType() ?? "unknown") as PlatformType,
    };
  }

  /**
   * Get the browser name by delegating to Bowser.
   */
  static getBrowserName(userAgentOverride?: string): BrowserName {
    return this.getEnvironmentInfo(userAgentOverride).browserName;
  }

  /**
   * Get the current page URL.
   */
  static getCurrentPageUrl(): string {
    if (typeof window === "undefined") {
      return "";
    }

    try {
      return window.location.href;
    } catch {
      return "";
    }
  }

  private static getUserAgent(userAgentOverride?: string): string {
    if (userAgentOverride) {
      return userAgentOverride;
    }

    if (typeof navigator !== "undefined" && navigator.userAgent) {
      return navigator.userAgent;
    }

    return "";
  }

  private static getReferrer(referrerOverride?: string): string {
    if (referrerOverride) {
      return referrerOverride.toLowerCase();
    }

    if (typeof document !== "undefined" && document.referrer) {
      return document.referrer.toLowerCase();
    }

    return "";
  }

  private static hasKnownReferrer(referrer: string): boolean {
    if (!referrer) {
      return false;
    }

    if (REFERRER_PREFIXES.some((prefix) => referrer.startsWith(prefix))) {
      return true;
    }

    return REFERRER_HOSTS.some((host) => referrer.includes(host));
  }
}
