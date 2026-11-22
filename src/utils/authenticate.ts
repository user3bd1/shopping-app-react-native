import * as LocalAuthentication from "expo-local-authentication";

export async function authenticateWithFingerprint() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    return {
      ok: false,
      reason: "This device does not support biometric authentication.",
    };
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    return {
      ok: false,
      reason: "No fingerprint or biometrics are enrolled on this device.",
    };
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Log in with your fingerprint",
    cancelLabel: "Cancel",

    disableDeviceFallback: false,
  });

  if (!result.success) {
    return {
      ok: false,
      reason:
        result.error === "user_cancel"
          ? "Authentication cancelled."
          : "Fingerprint authentication failed.",
    };
  }

  return { ok: true };
}
