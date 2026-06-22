import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/site/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — HumanCaptcha",
  description:
    "The terms that govern your use of the HumanCaptcha demo and SDK concept.",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Acceptance of terms",
    paragraphs: [
      "By accessing or using HumanCaptcha (the \u201CService\u201D), including the interactive demo and any related documentation, you agree to be bound by these Terms. If you do not agree, do not use the Service.",
    ],
  },
  {
    heading: "2. The service",
    paragraphs: [
      "HumanCaptcha is a proof-of-concept gesture-based CAPTCHA. It is provided for demonstration and evaluation purposes. Features, APIs and availability may change at any time without notice.",
    ],
  },
  {
    heading: "3. Acceptable use",
    paragraphs: [
      "You agree not to misuse the Service. This includes attempting to circumvent verification programmatically, interfering with its operation, reverse-engineering it for malicious purposes, or using it to build tooling that defeats human-verification systems.",
      "You must have the legal right to use any camera or device you point at the Service.",
    ],
  },
  {
    heading: "4. Intellectual property",
    paragraphs: [
      "The HumanCaptcha name, design and source are made available under the license described in the project repository. Your use of the Service does not grant you ownership of any intellectual property beyond the rights that license provides.",
    ],
  },
  {
    heading: "5. Disclaimer of warranties",
    paragraphs: [
      "The Service is provided \u201Cas is\u201D and \u201Cas available\u201D without warranties of any kind, express or implied, including fitness for a particular purpose. As a proof-of-concept, it is not guaranteed to be secure against all forms of automated abuse.",
    ],
  },
  {
    heading: "6. Limitation of liability",
    paragraphs: [
      "To the maximum extent permitted by law, the maintainers shall not be liable for any indirect, incidental or consequential damages arising from your use of, or inability to use, the Service.",
    ],
  },
  {
    heading: "7. Changes to these terms",
    paragraphs: [
      "We may revise these Terms at any time. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.",
    ],
  },
  {
    heading: "8. Contact",
    paragraphs: [
      "Questions about these Terms can be raised via an issue on our public GitHub repository.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="June 23, 2026"
      intro="These terms govern your use of the HumanCaptcha demo and the SDK concept it documents."
      sections={SECTIONS}
    />
  );
}
