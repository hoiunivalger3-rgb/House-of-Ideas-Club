  "use client";
  import { useEffect, useRef, useState } from "react";
  import "./WizardingRegistrationModal.css"; 
  import { submitToBrevo } from "@/app/lib/brevo";

  const COUNTRY_CODES = [
  { value: "+213", label: "+213 DZ" },
 
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DOMAIN_TYPOS = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com",
  "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmal.com": "gmail.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.con": "hotmail.com",
  "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.con": "yahoo.com",
  "outlok.com": "outlook.com", "outlook.con": "outlook.com",
};
const REQUIRED_TEXT = ["FULL_NAME", "EMAIL", "SMS", "AGE", "WHY_INTERESTED_IN_ATTENDANCE"];
const REQUIRED_RADIO = [
  "CURRENT_STATUS",
  "HEARD_ABOUT_US",
  "PREVIOUS_ATTENDANCE",
  "ATTENDANCE_CONFIRMATION",
  "UPDATES_ABOUT_EVENTS",
];  
/**
 * @param {object} props
 * @param {boolean} [props.open]
 * @param {(value: boolean) => void} [props.onOpenChange]
 * @param {(payload: Record<string, any>) => void} [props.onSupabaseSync]
 */
  export default function WizardingRegistrationModal({
  open = undefined,
  onOpenChange = undefined,
  onSupabaseSync = undefined,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = (value) => (isControlled ? onOpenChange?.(value) : setInternalOpen(value));

  const modalRef = useRef(null);
  const formRef = useRef(null);
  const successRef = useRef(null);
  const errorRef = useRef(null);
  const [showThanks, setShowThanks] = useState(false);
  const okBtnRef = useRef(null);
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const submittingRef = useRef(false);
  
  useEffect(() => {
    const fontsId = "wizarding-google-fonts";
    const sibCssId = "wizarding-sib-styles";

    let fontsLink = document.getElementById(fontsId);
    if (!fontsLink) {
      fontsLink = document.createElement("link");
      fontsLink.id = fontsId;
      fontsLink.rel = "stylesheet";
      fontsLink.href =
        "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@500;600;700;800&family=IM+Fell+English:ital@0;1&display=swap";
      document.head.appendChild(fontsLink);
    }

    let sibStyles = document.getElementById(sibCssId);
    if (!sibStyles) {
      sibStyles = document.createElement("link");
      sibStyles.id = sibCssId;
      sibStyles.rel = "stylesheet";
      sibStyles.href = "https://sibforms.com/forms/end-form/build/sib-styles.css";
      document.head.appendChild(sibStyles);
    }

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

    const scriptSrc = "https://sibforms.com/forms/end-form/build/main.js";
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const brevoScript = document.createElement("script");
      brevoScript.src = scriptSrc;
      brevoScript.defer = true;
      document.body.appendChild(brevoScript);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (modalRef.current) modalRef.current.scrollTop = 0;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

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

   useEffect(() => {
    if (!showThanks) return;
    okBtnRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showThanks]);

  const handleThanksOk = () => setShowThanks(false);

  const processSubmit = async () => {
  if (!formRef.current) return;
        setFormError("");
    setEmailError("");
    const data = new FormData(formRef.current);

    // 1. Required fields
    const missing = [
      ...REQUIRED_TEXT.filter((n) => !(data.get(n) || "").toString().trim()),
      ...REQUIRED_RADIO.filter((n) => !data.get(n)),
    ];
    if (missing.length > 0) {
      setFormError("Please fill in all the required fields (marked with *).");
      const first = formRef.current.querySelector(`[name="${missing[0]}"]`);
      first?.closest(".sib-form-block")?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (first && first.type !== "radio") first.focus();
      return;
    }

    // 2. Age and phone format
    if (!/^\d{1,3}$/.test((data.get("AGE") || "").toString().trim())) {
      setFormError("Please enter your age as a number.");
      return;
    }
    const phoneDigits = (data.get("SMS") || "").toString().replace(/[\s-]/g, "");
    if (!/^\d{6,19}$/.test(phoneDigits)) {
      setFormError("Please enter a valid phone number (6 to 19 digits).");
      return;
    }

    // 3. Email format, typos, and domain check
    const email = (data.get("EMAIL") || "").toString().trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    const [mailName, mailDomain] = email.split("@");
    if (DOMAIN_TYPOS[mailDomain]) {
      setEmailError(`Did you mean ${mailName}@${DOMAIN_TYPOS[mailDomain]} ?`);
      return;
    }
    try {
      const res = await fetch("/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const check = await res.json();
      if (!check.valid) {
        setEmailError(check.reason);
        return;
      }
    } catch {
      // if the check can't run, let the registration continue
    }
    try {
      const submittedData = await submitToBrevo(formRef.current);

      if (errorRef.current) errorRef.current.style.display = "none";

      if (onSupabaseSync) {
        const fd = new FormData(formRef.current);
        await onSupabaseSync({
          full_name: (fd.get("FULL_NAME") || "").toString().trim(),
          email: (fd.get("EMAIL") || "").toString().trim().toLowerCase(),
          phone: submittedData.SMS || null,
          age: (fd.get("AGE") || "").toString().trim(),
          current_status: fd.get("CURRENT_STATUS")?.toString() || null,
          heard_about_us: fd.get("HEARD_ABOUT_US")?.toString() || null,
          heard_about_us_other:
            (fd.get("HEARD_ABOUT_US_OTHER") || "").toString().trim() || null,
          previous_attendance: fd.get("PREVIOUS_ATTENDANCE")?.toString() || null,
          attended_experience:
            (fd.get("ATTENDED_EXPERIENCE") || "").toString().trim() || null,
          why_interested: (fd.get("WHY_INTERESTED_IN_ATTENDANCE") || "")
            .toString()
            .trim(),
          attendance_confirmation:
            fd.get("ATTENDANCE_CONFIRMATION")?.toString() || null,
          updates_about_events:
            fd.get("UPDATES_ABOUT_EVENTS")?.toString() || null,
          additional_comments:
            (fd.get("ADDITIONAL_COMMENTS_OR_QUESTIONS") || "").toString().trim() ||
            null,
        });
      }

      formRef.current.reset();
      setIsOpen(false);
      setShowThanks(true);
    } catch (err) {
      console.error("Registration submission failed:", err);
      if (errorRef.current) errorRef.current.style.display = "block";
    }
  };
  const handleFormSubmit = async (e) => {
  e.preventDefault();
  if (submittingRef.current) return;
  submittingRef.current = true;
  try {
    await processSubmit();
  } finally {
    submittingRef.current = false;
  }
};

  return (
    <>
      {!isControlled && (
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
      )}

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

                  {/* FULL_NAME */}
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

                  {/* EMAIL */}
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
                            inputMode="email"
                            placeholder="You Email"
                            data-required="true"
                            required
                            onChange={() => emailError && setEmailError("")}
                            />
                          </div>
                        </div>
                        <label className="entry__error entry__error--primary" />
                        {emailError && <p className="email-error" role="alert">{emailError}</p>}
                      </div>
                    </div>
                  </div>

                  {/* SMS */}
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
                                  {COUNTRY_CODES.map((c, idx) => (
                                    <option key={`${c.label}-${c.value}-${idx}`} value={c.value}>
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

                  {/* AGE */}
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

                  {/* CURRENT_STATUS */}
                  <div style={{ padding: "8px 0" }}>
                    <div className="sib-radiobutton-group sib-form-block" data-required="true">
                      <div className="form__entry entry_mcq">
                        <div className="form__label-row">
                          <label className="entry__label" htmlFor="CURRENT_STATUS" data-required="*">
                            What do you do
                          </label>
                          <div>
                            <div className="entry__choice">
                              <label>
                                <input type="radio" name="CURRENT_STATUS" className="input_replaced" value="1" required />
                                <span className="radio-button" />
                                <span>Studies</span>
                              </label>
                            </div>
                            <div className="entry__choice">
                              <label>
                                <input type="radio" name="CURRENT_STATUS" className="input_replaced" value="2" required />
                                <span className="radio-button" />
                                <span>Works</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <label className="entry__error entry__error--primary" />
                      </div>
                    </div>
                  </div>

                  {/* HEARD_ABOUT_US */}
                  <div style={{ padding: "8px 0" }}>
                    <div className="sib-radiobutton-group sib-form-block" data-required="true">
                      <div className="form__entry entry_mcq">
                        <div className="form__label-row">
                          <label className="entry__label" htmlFor="HEARD_ABOUT_US" data-required="*">
                            How did you hear about this event?
                          </label>
                          <div>
                            <div className="entry__choice">
                              <label>
                                <input type="radio" name="HEARD_ABOUT_US" className="input_replaced" value="1" required />
                                <span className="radio-button" />
                                <span>Instagram</span>
                              </label>
                            </div>
                            <div className="entry__choice">
                              <label>
                                <input type="radio" name="HEARD_ABOUT_US" className="input_replaced" value="2" required />
                                <span className="radio-button" />
                                <span>Friend or colleague</span>
                              </label>
                            </div>
                            <div className="entry__choice">
                              <label>
                                <input type="radio" name="HEARD_ABOUT_US" className="input_replaced" value="3" required />
                                <span className="radio-button" />
                                <span>HI Club member</span>
                              </label>
                            </div>
                            <div className="entry__choice">
                              <label>
                                <input type="radio" name="HEARD_ABOUT_US" className="input_replaced" value="4" required />
                                <span className="radio-button" />
                                <span>Other :</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <label className="entry__error entry__error--primary" />
                      </div>
                    </div>
                  </div>

                  {/* HEARD_ABOUT_US_OTHER */}
                  <div style={{ padding: "8px 0" }}>
                    <div className="sib-input sib-form-block">
                      <div className="form__entry entry_block">
                        <div className="form__label-row">
                          <div className="entry__field">
                            <input
                              className="input"
                              maxLength={200}
                              type="text"
                              id="HEARD_ABOUT_US_OTHER"
                              name="HEARD_ABOUT_US_OTHER"
                              autoComplete="off"
                              placeholder="If other, please specify..."
                            />
                          </div>
                        </div>
                        <label className="entry__error entry__error--primary" />
                      </div>
                    </div>
                  </div>

                  {/* PREVIOUS_ATTENDANCE */}
                  <div style={{ padding: "8px 0" }}>
                    <div className="sib-radiobutton-group sib-form-block" data-required="true">
                      <div className="form__entry entry_mcq">
                        <div className="form__label-row">
                          <label className="entry__label" htmlFor="PREVIOUS_ATTENDANCE" data-required="*">
                            Have you attended HI Club events before?
                          </label>
                          <div>
                            <div className="entry__choice">
                              <label>
                                <input type="radio" name="PREVIOUS_ATTENDANCE" className="input_replaced" value="1" required />
                                <span className="radio-button" />
                                <span>Yes</span>
                              </label>
                            </div>
                            <div className="entry__choice">
                              <label>
                                <input type="radio" name="PREVIOUS_ATTENDANCE" className="input_replaced" value="2" required />
                                <span className="radio-button" />
                                <span>No</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <label className="entry__error entry__error--primary" />
                      </div>
                    </div>
                  </div>

                  {/* ATTENDED_EXPERIENCE */}
                  <div style={{ padding: "8px 0" }}>
                    <div className="sib-input sib-form-block">
                      <div className="form__entry entry_block">
                        <div className="form__label-row">
                          <label className="entry__label" htmlFor="ATTENDED_EXPERIENCE">
                            If yes, How was your experience?
                          </label>
                          <div className="entry__field">
                            <input
                              className="input"
                              maxLength={200}
                              type="text"
                              id="ATTENDED_EXPERIENCE"
                              name="ATTENDED_EXPERIENCE"
                              autoComplete="off"
                            />
                          </div>
                        </div>
                        <label className="entry__error entry__error--primary" />
                      </div>
                    </div>
                  </div>

                  {/* WHY_INTERESTED_IN_ATTENDANCE */}
                  <div style={{ padding: "8px 0" }}>
                    <div className="sib-input sib-form-block">
                      <div className="form__entry entry_block">
                        <div className="form__label-row">
                          <label className="entry__label" htmlFor="WHY_INTERESTED_IN_ATTENDANCE" data-required="*">
                            Why are you interested in attending this event?
                          </label>
                          <div className="entry__field">
                            <input
                              className="input"
                              maxLength={200}
                              type="text"
                              id="WHY_INTERESTED_IN_ATTENDANCE"
                              name="WHY_INTERESTED_IN_ATTENDANCE"
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

                  {/* ATTENDANCE_CONFIRMATION */}
                  <div style={{ padding: "8px 0" }}>
                    <div className="sib-radiobutton-group sib-form-block" data-required="true">
                      <div className="form__entry entry_mcq">
                        <div className="form__label-row">
                          <label className="entry__label" htmlFor="ATTENDANCE_CONFIRMATION" data-required="*">
                            Do you confirm your attendance?
                          </label>
                          <div>
                            <div className="entry__choice">
                              <label>
                                <input type="radio" name="ATTENDANCE_CONFIRMATION" className="input_replaced" value="1" required />
                                <span className="radio-button" />
                                <span>Yes, I confirm.</span>
                              </label>
                            </div>
                            <div className="entry__choice">
                              <label>
                                <input type="radio" name="ATTENDANCE_CONFIRMATION" className="input_replaced" value="2" required />
                                <span className="radio-button" />
                                <span>Not sure yet.</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <label className="entry__error entry__error--primary" />
                      </div>
                    </div>
                  </div>

                  {/* UPDATES_ABOUT_EVENTS */}
                  <div style={{ padding: "8px 0" }}>
                    <div className="sib-radiobutton-group sib-form-block" data-required="true">
                      <div className="form__entry entry_mcq">
                        <div className="form__label-row">
                          <label className="entry__label" htmlFor="UPDATES_ABOUT_EVENTS" data-required="*">
                            Would you like to receive updates about future events organized by HI Club?
                          </label>
                          <div>
                            <div className="entry__choice">
                              <label>
                                <input type="radio" name="UPDATES_ABOUT_EVENTS" className="input_replaced" value="1" required />
                                <span className="radio-button" />
                                <span>Yes</span>
                              </label>
                            </div>
                            <div className="entry__choice">
                              <label>
                                <input type="radio" name="UPDATES_ABOUT_EVENTS" className="input_replaced" value="2" required />
                                <span className="radio-button" />
                                <span>No</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <label className="entry__error entry__error--primary" />
                      </div>
                    </div>
                  </div>

                  {/* ADDITIONAL_COMMENTS_OR_QUESTIONS */}
                  <div style={{ padding: "8px 0" }}>
                    <div className="sib-input sib-form-block">
                      <div className="form__entry entry_block">
                        <div className="form__label-row">
                          <label className="entry__label" htmlFor="ADDITIONAL_COMMENTS_OR_QUESTIONS">
                            Any Additional Comments or Questions?
                          </label>
                          <div className="entry__field">
                            <input
                              className="input"
                              maxLength={200}
                              type="text"
                              id="ADDITIONAL_COMMENTS_OR_QUESTIONS"
                              name="ADDITIONAL_COMMENTS_OR_QUESTIONS"
                              autoComplete="off"
                            />
                          </div>
                        </div>
                        <label className="entry__error entry__error--primary" />
                      </div>
                    </div>
                  </div>

                  <div className="ink-divider" aria-hidden="true">
                  <span>&#10022; &#9830; &#10022;</span>
                  </div>

                  {formError && <p className="email-error" role="alert">{formError}</p>}

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
      {showThanks && (
        <div
          className="thanks-backdrop"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="thanks-title"
          aria-describedby="thanks-text"
        >
          <div className="thanks-card">
            <div className="thanks-ornament" aria-hidden="true">&#10022; &#9830; &#10022;</div>
            <h3 id="thanks-title">Registration Confirmed</h3>
            <p id="thanks-text">
              You have been successfully confirmed to our event, please check your email
            </p>
            <button ref={okBtnRef} type="button" className="thanks-ok" onClick={handleThanksOk}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}