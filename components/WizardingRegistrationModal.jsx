import { useEffect, useRef, useState } from "react";
import "./WizardingRegistrationModal.css";

const COUNTRY_CODES = [
  { value: "+213", label: "+213 DZ", selected: true },
  { value: "+1", label: "+1 US" },
  { value: "+33", label: "+33 FR" },
  { value: "+44", label: "+44 GB" },
  { value: "+212", label: "+212 MA" },
  { value: "+216", label: "+216 TN" },
  { value: "+20", label: "+20 EG" },
  { value: "+966", label: "+966 SA" },
  { value: "+971", label: "+971 AE" },
  { value: "+90", label: "+90 TR" },
  { value: "+49", label: "+49 DE" },
  { value: "+39", label: "+39 IT" },
  { value: "+34", label: "+34 ES" },
  // Add any remaining country <option> entries from wizarding_4.html here
];

export default function WizardingRegistrationModal({ onSupabaseSync }) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const formRef = useRef(null);
  const successRef = useRef(null);
  const errorRef = useRef(null);

  // Load Brevo styles, Google Fonts, and Brevo's main.js once
  useEffect(() => {
    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";

    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";

    const fontsLink = document.createElement("link");
    fontsLink.rel = "stylesheet";
    fontsLink.href =
      "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@500;600;700;800&family=IM+Fell+English:ital@0;1&display=swap";

    const sibStyles = document.createElement("link");
    sibStyles.rel = "stylesheet";
    sibStyles.href = "https://sibforms.com/forms/end-form/build/sib-styles.css";

    document.head.append(preconnect1, preconnect2, fontsLink, sibStyles);

    window.REQUIRED_CODE_ERROR_MESSAGE = "Please choose a country code";
    window.LOCALE = "en";
    window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE =
      "The information provided is invalid. Please review the field format and try again.";
    window.REQUIRED_ERROR_MESSAGE = "This field cannot be left blank. ";
    window.GENERIC_INVALID_MESSAGE =
      "The information provided is invalid. Please review the field format and try again.";
    window.INVALID_NUMBER =
      "The information provided is invalid. Please review the field format and try again.";
    window.INVALID_DATE = "Please enter a valid date";
    window.REQUIRED_MULTISELECT_MESSAGE = "Please select at least 1 option";
    window.translation = {
      common: {
        selectedList: "{quantity} list selected",
        selectedLists: "{quantity} lists selected",
        selectedOption: "{quantity} selected",
        selectedOptions: "{quantity} selected",
      },
    };
    window.AUTOHIDE = Boolean(0);

    const existingScript = document.querySelector(
      'script[src="https://sibforms.com/forms/end-form/build/main.js"]'
    );
    let brevoScript = existingScript;

    if (!existingScript) {
      brevoScript = document.createElement("script");
      brevoScript.src = "https://sibforms.com/forms/end-form/build/main.js";
      brevoScript.defer = true;
      document.body.appendChild(brevoScript);
    }

    return () => {
      [preconnect1, preconnect2, fontsLink, sibStyles].forEach((el) => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    };
  }, []);

  // Lock body scroll & handle Escape key when modal opens
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    if (modalRef.current) modalRef.current.scrollTop = 0;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  // Keep Brevo's #success-message / #error-message pinned at bottom & optionally sync to Supabase
  useEffect(() => {
    const pinBanner = (panel) => {
      if (!panel) return;
      const isShown = window.getComputedStyle(panel).display !== "none";
      if (isShown) {
        panel.style.position = "fixed";
        panel.style.bottom = "20px";
        panel.style.left = "50%";
        panel.style.transform = "translateX(-50%)";
        panel.style.zIndex = "10002";
      }
    };

    const observer = new MutationObserver(() => {
      pinBanner(successRef.current);
      pinBanner(errorRef.current);
    });

    [successRef.current, errorRef.current].forEach((panel) => {
      if (panel) {
        observer.observe(panel, { attributes: true, attributeFilter: ["style", "class"] });
      }
    });

    return () => observer.disconnect();
  }, []);

  // Optional: capture form values on submit to pass to your Supabase helper
  const handleFormSubmit = () => {
    if (!onSupabaseSync || !formRef.current) return;
    const fd = new FormData(formRef.current);
    const countryCode = (fd.get("SMS__COUNTRY_CODE") || "").toString().replace(/^\+/, "");
    const rawPhone = (fd.get("SMS") || "").toString().trim();

    onSupabaseSync({
      full_name: (fd.get("FULL_NAME") || "").toString().trim(),
      email: (fd.get("EMAIL") || "").toString().trim().toLowerCase(),
      phone: rawPhone ? `${countryCode}${rawPhone}` : null,
    });
  };

  return (
    <>
      <div className="envelope-section">
        <div className="wax-envelope-wrapper">
          <img
            src="https://i.imgur.com/wxXjlBk.jpeg"
            referrerPolicy="no-referrer"
            alt="Sealed parchment envelope"
          />
          <button
            type="button"
            className="wax-seal-trigger"
            aria-label="Click the red wax seal to open the registration form"
            title="Click the red wax seal to open"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>

      <div
        id="register-modal"
        ref={modalRef}
        className={`scroll-popup-backdrop ${isOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        onClick={(e) => {
          if (e.target === modalRef.current) setIsOpen(false);
        }}
      >
        <button
          type="button"
          id="close-register-modal"
          className="scroll-popup-close"
          aria-label="Close registration form"
          onClick={() => setIsOpen(false)}
        >
          &times;
        </button>

        <svg
          width="0"
          height="0"
          style={{ position: "absolute", pointerEvents: "none" }}
          aria-hidden="true"
        >
          <defs>
            <filter id="parchment-edge-displacement" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.035"
                numOctaves="4"
                seed="14"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="9"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        <div className="sib-form" style={{ textAlign: "center" }}>
          <div id="sib-form-container" className="sib-form-container">
            <div
              id="error-message"
              ref={errorRef}
              className="sib-form-message-panel"
              style={{ fontSize: "16px", textAlign: "left" }}
            >
              <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                <span className="sib-form-message-panel__inner-text">
                  Your subscription could not be saved. Please try again.
                </span>
              </div>
            </div>

            <div
              id="success-message"
              ref={successRef}
              className="sib-form-message-panel"
              style={{ fontSize: "16px", textAlign: "left" }}
            >
              <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                <span className="sib-form-message-panel__inner-text">
                  Your have been successfully confirmed to our event, please check your email
                </span>
              </div>
            </div>

            <div className="scroll-assembly">
              <div className="scroll-cylinder scroll-cylinder--top" aria-hidden="true" />

              <div
                id="sib-container"
                className="sib-container--large sib-container--vertical"
                style={{ direction: "ltr" }}
              >
                <form
                  id="sib-form"
                  ref={formRef}
                  method="POST"
                  action="https://565bfdea.sibforms.com/serve/MUIFAAB36kzCUiK0yaR9DhyrF_tIatXJ6fa5LcNHW9qmdhxPu_mSgDanQ2URRSOSfr9ALJsjqKT7FgWJUPdqQFfwawU6GoBLC5AIaeP-zmOn3QLc2ytRzDefO6TJ7Lx8Jg0lYjwAqOE3spkmIvx1E5NYPfWAB-9T2cpCAbaC52atks4Ffl6jfAjuxusr3rw0nl1cW2b244Vohxnh-w=="
                  data-type="subscription"
                  onSubmit={handleFormSubmit}
                >
                  <div style={{ padding: "4px 0" }}>
                    <div className="sib-form-block wizarding-title">
                      <p>Registeration</p>
                    </div>
                  </div>

                  <div style={{ padding: "4px 0" }}>
                    <div className="sib-form-block wizarding-subtitle">
                      <div className="sib-text-form-block">
                        <p>Register now and be part in our event !</p>
                      </div>
                    </div>
                  </div>

                  <div className="ink-divider" aria-hidden="true">
                    <span>&#10022; &#9830; &#10022;</span>
                  </div>

                  <div style={{ padding: "8px 0" }}>
                    <div className="sib-input sib-form-block">
                      <div className="form__entry entry_block">
                        <div className="form__label-row">
                          <label className="entry__label" htmlFor="FULL_NAME" data-required="*">
                            Enter your FULL NAME
                          </label>
                          <div className="entry__field">
                            <input
                              className="input"
                              maxLength={200}
                              type="text"
                              id="FULL_NAME"
                              name="FULL_NAME"
                              autoComplete="off"
                              placeholder="FULL NAME"
                              data-required="true"
                              required
                            />
                          </div>
                        </div>
                        <label className="entry__error entry__error--primary" />
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "8px 0" }}>
                    <div className="sib-input sib-form-block">
                      <div className="form__entry entry_block">
                        <div className="form__label-row">
                          <label className="entry__label" htmlFor="EMAIL" data-required="*">
                            Enter your email address
                          </label>
                          <div className="entry__field">
                            <input
                              className="input"
                              type="text"
                              id="EMAIL"
                              name="EMAIL"
                              autoComplete="off"
                              placeholder="You Email"
                              data-required="true"
                              required
                            />
                          </div>
                        </div>
                        <label className="entry__error entry__error--primary" />
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "8px 0" }}>
                    <div className="sib-sms-field sib-form-block">
                      <div className="form__entry entry_block">
                        <div className="form__label-row">
                          <label className="entry__label" htmlFor="SMS" data-required="*">
                            Enter your Phone Number
                          </label>
                          <div className="sib-sms-input-wrapper" style={{ direction: "ltr" }}>
                            <div
                              className="sib-sms-input"
                              data-placeholder=""
                              data-required="true"
                              data-country-code="DZ"
                              data-value=""
                              data-attributename="SMS"
                            >
                              <div className="entry__field">
                                <select
                                  className="input"
                                  name="SMS__COUNTRY_CODE"
                                  defaultValue="+213"
                                  data-required="true"
                                >
                                  {COUNTRY_CODES.map((c) => (
                                    <option key={`${c.label}-${c.value}`} value={c.value}>
                                      {c.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="entry__field" style={{ width: "100%" }}>
                                <input
                                  type="tel"
                                  className="input"
                                  id="SMS"
                                  name="SMS"
                                  autoComplete="off"
                                  placeholder="SMS"
                                  data-required="true"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <label className="entry__error entry__error--primary" />
                        <label className="entry__error entry__error--secondary" />
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "8px 0" }}>
                    <div className="sib-input sib-form-block">
                      <div className="form__entry entry_block">
                        <div className="form__label-row">
                          <label className="entry__label" htmlFor="AGE" data-required="*">
                            Enter your AGE
                          </label>
                          <div className="entry__field">
                            <input
                              maxLength={200}
                              type="text"
                              data-numeric="true"
                              className="input"
                              id="AGE"
                              name="AGE"
                              autoComplete="off"
                              data-required="true"
                              required
                            />
                          </div>
                        </div>
                        <label className="entry__error entry__error--primary" />
                      </div>
                    </div>
                  </div>

                  {/* Keep the remaining radio & input blocks from wizarding_4.html using htmlFor and style={{ ... }} */}

                  <div className="ink-divider" aria-hidden="true">
                    <span>&#10022; &#9830; &#10022;</span>
                  </div>

                  <div style={{ padding: "8px 0" }}>
                    <div className="sib-form-block submit-button-wrapper">
                      <button
                        className="sib-form-block__button sib-form-block__button-with-loader"
                        form="sib-form"
                        type="submit"
                      >
                        <span>Register</span>
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    name="email_address_check"
                    defaultValue=""
                    className="input--hidden"
                  />
                  <input type="hidden" name="locale" defaultValue="en" />
                </form>
              </div>

              <div className="scroll-cylinder scroll-cylinder--bottom" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}