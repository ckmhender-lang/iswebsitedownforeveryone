import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  name: string;
  verifyUrl: string;
}

export function VerificationEmail({ name, verifyUrl }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for iswebsitedownforeveryone.com</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>iswebsitedownforeveryone.com</Text>
          </Section>

          <Section style={card}>
            <Text style={emoji}>✉️</Text>
            <Heading style={heading}>Verify your email address</Heading>
            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
              Thanks for signing up! Click the button below to verify your email
              and activate your account.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={verifyUrl}>
                Verify Email Address
              </Button>
            </Section>
            <Text style={hint}>
              This link expires in <strong>24 hours</strong>. If you didn&apos;t
              create an account, you can safely ignore this email.
            </Text>
          </Section>

          <Hr style={divider} />
          <Text style={footer}>
            iswebsitedownforeveryone.com — Website Status Monitoring
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
const card: React.CSSProperties = {
  backgroundColor: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "12px",
  padding: "32px",
  textAlign: "center",
};
const emoji: React.CSSProperties = { fontSize: "48px", margin: "0 0 16px 0" };
const heading: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#1e293b",
  margin: "0 0 12px 0",
};
const paragraph: React.CSSProperties = {
  fontSize: "15px",
  color: "#475569",
  margin: "0 0 8px 0",
  lineHeight: "1.6",
};
const buttonContainer: React.CSSProperties = { textAlign: "center", margin: "24px 0" };
const button: React.CSSProperties = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  padding: "14px 36px",
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "15px",
  textDecoration: "none",
  display: "inline-block",
};
const hint: React.CSSProperties = {
  fontSize: "13px",
  color: "#94a3b8",
  margin: "0",
  lineHeight: "1.5",
};
const divider: React.CSSProperties = { borderColor: "#00000015", margin: "24px 0 16px" };
const footer: React.CSSProperties = {
  fontSize: "12px",
  color: "#94a3b8",
  textAlign: "center",
  margin: "0",
};
