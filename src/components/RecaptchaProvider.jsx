"use client";
import React, { createContext, useCallback, useContext, useRef } from "react";

// reCAPTCHA v3 client context. The site key reaches the client two ways:
//   1. The `siteKey` prop, injected by the server layout — works on
//      dynamically-rendered routes (e.g. the homepage).
//   2. A runtime fetch to /api/recaptcha-site-key — used as a fallback when
//      the prop is empty, which happens on STATICALLY prerendered pages
//      (login, contact, …) where the build-time env was empty. The API route
//      is force-dynamic so it always reflects the real runtime env.
// When no key can be resolved, executeRecaptcha returns null and the server
// check fails open, so forms keep working in dev / before keys are added.

const RecaptchaContext = createContext({
  // Param kept so the inferred type accepts an action arg from .tsx consumers.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  executeRecaptcha: async (action) => null,
});

export function useRecaptcha() {
  return useContext(RecaptchaContext);
}

export default function RecaptchaProvider({ siteKey: initialSiteKey, children }) {
  const loadPromiseRef = useRef(null);
  const keyPromiseRef = useRef(null);

  // Resolve the effective site key once: prefer the prop, else fetch at runtime.
  const resolveSiteKey = useCallback(() => {
    if (initialSiteKey) return Promise.resolve(initialSiteKey);
    if (keyPromiseRef.current) return keyPromiseRef.current;
    keyPromiseRef.current = fetch("/api/recaptcha-site-key")
      .then((r) => r.json())
      .then((d) => d?.siteKey || "")
      .catch(() => "");
    return keyPromiseRef.current;
  }, [initialSiteKey]);

  // Inject the v3 script at most once, only on first use.
  const ensureScript = useCallback((key) => {
    if (!key) return Promise.resolve(null);
    if (loadPromiseRef.current) return loadPromiseRef.current;

    loadPromiseRef.current = new Promise((resolve, reject) => {
      if (typeof window !== "undefined" && window.grecaptcha) {
        resolve(window.grecaptcha);
        return;
      }
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${key}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.grecaptcha);
      script.onerror = () => {
        loadPromiseRef.current = null; // allow a retry on next submit
        reject(new Error("Failed to load reCAPTCHA"));
      };
      document.head.appendChild(script);
    });
    return loadPromiseRef.current;
  }, []);

  const executeRecaptcha = useCallback(
    async (action) => {
      try {
        const key = await resolveSiteKey();
        if (!key) return null;
        const grecaptcha = await ensureScript(key);
        if (!grecaptcha) return null;
        return await new Promise((resolve) => {
          grecaptcha.ready(() => {
            grecaptcha
              .execute(key, { action })
              .then(resolve)
              .catch(() => resolve(null));
          });
        });
      } catch {
        // Network/load failure — return null so the form still submits; the
        // server decides whether to enforce (it fails open when unreachable).
        return null;
      }
    },
    [resolveSiteKey, ensureScript],
  );

  return (
    <RecaptchaContext.Provider value={{ executeRecaptcha }}>
      {children}
    </RecaptchaContext.Provider>
  );
}
