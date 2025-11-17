/**
 * In-App Browser Detection Library
 * Detects if the current browser is an in-app browser (WebView) or a regular browser
 *
 * @version 1.0.0
 * @license MIT
 */
import Bowser from "bowser";
const REFERRER_PREFIXES = [
    'android-app://com.google.android.gm',
    'android-app://com.facebook.katana',
    'android-app://com.instagram.android',
    'android-app://com.whatsapp',
    'android-app://com.linkedin.android',
    'android-app://com.twitter.android',
    'android-app://com.snapchat.android',
    'android-app://com.pinterest',
    'android-app://com.discord',
    'android-app://com.linecorp.linelite',
];
const REFERRER_HOSTS = [
    'mail.google.com',
    'l.messenger.com',
    'l.facebook.com',
    'l.instagram.com',
    't.co',
    'whatsapp.com',
    'instagram.com',
    'facebook.com',
    'linkedin.com',
    'snapchat.com',
    'discord.com',
];
const IN_APP_TOKENS = [
    'fban',
    'fbav',
    'fb_iab',
    'fb4a',
    'twitter',
    'instagram',
    'linkedinapp',
    'line',
    'whatsapp',
    'snapchat',
    'pinterest',
    'slack',
    'discord',
    'telegram',
    'wechat',
    'qq',
    'gsa/',
    'com.facebook.orca',
    'wv',
];
const WEBVIEW_TOKENS = [' wv', '; wv', '_wv', 'webview', ' crosswalk'];
export class InAppBrowserDetector {
    /**
     * Detect if the current context is an in-app browser.
     */
    static detectInAppBrowser(userAgentOverride, referrerOverride) {
        const ua = this.getUserAgent(userAgentOverride);
        if (!ua) {
            return false;
        }
        const referrer = this.getReferrer(referrerOverride);
        if (this.hasKnownReferrer(referrer)) {
            return true;
        }
        const parser = Bowser.getParser(ua);
        const platformType = (parser.getPlatformType() ?? 'unknown');
        const isMobileLike = platformType === 'mobile' || platformType === 'tablet';
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
    static getEnvironmentInfo(userAgentOverride) {
        const ua = this.getUserAgent(userAgentOverride);
        if (!ua) {
            return {
                browserName: 'Unknown Browser',
                browserVersion: 'Unknown',
                osName: 'Unknown',
                osVersion: 'Unknown',
                platformType: 'unknown',
            };
        }
        const parser = Bowser.getParser(ua);
        return {
            browserName: (parser.getBrowserName() ?? 'Unknown Browser'),
            browserVersion: parser.getBrowserVersion() ?? 'Unknown',
            osName: parser.getOSName() ?? 'Unknown',
            osVersion: parser.getOSVersion() ?? 'Unknown',
            platformType: (parser.getPlatformType() ?? 'unknown'),
        };
    }
    /**
     * Get the browser name by delegating to Bowser.
     */
    static getBrowserName(userAgentOverride) {
        return this.getEnvironmentInfo(userAgentOverride).browserName;
    }
    /**
     * Get the current page URL.
     */
    static getCurrentPageUrl() {
        if (typeof window === 'undefined') {
            return '';
        }
        try {
            return window.location.href;
        }
        catch {
            return '';
        }
    }
    static getUserAgent(userAgentOverride) {
        if (userAgentOverride) {
            return userAgentOverride;
        }
        if (typeof navigator !== 'undefined' && navigator.userAgent) {
            return navigator.userAgent;
        }
        return '';
    }
    static getReferrer(referrerOverride) {
        if (referrerOverride) {
            return referrerOverride.toLowerCase();
        }
        if (typeof document !== 'undefined' && document.referrer) {
            return document.referrer.toLowerCase();
        }
        return '';
    }
    static hasKnownReferrer(referrer) {
        if (!referrer) {
            return false;
        }
        if (REFERRER_PREFIXES.some((prefix) => referrer.startsWith(prefix))) {
            return true;
        }
        return REFERRER_HOSTS.some((host) => referrer.includes(host));
    }
}
//# sourceMappingURL=InAppBrowserDetector.js.map