document.addEventListener('DOMContentLoaded', function() {
    // DOM-Elemente cachen (verbessert Performance)
    const logo = document.querySelector('.logo');
    const header = document.querySelector('header');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuItems = document.querySelectorAll('#mobile-menu a, #mobile-menu button');
    const languageToggle = document.getElementById('language-toggle');
    const mobileLanguageToggle = document.getElementById('mobile-language-toggle');
    const parallaxImages = document.querySelectorAll('.image-parallax');
    const stickyImage = document.querySelector('.sticky-image');
    const glassCircles = document.querySelectorAll('.glass-circle');
    const lightRays = document.querySelector('.light-rays');
    const contactForm = document.querySelector('.contact-form');
    const formStatus = document.getElementById('form-status');
    
    // Zustandsvariablen
    let menuOpen = false;
    let currentLanguage = 'de';
    
    // 1. Debounce-Funktion für Performance-Optimierung bei Scroll-Events
    function debounce(func, wait = 10, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // 2. Verbesserte Toggle-Funktion für das mobile Menü
    function toggleMobileMenu(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if (menuOpen) {
            // Menü schließen mit Animation
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Menü öffnen');
            menuToggle.classList.remove('active');
            
            // ARIA für Barrierefreiheit
            mobileMenu.setAttribute('aria-hidden', 'true');
            
            // Animation der Menüpunkte
            mobileMenuItems.forEach((item, index) => {
                // Verzögerung in umgekehrter Reihenfolge für schönere Animation
                const delay = (mobileMenuItems.length - index - 1) * 50;
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-10px)';
                }, delay);
            });
            
            // Nach Animation ausblenden
            setTimeout(() => {
                mobileMenu.style.display = 'none';
                document.body.classList.remove('menu-open'); // Scrolling wiederherstellen
            }, 300);
            
            menuOpen = false;
        } else {
            // Menü öffnen mit Animation
            mobileMenu.style.display = 'block';
            menuToggle.setAttribute('aria-expanded', 'true');
            menuToggle.setAttribute('aria-label', 'Menü schließen');
            menuToggle.classList.add('active');
            
            // ARIA für Barrierefreiheit
            mobileMenu.setAttribute('aria-hidden', 'false');
            
            // Scrolling verhindern
            document.body.classList.add('menu-open');
            
            // Animation mit Verzögerung für Menüpunkte
            setTimeout(() => {
                mobileMenuItems.forEach((item, index) => {
                    const delay = index * 50; // Verzögerung für gestaffelte Animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, delay);
                });
            }, 10);
            
            menuOpen = true;
        }
    }
    
    // 3. Aktualisierer für aktiven Menüpunkt basierend auf Scrollposition
    const updateActiveMenuItem = debounce(function() {
        const scrollPos = window.scrollY + 60; // +60 für Header-Offset
        
        // Alle Abschnitte und ihre Menüpunkte
        const sections = [
            { id: 'home', navId: 'mobile-nav-home', class: 'active' },
            { id: 'about', navId: 'mobile-nav-about', class: 'about-active' },
            { id: 'services', navId: 'mobile-nav-services', class: 'services-active' },
            { id: 'info', navId: 'mobile-nav-info', class: 'info-active' },
            { id: 'contact', navId: 'mobile-nav-contact', class: 'contact-active' }
        ];
        
        // Alle aktiven Klassen entfernen
        sections.forEach(section => {
            const navItem = document.getElementById(section.navId);
            if (navItem) {
                navItem.classList.remove('active', 'about-active', 'services-active', 'info-active', 'contact-active');
                navItem.setAttribute('aria-current', 'false');
            }
        });
        
        // Finde aktuellen Abschnitt (rückwärts durchlaufen für tiefsten sichtbaren Abschnitt)
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i].id);
            
            if (section && scrollPos >= section.offsetTop - 100) {
                const navItem = document.getElementById(sections[i].navId);
                if (navItem) {
                    navItem.classList.add(sections[i].class);
                    navItem.setAttribute('aria-current', 'page');
                }
                break;
            }
        }
    }, 100);
    
    // 4. Header-Stil basierend auf Scrollposition aktualisieren
    const updateHeaderStyle = debounce(function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 100);
    
    // 5. Logo-Farbe je nach Scrollposition ändern
    const updateLogoColor = debounce(function() {
        if (!logo || !languageToggle) return;
        
        const scrollPos = window.scrollY + 60;
        
        // Entferne alle Abschnittsklassen
        logo.classList.remove('about-section', 'services-section', 'info-section', 'contact-section');
        languageToggle.classList.remove('about-section', 'services-section', 'info-section', 'contact-section');
        
        if (mobileLanguageToggle) {
            mobileLanguageToggle.classList.remove('about-section', 'services-section', 'info-section', 'contact-section');
        }
        
        // Finde aktuelle Sektion und setze entsprechende Farbe
        if (document.getElementById('about') && scrollPos >= document.getElementById('about').offsetTop - 100) {
            logo.classList.add('about-section');
            languageToggle.classList.add('about-section');
            if (mobileLanguageToggle) mobileLanguageToggle.classList.add('about-section');
        }
        if (document.getElementById('services') && scrollPos >= document.getElementById('services').offsetTop - 100) {
            logo.classList.remove('about-section');
            languageToggle.classList.remove('about-section');
            if (mobileLanguageToggle) mobileLanguageToggle.classList.remove('about-section');
            
            logo.classList.add('services-section');
            languageToggle.classList.add('services-section');
            if (mobileLanguageToggle) mobileLanguageToggle.classList.add('services-section');
        }
        if (document.getElementById('info') && scrollPos >= document.getElementById('info').offsetTop - 100) {
            logo.classList.remove('services-section');
            languageToggle.classList.remove('services-section');
            if (mobileLanguageToggle) mobileLanguageToggle.classList.remove('services-section');
            
            logo.classList.add('info-section');
            languageToggle.classList.add('info-section');
            if (mobileLanguageToggle) mobileLanguageToggle.classList.add('info-section');
        }
        if (document.getElementById('contact') && scrollPos >= document.getElementById('contact').offsetTop - 100) {
            logo.classList.remove('info-section');
            languageToggle.classList.remove('info-section');
            if (mobileLanguageToggle) mobileLanguageToggle.classList.remove('info-section');
            
            logo.classList.add('contact-section');
            languageToggle.classList.add('contact-section');
            if (mobileLanguageToggle) mobileLanguageToggle.classList.add('contact-section');
        }
    }, 100);
    
    // 6. Parallax- und Scroll-Effekte für Bilder
    const updateParallaxEffects = debounce(function() {
        // Parallax-Bilder-Effekte
        parallaxImages.forEach(image => {
            const container = image.closest('[data-parallax-intensity]');
            if (!container) return;
            
            const intensity = parseFloat(container.dataset.parallaxIntensity) / 10;
            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Nur anwenden, wenn im Viewport
            if (rect.top < viewportHeight && rect.bottom > 0) {
                // Berechne Scroll-Fortschritt (0 bis 1)
                const scrollProgress = 1 - (rect.top + rect.height / 2) / (viewportHeight + rect.height);
                
                // Skalierungseffekt anwenden
                const scale = 1 + (scrollProgress * 0.1);
                image.style.transform = `scale(${Math.min(1.1, scale)})`;
            }
        });
        
        // Apple-Style Sticky-Bild-Effekt
        if (stickyImage) {
            const stickyContainer = stickyImage.closest('.sticky-container');
            if (!stickyContainer) return;
            
            const containerTop = stickyContainer.offsetTop;
            const containerHeight = stickyContainer.offsetHeight;
            
            // Berechne Scroll-Fortschritt durch den Container
            const scrollPosition = window.scrollY - containerTop;
            const scrollRatio = Math.min(1, Math.max(0, scrollPosition / containerHeight));
            
            // Wende Transformationen an
            const scale = 1 - (scrollRatio * 0.3);
            const opacity = 1 - (scrollRatio * 0.7);
            
            stickyImage.style.transform = `translateY(-50%) scale(${scale})`;
            stickyImage.style.opacity = opacity;
        }
        
        // Glaskreise und Lichtstrahlen ausblenden beim Scrollen
        if (glassCircles.length && lightRays) {
            const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;
            if (heroHeight > 0) {
                // Berechne Fade-Ratio basierend auf Scroll-Position
                const fadeRatio = Math.max(0, 1 - (window.scrollY / heroHeight));
                
                // Wende Fading auf Glaskreise und Lichtstrahlen an
                glassCircles.forEach(circle => {
                    circle.style.opacity = 0.8 * fadeRatio;
                });
                
                lightRays.style.opacity = 0.6 * fadeRatio;
            }
        }
    }, 100);
    
    // 7. Sprachumschaltung initialisieren
    function initLanguageSwitcher() {
        // Übersetzungen für die UI-Elemente
        const translations = {
            de: {
                'nav-home': 'Home',
                'nav-about': 'Euer Tag',
                'nav-services': 'Leistungen',
                'nav-info': 'Infos',
                'nav-contact': 'Kontakt',
                'lang-switch': 'EN',
                'hero-text': 'Heiraten mit Stil. Und STEEL.',
                'cta-button': 'Anfrage senden',
                'about-title': 'Euer Tag rückt näher. Und jetzt?',
                'services-title': 'Eure Hochzeitsfeier',
                'info-title': 'Das solltet ihr noch wissen.',
                'contact-title': 'Passt? Prima.',
                'form-name': 'Name',
                'form-email': 'E-Mail',
                'form-phone': 'Telefon/Handy',
                'form-date': 'Hochzeitsdatum',
                'form-location': 'Ort',
                'form-details': 'Details',
                'submit-btn': 'Anfrage senden',
                'footer-contact': 'Kontakt',
                'footer-legal': 'Rechtliches',
                'copyright': '© 2025 STEELweddings. Alle Rechte vorbehalten.'
            },
            en: {
                'nav-home': 'Home',
                'nav-about': 'Your Day',
                'nav-services': 'Services',
                'nav-info': 'Info',
                'nav-contact': 'Contact',
                'lang-switch': 'DE',
                'hero-text': 'Weddings with style. And STEEL.',
                'cta-button': 'Send inquiry',
                'about-title': 'Your big day is approaching. What now?',
                'services-title': 'Your Wedding Party',
                'info-title': 'What you should know.',
                'contact-title': 'Sounds good?',
                'form-name': 'Name',
                'form-email': 'Email',
                'form-phone': 'Phone',
                'form-date': 'Wedding date',
                'form-location': 'Location',
                'form-details': 'Details',
                'submit-btn': 'Send inquiry',
                'footer-contact': 'Contact',
                'footer-legal': 'Legal',
                'copyright': '© 2025 STEELweddings. All rights reserved.'
            }
        };
        
        // Längere Texte für Englisch
        const englishTexts = {
            'about-p1': 'Your wedding is <strong>exciting</strong> – especially for you. But your loved ones are also getting dressed up and ready to celebrate. That\'s where I come in. I believe you shouldn\'t <em>have to worry about the music</em>. I\'ll make sure your party is a complete success!',
            'about-p2': 'The guests at your wedding are both young and old. To appeal to them, music should play that everyone knows (<strong>hits only!</strong>). Sometimes it\'s something from the 60s for twisting, another time from the 90s for thrashing. Current charts and <strong>electronic beats</strong> are also essential. All wrapped in a mix that doesn\'t scare anyone but still feels like you\'re in a club.',
            'about-p3': 'Songs that connect you and your guests also play an important role here. <strong>#BachelorParty</strong>',
            'service1-title': 'Finally, it\'s starting.',
            'service1-p1': 'To open the dance floor, you are asked: Whether a <strong>Viennese Waltz</strong> or a <strong>Disco Fox</strong>, sometimes just a cozy swinging: Your song selection starts the party and an unforgettable night. Choose wisely – I\'m happy to support you.',
            'service1-p2': 'You don\'t want a <strong>first dance</strong>? No problem. It\'s your wedding, and we\'ll design it the way you want it.',
            'service2-title': 'Let\'s party.',
            'service2-p1': 'Once the party is in full swing, there\'s no stopping. <strong>Live Mashups</strong> transport your guests to a different sound world – far away from the usual radio noise. I\'m happy to incorporate music requests at the right place in the mix.',
            'service2-p2': 'At the latest when <strong>Beyoncé</strong> invites the next lucky ones to catch the bridal bouquet with her Single Ladies, the dance floor is safe from no hit (and guest)!',
            'service3-title': 'Great technology.',
            'service3-p1': 'Have you ever heard of <strong>Fohhn</strong>? Since 1993, the German company has been producing premium sound systems – all made in Germany. Depending on the location, my Fohhn system is sufficient for up to 200 people and more. So when I DJ, not only is the music selection right, but also the sound quality.',
            'service3-p2': '<strong>Lighting</strong> is often undervalued in my opinion. Yet controllable lights create an epic atmosphere during the party and great photos afterward. With ambient spots, I can accurately set the scene at your location and create a cozy basic mood just with light as soon as it gets dark outside.',
            'service3-p3': 'For even more <strong>club atmosphere</strong>, I have fog on request to really bring out the light beams in the room.',
            'info-p1': 'I originally come from the <strong>club scene</strong> and still regularly DJ in discotheques today. Transitions and mixing are therefore very important to me. Above all, I make sure that consecutive songs fit together. I incorporate music requests at the point where they fit in. I basically don\'t play genres criss-cross – I\'m not a jukebox. If you want to experience me live: On <a href="https://instagram.com/steelofficial" target="_blank">Instagram</a>, I regularly announce when and where I\'m performing.',
            'info-p2': 'Musically, I\'m an <strong>all-rounder</strong> (open format). I\'m also very knowledgeable about electronic music (<a href="https://linktr.ee/STEELofficial" target="_blank">and as STEEL, I also release such music myself</a>). I\'m definitely not the right person for weddings with a high proportion of German folk or après-ski music. There are other DJs for that.',
            'info-p3': 'I\'m a <strong>DJ, not an entertainer or animator</strong>. I therefore focus on DJing and only rarely use the microphone when it fits well.',
            'info-p4': 'By the way: I\'m a member of the <strong><a href="https://lovecrew-ruhrpott.de" target="_blank">Lovecrew Ruhrpott</a></strong>. This is an association of the best wedding service providers in the Ruhr area. If you\'re just starting your wedding planning, be sure to check it out!',
            'contact-p1': 'Are you already getting excited about your wedding celebration? Very cool! Just ask, maybe I still have a date available. To be on the safe side, you should contact me about a year before your wedding. But I\'m sometimes available spontaneously too.',
            'contact-p2': 'My prices start at <span class="highlight">1500,- €</span> (incl. VAT) for 7 hours and depend on what time I should start. I always play until at least 3 am. Open end on request!'
        };
        
        // Form placeholders in English
        const englishPlaceholders = {
            'name': 'Who\'s getting married? :)',
            'email': 'dreamcouple@email.com',
            'phone': 'I call you maybe',
            'location': 'Where will the party take place?',
            'message': 'e.g. schedule, start time, number of guests, music'
        };
        
        // Funktion zum Umschalten der Sprache
        const switchLanguage = function(e) {
            if (e) e.preventDefault();
            
            currentLanguage = currentLanguage === 'de' ? 'en' : 'de';
            document.documentElement.lang = currentLanguage;
            
            // Aktualisiere den Text der Sprachumschalter
            if (languageToggle) {
                languageToggle.textContent = translations[currentLanguage]['lang-switch'];
            }
            if (mobileLanguageToggle) {
                mobileLanguageToggle.textContent = translations[currentLanguage]['lang-switch'];
            }
            
            try {
                // Aktualisiere Basis-UI-Elemente
                document.querySelectorAll('.nav-links li a').forEach((link, index) => {
                    const keys = ['nav-home', 'nav-about', 'nav-services', 'nav-info', 'nav-contact'];
                    if (index < keys.length) {
                        link.textContent = translations[currentLanguage][keys[index]];
                    }
                });
                
                // Aktualisiere Abschnittsüberschriften und Hero
                document.querySelector('.hero p').textContent = translations[currentLanguage]['hero-text'];
                document.querySelector('.cta-button').textContent = translations[currentLanguage]['cta-button'];
                document.querySelector('.about-title').textContent = translations[currentLanguage]['about-title'];
                document.querySelector('.services-title').textContent = translations[currentLanguage]['services-title'];
                document.querySelector('.info-title').textContent = translations[currentLanguage]['info-title'];
                document.querySelector('.contact-title').textContent = translations[currentLanguage]['contact-title'];
                
                // Aktualisiere Formularelemente
                document.querySelector('label[for="name"]').textContent = translations[currentLanguage]['form-name'];
                document.querySelector('label[for="email"]').textContent = translations[currentLanguage]['form-email'];
                document.querySelector('label[for="phone"]').textContent = translations[currentLanguage]['form-phone'];
                document.querySelector('label[for="date"]').textContent = translations[currentLanguage]['form-date'];
                document.querySelector('label[for="location"]').textContent = translations[currentLanguage]['form-location'];
                document.querySelector('label[for="message"]').textContent = translations[currentLanguage]['form-details'];
                document.querySelector('.submit-btn').textContent = translations[currentLanguage]['submit-btn'];
                
                // Aktualisiere Footer-Elemente
                document.querySelector('.footer-section:nth-child(2) h3').textContent = translations[currentLanguage]['footer-contact'];
                document.querySelector('.footer-section:nth-child(3) h3').textContent = translations[currentLanguage]['footer-legal'];
                document.querySelector('.copyright p').textContent = translations[currentLanguage]['copyright'];
                
                // Aktualisiere Absätze bei Wechsel zu Englisch
                if (currentLanguage === 'en') {
                    // Aktualisiere Absätze mit englischem Inhalt
                    for (const [id, content] of Object.entries(englishTexts)) {
                        const element = document.getElementById(id);
                        if (element) element.innerHTML = content;
                    }
                    
                    // Aktualisiere Formular-Platzhalter
                    for (const [id, placeholder] of Object.entries(englishPlaceholders)) {
                        const element = document.getElementById(id);
                        if (element) element.placeholder = placeholder;
                    }
                } else {
                    // Seite neu laden, um deutschen Inhalt wiederherzustellen
                    location.reload();
                }
            } catch (error) {
                console.error('Fehler beim Sprachumschalten:', error);
            }
        };
        
        // Event-Listener für Sprachumschalter
        if (languageToggle) {
            languageToggle.addEventListener('click', switchLanguage);
        }
        
        if (mobileLanguageToggle) {
            mobileLanguageToggle.addEventListener('click', switchLanguage);
        }
        
        // Exportiere die Funktion global, um sie aus anderen Skripten aufrufen zu können
        window.switchLanguage = switchLanguage;
    }
    
    // 8. Kontaktformular initialisieren
    function initContactForm() {
        if (!contactForm || !formStatus) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validierung
            const name = document.getElementById('name')?.value;
            const email = document.getElementById('email')?.value;
            const date = document.getElementById('date')?.value;
            const location = document.getElementById('location')?.value;
            const message = document.getElementById('message')?.value;
            
            if (!name || !email || !date || !location || !message) {
                formStatus.textContent = document.documentElement.lang === 'de' ? 
                    'Bitte fülle alle Pflichtfelder aus.' : 
                    'Please fill in all required fields.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
                return;
            }
            
            // Email-Format validieren
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                formStatus.textContent = document.documentElement.lang === 'de' ? 
                    'Bitte gib eine gültige E-Mail-Adresse ein.' : 
                    'Please enter a valid email address.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
                return;
            }
            
            // Erfolgsfall simulieren (im echten Einsatz würde hier der Form-Submit erfolgen)
            formStatus.textContent = document.documentElement.lang === 'de' ? 
                'Vielen Dank für deine Anfrage! Wir melden uns in Kürze bei dir.' : 
                'Thank you for your inquiry! We will get back to you soon.';
            formStatus.className = 'form-status success';
            formStatus.style.display = 'block';
            contactForm.reset();
            
            // Nach 5 Sekunden Erfolgsmeldung ausblenden
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        });
    }
    
    // 9. Encoding-Fix für Umlaute
    function fixEncoding() {
        try {
            // Überprüfe Charset-Meta-Tag
            const charsetMeta = document.querySelector('meta[charset]');
            if (charsetMeta && charsetMeta.getAttribute('charset').toLowerCase() !== 'utf-8') {
                charsetMeta.setAttribute('charset', 'utf-8');
            }
            
            // Überprüfe Content-Type-Meta-Tag
            const contentTypeMeta = document.querySelector('meta[http-equiv="Content-Type"]');
            if (contentTypeMeta) {
                contentTypeMeta.setAttribute('content', 'text/html; charset=utf-8');
            }
        } catch (e) {
            console.error('Fehler bei der Kodierungskorrektur:', e);
        }
    }
    
    // 10. Event-Listener einrichten
    
    // Event-Listener für mobiles Menü
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
        
        // ARIA-Attribute für Barrierefreiheit
        menuToggle.setAttribute('aria-haspopup', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-controls', 'mobile-menu');
        menuToggle.setAttribute('aria-label', 'Menü öffnen');
    }
    
    // Menü bei Klick auf Menüpunkte schließen
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Sprachumschalter-Logik separat behandeln
            if (this.id === 'mobile-language-toggle') {
                e.preventDefault();
                
                // Sprachumschaltung ausführen, falls Funktion existiert
                if (typeof window.switchLanguage === 'function') {
                    window.switchLanguage(e);
                }
            }
            
            // Kurze Verzögerung, damit erst zum Anker gescrollt wird
            setTimeout(() => {
                toggleMobileMenu();
            }, 150);
        });
    });
    
    // Klick außerhalb des Menüs schließt es
    document.addEventListener('click', function(event) {
        if (menuOpen && mobileMenu && !mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            toggleMobileMenu();
        }
    });
    
    // Tastaturnavigation unterstützen
    mobileMenu.addEventListener('keydown', function(e) {
        // ESC-Taste schließt das Menü
        if (e.key === 'Escape' && menuOpen) {
            toggleMobileMenu();
        }
    });
    
    // Scroll-Events für verschiedene Effekte
    window.addEventListener('scroll', updateHeaderStyle);
    window.addEventListener('scroll', updateActiveMenuItem);
    window.addEventListener('scroll', updateLogoColor);
    window.addEventListener('scroll', updateParallaxEffects);
    
    // 11. Initialisierungen ausführen
    fixEncoding();
    initLanguageSwitcher();
    initContactForm();
    updateHeaderStyle();
    updateActiveMenuItem();
    updateLogoColor();
    
    // Debug-Ausgabe beim Laden
    console.log('Alle Initialisierungen abgeschlossen.');
});
 translations[currentLanguage][keys[index]];
                    }
                });
                
                // Aktualisiere mobile Menüpunkte
                const mobileLinks = document.querySelectorAll('#mobile-menu ul li a');
                mobileLinks.forEach((link, index) => {
                    const keys = ['nav-home', 'nav-about', 'nav-services', 'nav-info', 'nav-contact'];
                    if (index < keys.length) {
                        link.textContent =