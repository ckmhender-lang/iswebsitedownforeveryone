import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface SslAlertEmailProps {
  monitorName: string;
  monitorUrl: string;
  sslStatus: "EXPIRING_SOON" | "EXPIRED" | "ERROR";
  daysUntilExpiry?: number;
  validTo?: Date;
  issuer?: string;
  error?: string;
}

export function SslAlertEmail({
  monitorName,
  monitorUrl,
  sslStatus,
  daysUntilExpiry,
  validTo,
  issuer,
  error,
}: SslAlertEmailProps) {
  const isExpired = sslStatus === "EXPIRED";
  const isError = sslStatus === "ERROR";

  const headline = isExpired
    ? `🔴 SSL Certificate EXPIRED — ${monitorName}`
    : isError
    ? `⚠️ SSL Check Failed — ${monitorName}`
    : `🟡 SSL Certificate Expiring Soon — ${monitorName}`;

  const bodyText = isExpired
    ? `The SSL certificate for ${monitorUrl} has expired. Visitors will see security warnings.`
    : isError
    ? `We could not check the SSL certificate for ${monitorUrl}. ${error ?? ""}`
    : `The SSL certificate for ${monitorUrl} expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"}. Please renew it soon.`;

  return (
    <Html>
      <Head />
      <Preview>{headline}</Preview>
      <Body style={{ backgroundColor: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px" }}>
          <Section style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "32px", border: "2px solid #e2e8f0" }}>
            <Heading style={{ fontSize: "20px", color: "#0f172a", margin: "0 0 8px" }}>
              {headline}
            </Heading>
            <Text style={{ color: "#475569", fontSize: "15px", margin: "0 0 24px" }}>
              {bodyText}
            </Text>

            <Hr style={{ borderColor: "#e2e8f0", margin: "20px 0" }} />

            <Text style={{ color: "#64748b", fontSize: "13px", margin: "0 0 6px" }}>
              <strong>Monitor:</strong> {monitorName}
            </Text>
            <Text style={{ color: "#64748b", fontSize: "13px", margin: "0 0 6px" }}>
              <strong>URL:</strong> {monitorUrl}
            </Text>
            {issuer && (
              <Text style={{ color: "#64748b", fontSize: "13px", margin: "0 0 6px" }}>
                <strong>Issuer:</strong> {issuer}
              </Text>
            )}
            {validTo && (
              <Text style={{ color: "#64748b", fontSize: "13px", margin: "0 0 6px" }}>
                <strong>Expires:</strong> {validTo.toDateString()}
              </Text>
            )}
            {daysUntilExpiry !== undefined && (
              <Text style={{ color: isExpired ? "#ef4444" : "#f59e0b", fontSize: "13px", fontWeight: "bold", margin: "0 0 6px" }}>
                {isExpired ? "EXPIRED" : `${daysUntilExpiry} days remaining`}
              </Text>
            )}

            <Hr style={{ borderColor: "#e2e8f0", margin: "20px 0" }} />

            <Text style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>
              This alert was sent by iswebsitedownforeveryone.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default SslAlertEmail;
