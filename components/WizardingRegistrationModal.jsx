  "use client";
  import { useEffect, useRef, useState } from "react";
  import "./WizardingRegistrationModal.css"; 
  import { submitToBrevo } from "@/app/lib/brevo";

  const COUNTRY_CODES = [
  { value: "+93", label: "+93 AF" },
  { value: "+358", label: "+358 AX" },
  { value: "+355", label: "+355 AL" },
  { value: "+213", label: "+213 DZ" },
  { value: "+1684", label: "+1684 AS" },
  { value: "+376", label: "+376 AD" },
  { value: "+244", label: "+244 AO" },
  { value: "+1264", label: "+1264 AI" },
  { value: "+672", label: "+672 AQ" },
  { value: "+1268", label: "+1268 AG" },
  { value: "+54", label: "+54 AR" },
  { value: "+374", label: "+374 AM" },
  { value: "+297", label: "+297 AW" },
  { value: "+61", label: "+61 AU" },
  { value: "+43", label: "+43 AT" },
  { value: "+994", label: "+994 AZ" },
  { value: "+1242", label: "+1242 BS" },
  { value: "+973", label: "+973 BH" },
  { value: "+880", label: "+880 BD" },
  { value: "+1246", label: "+1246 BB" },
  { value: "+375", label: "+375 BY" },
  { value: "+32", label: "+32 BE" },
  { value: "+501", label: "+501 BZ" },
  { value: "+229", label: "+229 BJ" },
  { value: "+1441", label: "+1441 BM" },
  { value: "+975", label: "+975 BT" },
  { value: "+591", label: "+591 BO" },
  { value: "+599", label: "+599 BQ" },
  { value: "+387", label: "+387 BA" },
  { value: "+267", label: "+267 BW" },
  { value: "+47", label: "+47 BV" },
  { value: "+55", label: "+55 BR" },
  { value: "+246", label: "+246 IO" },
  { value: "+673", label: "+673 BN" },
  { value: "+359", label: "+359 BG" },
  { value: "+226", label: "+226 BF" },
  { value: "+257", label: "+257 BI" },
  { value: "+855", label: "+855 KH" },
  { value: "+237", label: "+237 CM" },
  { value: "+1", label: "+1 CA" },
  { value: "+34", label: "+34 IC" },
  { value: "+238", label: "+238 CV" },
  { value: "+1345", label: "+1345 KY" },
  { value: "+236", label: "+236 CF" },
  { value: "+34", label: "+34 EA" },
  { value: "+235", label: "+235 TD" },
  { value: "+56", label: "+56 CL" },
  { value: "+86", label: "+86 CN" },
  { value: "+61", label: "+61 CX" },
  { value: "+61", label: "+61 CC" },
  { value: "+57", label: "+57 CO" },
  { value: "+269", label: "+269 KM" },
  { value: "+242", label: "+242 CG" },
  { value: "+243", label: "+243 CD" },
  { value: "+682", label: "+682 CK" },
  { value: "+506", label: "+506 CR" },
  { value: "+225", label: "+225 CI" },
  { value: "+385", label: "+385 HR" },
  { value: "+53", label: "+53 CU" },
  { value: "+599", label: "+599 CW" },
  { value: "+357", label: "+357 CY" },
  { value: "+420", label: "+420 CZ" },
  { value: "+45", label: "+45 DK" },
  { value: "+253", label: "+253 DJ" },
  { value: "+1767", label: "+1767 DM" },
  { value: "+1809", label: "+1809 DO" },
  { value: "+1829", label: "+1829 DO" },
  { value: "+1849", label: "+1849 DO" },
  { value: "+593", label: "+593 EC" },
  { value: "+20", label: "+20 EG" },
  { value: "+503", label: "+503 SV" },
  { value: "+240", label: "+240 GQ" },
  { value: "+291", label: "+291 ER" },
  { value: "+372", label: "+372 EE" },
  { value: "+251", label: "+251 ET" },
  { value: "+500", label: "+500 FK" },
  { value: "+298", label: "+298 FO" },
  { value: "+679", label: "+679 FJ" },
  { value: "+358", label: "+358 FI" },
  { value: "+33", label: "+33 FR" },
  { value: "+594", label: "+594 GF" },
  { value: "+689", label: "+689 PF" },
  { value: "+262", label: "+262 TF" },
  { value: "+241", label: "+241 GA" },
  { value: "+220", label: "+220 GM" },
  { value: "+995", label: "+995 GE" },
  { value: "+49", label: "+49 DE" },
  { value: "+233", label: "+233 GH" },
  { value: "+350", label: "+350 GI" },
  { value: "+30", label: "+30 GR" },
  { value: "+299", label: "+299 GL" },
  { value: "+1473", label: "+1473 GD" },
  { value: "+590", label: "+590 GP" },
  { value: "+1671", label: "+1671 GU" },
  { value: "+502", label: "+502 GT" },
  { value: "+44", label: "+44 GG" },
  { value: "+224", label: "+224 GN" },
  { value: "+245", label: "+245 GW" },
  { value: "+592", label: "+592 GY" },
  { value: "+509", label: "+509 HT" },
  { value: "+672", label: "+672 HM" },
  { value: "+379", label: "+379 VA" },
  { value: "+504", label: "+504 HN" },
  { value: "+852", label: "+852 HK" },
  { value: "+36", label: "+36 HU" },
  { value: "+354", label: "+354 IS" },
  { value: "+91", label: "+91 IN" },
  { value: "+62", label: "+62 ID" },
  { value: "+98", label: "+98 IR" },
  { value: "+964", label: "+964 IQ" },
  { value: "+353", label: "+353 IE" },
  { value: "+44", label: "+44 IM" },
  { value: "+972", label: "+972 IL" },
  { value: "+39", label: "+39 IT" },
  { value: "+1876", label: "+1876 JM" },
  { value: "+81", label: "+81 JP" },
  { value: "+44", label: "+44 JE" },
  { value: "+962", label: "+962 JO" },
  { value: "+7", label: "+7 KZ" },
  { value: "+254", label: "+254 KE" },
  { value: "+686", label: "+686 KI" },
  { value: "+850", label: "+850 KP" },
  { value: "+82", label: "+82 KR" },
  { value: "+965", label: "+965 KW" },
  { value: "+996", label: "+996 KG" },
  { value: "+856", label: "+856 LA" },
  { value: "+371", label: "+371 LV" },
  { value: "+961", label: "+961 LB" },
  { value: "+266", label: "+266 LS" },
  { value: "+231", label: "+231 LR" },
  { value: "+218", label: "+218 LY" },
  { value: "+423", label: "+423 LI" },
  { value: "+370", label: "+370 LT" },
  { value: "+352", label: "+352 LU" },
  { value: "+853", label: "+853 MO" },
  { value: "+389", label: "+389 MK" },
  { value: "+261", label: "+261 MG" },
  { value: "+265", label: "+265 MW" },
  { value: "+60", label: "+60 MY" },
  { value: "+960", label: "+960 MV" },
  { value: "+223", label: "+223 ML" },
  { value: "+356", label: "+356 MT" },
  { value: "+692", label: "+692 MH" },
  { value: "+596", label: "+596 MQ" },
  { value: "+222", label: "+222 MR" },
  { value: "+230", label: "+230 MU" },
  { value: "+262", label: "+262 YT" },
  { value: "+52", label: "+52 MX" },
  { value: "+691", label: "+691 FM" },
  { value: "+373", label: "+373 MD" },
  { value: "+377", label: "+377 MC" },
  { value: "+976", label: "+976 MN" },
  { value: "+382", label: "+382 ME" },
  { value: "+1664", label: "+1664 MS" },
  { value: "+212", label: "+212 MA" },
  { value: "+258", label: "+258 MZ" },
  { value: "+95", label: "+95 MM" },
  { value: "+264", label: "+264 NA" },
  { value: "+674", label: "+674 NR" },
  { value: "+977", label: "+977 NP" },
  { value: "+31", label: "+31 NL" },
  { value: "+687", label: "+687 NC" },
  { value: "+64", label: "+64 NZ" },
  { value: "+505", label: "+505 NI" },
  { value: "+227", label: "+227 NE" },
  { value: "+234", label: "+234 NG" },
  { value: "+683", label: "+683 NU" },
  { value: "+672", label: "+672 NF" },
  { value: "+1670", label: "+1670 MP" },
  { value: "+47", label: "+47 NO" },
  { value: "+968", label: "+968 OM" },
  { value: "+92", label: "+92 PK" },
  { value: "+680", label: "+680 PW" },
  { value: "+970", label: "+970 PS" },
  { value: "+507", label: "+507 PA" },
  { value: "+675", label: "+675 PG" },
  { value: "+595", label: "+595 PY" },
  { value: "+51", label: "+51 PE" },
  { value: "+63", label: "+63 PH" },
  { value: "+64", label: "+64 PN" },
  { value: "+48", label: "+48 PL" },
  { value: "+351", label: "+351 PT" },
  { value: "+1787", label: "+1787 PR" },
  { value: "+974", label: "+974 QA" },
  { value: "+383", label: "+383 XK" },
  { value: "+262", label: "+262 RE" },
  { value: "+40", label: "+40 RO" },
  { value: "+7", label: "+7 RU" },
  { value: "+250", label: "+250 RW" },
  { value: "+590", label: "+590 BL" },
  { value: "+290", label: "+290 SH" },
  { value: "+1869", label: "+1869 KN" },
  { value: "+1758", label: "+1758 LC" },
  { value: "+590", label: "+590 MF" },
  { value: "+508", label: "+508 PM" },
  { value: "+1784", label: "+1784 VC" },
  { value: "+685", label: "+685 WS" },
  { value: "+378", label: "+378 SM" },
  { value: "+239", label: "+239 ST" },
  { value: "+966", label: "+966 SA" },
  { value: "+221", label: "+221 SN" },
  { value: "+381", label: "+381 RS" },
  { value: "+248", label: "+248 SC" },
  { value: "+232", label: "+232 SL" },
  { value: "+65", label: "+65 SG" },
  { value: "+1721", label: "+1721 SX" },
  { value: "+421", label: "+421 SK" },
  { value: "+386", label: "+386 SI" },
  { value: "+677", label: "+677 SB" },
  { value: "+252", label: "+252 SO" },
  { value: "+27", label: "+27 ZA" },
  { value: "+500", label: "+500 GS" },
  { value: "+211", label: "+211 SS" },
  { value: "+34", label: "+34 ES" },
  { value: "+94", label: "+94 LK" },
  { value: "+249", label: "+249 SD" },
  { value: "+597", label: "+597 SR" },
  { value: "+47", label: "+47 SJ" },
  { value: "+268", label: "+268 SZ" },
  { value: "+46", label: "+46 SE" },
  { value: "+41", label: "+41 CH" },
  { value: "+963", label: "+963 SY" },
  { value: "+886", label: "+886 TW" },
  { value: "+992", label: "+992 TJ" },
  { value: "+255", label: "+255 TZ" },
  { value: "+66", label: "+66 TH" },
  { value: "+670", label: "+670 TL" },
  { value: "+228", label: "+228 TG" },
  { value: "+690", label: "+690 TK" },
  { value: "+676", label: "+676 TO" },
  { value: "+1868", label: "+1868 TT" },
  { value: "+216", label: "+216 TN" },
  { value: "+90", label: "+90 TR" },
  { value: "+993", label: "+993 TM" },
  { value: "+1649", label: "+1649 TC" },
  { value: "+688", label: "+688 TV" },
  { value: "+256", label: "+256 UG" },
  { value: "+380", label: "+380 UA" },
  { value: "+971", label: "+971 AE" },
  { value: "+44", label: "+44 GB" },
  { value: "+1", label: "+1 US" },
  { value: "+246", label: "+246 UM" },
  { value: "+598", label: "+598 UY" },
  { value: "+998", label: "+998 UZ" },
  { value: "+678", label: "+678 VU" },
  { value: "+58", label: "+58 VE" },
  { value: "+84", label: "+84 VN" },
  { value: "+1284", label: "+1284 VG" },
  { value: "+1340", label: "+1340 VI" },
  { value: "+681", label: "+681 WF" },
  { value: "+212", label: "+212 EH" },
  { value: "+967", label: "+967 YE" },
  { value: "+260", label: "+260 ZM" },
  { value: "+263", label: "+263 ZW" },
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

 const handleFormSubmit = async (e) => {  
    e.preventDefault();
    if (!formRef.current) return;

    try {
      const submittedData = await submitToBrevo(formRef.current);

      if (errorRef.current) errorRef.current.style.display = "none";
      if (successRef.current) successRef.current.style.display = "block";

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
    } catch (err) {
      console.error("Registration submission failed:", err);
      if (successRef.current) successRef.current.style.display = "none";
      if (errorRef.current) errorRef.current.style.display = "block";
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
    </>);
}