// Adaptive Cookie Banner System für STEEL Website
class AdaptiveCookieBanner {
    constructor() {
        this.cookieName = 'steel_cookie_consent';
        this.cookieExpiry = 365; // Tage
        this.currentLanguage = 'de';
        
        this.translations = {
            de: {
                cookieBannerTitle: 'Cookies',
                cookieBannerText: 'Ich verwende Cookies für das beste Erlebnis auf meiner Webseite. ',
                cookieBannerLink: 'Mehr erfahren',
                cookieAcceptAll: 'Alle akzeptieren',
                cookieSettings: 'Einstellungen',
                cookieNecessary: 'Nur notwendige',
                cookieModalTitle: 'Cookie-Einstellungen',
                cookieNecessaryTitle: 'Notwendige Cookies',
                cookieNecessaryDesc: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
                cookieAnalyticsTitle: 'Analytik Cookies',
                cookieAnalyticsDesc: 'Diese Cookies helfen mir zu verstehen, wie du mit der Website interagierst, um meine Dienste zu verbessern.',
                cookieMarketingTitle: 'Marketing Cookies',
                cookieMarketingDesc: 'Diese Cookies werden verwendet, um dir relevante Werbung und personalisierte Inhalte zu zeigen.',
                cookieSave: 'Einstellungen speichern',
                cookieDeclineAll: 'Alle ablehnen'
            },
            en: {
                cookieBannerTitle: 'Cookies',
                cookieBannerText: 'I use cookies to provide the best experience on my website. ',
                cookieBannerLink: 'Learn more',
                cookieAcceptAll: 'Accept all',
                cookieSettings: 'Settings',
                cookieNecessary: 'Necessary only',
                cookieModalTitle: 'Cookie Settings',
                cookieNecessaryTitle: 'Necessary Cookies',
                cookieNecessaryDesc: 'These cookies are required for basic website functionality and cannot be disabled.',
                cookieAnalyticsTitle: 'Analytics Cookies',
                cookieAnalyticsDesc: 'These cookies help me understand how you interact with the website to improve my services.',
                cookieMarketingTitle: 'Marketing Cookies',
                cookieMarketingDesc: 'These cookies are used to show you relevant advertising and personalized content.',
                cookieSave: 'Save settings',
                cookieDeclineAll: 'Decline all'
            }
        };

        this.init();
    }

    init() {
        // Auto-detect language from html lang attribute
        const htmlLang = document.documentElement.lang;
        if (htmlLang === 'en') {
            this.currentLanguage = 'en';
        }

        this.updateTexts();
        this.checkCookieConsent();
    }

    // NEUE METHODE: Öffentliche Methode zum Ändern der Sprache
    setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            this.updateTexts();
        }
    }

    updateTexts() {
        const texts = this.translations[this.currentLanguage];
        
        Object.keys(texts).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = texts[key];
            }
        });
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            try {
                return JSON.parse(decodeURIComponent(parts.pop().split(';').shift()));
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    checkCookieConsent() {
        const consent = this.getCookie(this.cookieName);
        
        if (!consent) {
            this.showBanner();
        } else {
            this.applyCookieSettings(consent);
        }
    }

    showBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            setTimeout(() => {
                banner.classList.add('show');
            }, 1000); // Verzögerung für bessere UX
        }
    }

    hideBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('show');
            banner.classList.add('hide');
        }
    }

    applyCookieSettings(consent) {
        // Hier würden Sie die entsprechenden Cookies/Scripts laden
        if (consent.analytics) {
            console.log('Analytics cookies enabled');
            // Google Analytics, etc. laden
        }
        
        if (consent.marketing) {
            console.log('Marketing cookies enabled');
            // Marketing cookies laden
        }
        
        console.log('Applied cookie settings:', consent);
    }

    acceptAllCookies() {
        const consent = {
            necessary: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        };
        
        this.setCookie(this.cookieName, consent, this.cookieExpiry);
        this.applyCookieSettings(consent);
        this.hideBanner();
    }

    acceptNecessaryCookies() {
        const consent = {
            necessary: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        };
        
        this.setCookie(this.cookieName, consent, this.cookieExpiry);
        this.applyCookieSettings(consent);
        this.hideBanner();
    }

    openCookieSettings() {
        const modal = document.getElementById('cookieModal');
        if (modal) {
            // Load current settings
            const consent = this.getCookie(this.cookieName);
            if (consent) {
                document.getElementById('analyticsCookies').checked = consent.analytics;
                document.getElementById('marketingCookies').checked = consent.marketing;
            }
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeCookieSettings() {
        const modal = document.getElementById('cookieModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    saveCookieSettings() {
        const consent = {
            necessary: true,
            analytics: document.getElementById('analyticsCookies').checked,
            marketing: document.getElementById('marketingCookies').checked,
            timestamp: new Date().toISOString()
        };
        
        this.setCookie(this.cookieName, consent, this.cookieExpiry);
        this.applyCookieSettings(consent);
        this.closeCookieSettings();
        this.hideBanner();
    }

    declineAllCookies() {
        this.acceptNecessaryCookies();
        this.closeCookieSettings();
    }

    // NEUE METHODE: Öffentliche Methode zum Ändern der Sprache
    setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            this.updateTexts();
        }
    }

    resetConsent() {
        document.cookie = `${this.cookieName}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
        location.reload();
    }
}

// Initialize Cookie Banner
let cookieBanner;
document.addEventListener('DOMContentLoaded', function() {
    cookieBanner = new AdaptiveCookieBanner();
});

// Global functions for buttons
function acceptAllCookies() {
    cookieBanner.acceptAllCookies();
}

function acceptNecessaryCookies() {
    cookieBanner.acceptNecessaryCookies();
}

function openCookieSettings() {
    cookieBanner.openCookieSettings();
}

function closeCookieSettings() {
    cookieBanner.closeCookieSettings();
}

function saveCookieSettings() {
    cookieBanner.saveCookieSettings();
}

function declineAllCookies() {
    cookieBanner.declineAllCookies();
}

// NEUE GLOBALE FUNKTION: Cookie-Banner Sprache ändern
function setCookieBannerLanguage(language) {
    if (cookieBanner) {
        cookieBanner.setLanguage(language);
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('cookieModal');
    if (event.target === modal) {
        closeCookieSettings();
    }
});