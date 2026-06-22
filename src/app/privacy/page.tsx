import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/site/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — HumanCaptcha",
  description:
    "How HumanCaptcha handles camera input, hand-tracking data and verification tokens. All processing happens on-device.",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Overview",
    paragraphs: [
      "HumanCaptcha is a gesture-based human-verification system. This policy explains what data the verification flow touches, where it is processed, and what (if anything) leaves your device.",
      "Because HumanCaptcha is designed to be privacy-first, the short version is simple: your camera feed and hand-tracking data never leave your browser.",
    ],
  },
  {
    heading: "2. Camera & image data",
    paragraphs: [
      "Verification uses your device camera to detect hand landmarks and to capture the region you frame with your fingers. All camera frames, hand landmarks and the captured puzzle image are processed entirely on-device using WebAssembly.",
      "We do not record, store, transmit or upload your camera feed or captured images to any server. When a verification session ends, this in-memory data is discarded.",
    ],
  },
  {
    heading: "3. Verification tokens",
    paragraphs: [
      "When you successfully complete a challenge, an anonymous verification token is generated. This token contains no biometric data and cannot be used to identify you. It exists only to tell the site you are verifying for that a human passed the challenge.",
    ],
  },
  {
    heading: "4. Analytics & cookies",
    paragraphs: [
      "The demo site may use privacy-respecting, aggregate analytics to understand traffic. We do not use tracking cookies to build advertising profiles, and we do not sell personal data.",
    ],
  },
  {
    heading: "5. Third-party services",
    paragraphs: [
      "The hand-tracking runtime and model files are loaded at runtime from public CDNs. Loading these assets exposes your IP address to the CDN provider, as with any request for static resources on the web. No verification data is shared with these providers.",
    ],
  },
  {
    heading: "6. Children's privacy",
    paragraphs: [
      "HumanCaptcha is not directed at children under 13 and does not knowingly collect personal information from them.",
    ],
  },
  {
    heading: "7. Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time. Material changes will be reflected by updating the \u201CLast updated\u201D date at the top of this page.",
    ],
  },
  {
    heading: "8. Contact",
    paragraphs: [
      "Questions about this policy can be raised via an issue on our public GitHub repository.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="June 23, 2026"
      intro="Your privacy is the whole point. HumanCaptcha verifies that you are human without ever sending your camera feed or biometric data off your device."
      sections={SECTIONS}
    />
  );
}
