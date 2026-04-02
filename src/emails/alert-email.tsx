import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";

interface AlertEmailProps {
  monitorName: string;
  monitorUrl: string;
  status: "DOWN" | "UP";
  checkedAt: Date;
  error?: string;
}

export function AlertEmail({
  monitorName,
  monitorUrl,
  status,
  checkedAt,
  error,
}: AlertEmailProps) {
  const isDown = status === "DOWN";

  return (
    <Html>
      <Head />
      <Preview>
        {isDown ? `🔴 ${monitorName} is DOWN` : `🟢 ${monitorName} is back UP`}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>iswebsitedownforeveryone.com</Text>
          </Section>

          <Section style={isDown ? cardDown : cardUp}>
            <Text style={emoji}>{isDown ? "🔴" : "🟢"}</Text>
            <Heading style={isDown ? headingDown : headingUp}>
              {monitorName} is {status}
            </Heading>
            <Text style={urlText}>{monitorUrl}</Text>
          </Section>

          <Section style={detailsCard}>
            <Row>
              <Column style={detailLabel}>Status</Column>
              <Column style={isDown ? valueDown : valueUp}>{status}</Column>
            </Row>
            <Row>
              <Column style={detailLabel}>Checked At</Column>
              <Column style={detailValue}>{checkedAt.toUTCString()}</Column>
            </Row>
            {error && (
              <Row>
                <Column style={detailLabel}>Error</Column>
                <Column style={valueDown}>{error}</Column>
              </Row>
            )}
          </Section>

          <Hr style={divider} />
          <Text style={footer}>
            You received this because you have email alerts enabled on
            iswebsitedownforeveryone.com.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const body: React.CSSProperties = {
  backgroundColor: "#DCC7AA",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};
const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "32px 16px",
};
const logoSection: React.CSSProperties = { textAlign: "center", marginBottom: "24px" };
const logoText: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1e293b",
  margin: "0",
};
const cardDown: React.CSSProperties = {
  backgroundColor: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "12px",
  padding: "24px",
  textAlign: "center",
};
const cardUp: React.CSSProperties = {
  ...cardDown,
  backgroundColor: "#f0fdf4",
  border: "1px solid #bbf7d0",
};
const emoji: React.CSSProperties = { fontSize: "48px", margin: "0 0 12px 0" };
const headingDown: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#991b1b",
  margin: "0 0 8px 0",
};
const headingUp: React.CSSProperties = { ...headingDown, color: "#166534" };
const urlText: React.CSSProperties = { fontSize: "14px", color: "#64748b", margin: "0" };
const detailsCard: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.4)",
  borderRadius: "12px",
  padding: "16px",
  marginTop: "20px",
};
const detailLabel: React.CSSProperties = { fontSize: "14px", color: "#64748b", padding: "6px 0" };
const detailValue: React.CSSProperties = {
  fontSize: "14px",
  color: "#334155",
  textAlign: "right",
  padding: "6px 0",
};
const valueDown: React.CSSProperties = { ...detailValue, color: "#dc2626", fontWeight: "600" };
const valueUp: React.CSSProperties = { ...detailValue, color: "#16a34a", fontWeight: "600" };
const divider: React.CSSProperties = { borderColor: "#00000015", margin: "24px 0 16px" };
const footer: React.CSSProperties = {
  fontSize: "12px",
  color: "#94a3b8",
  textAlign: "center",
  margin: "0",
};
