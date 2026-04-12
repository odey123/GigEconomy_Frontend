import nodemailer from "nodemailer";

const isEmailConfigured = (): boolean =>
  !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

/**
 * Sends an email notification to the ops team when a new premium
 * rider KYC application is submitted.
 *
 * Requires env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
 *                    OPS_EMAIL, SMTP_FROM (optional)
 *
 * If SMTP is not configured the notification is only logged to console
 * so the server never crashes due to a missing email setup.
 */
export const notifyAdminNewRiderApplication = async (rider: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleType: string;
  createdAt: Date;
}): Promise<void> => {
  const subject = `[EcoRoutes] New Premium Rider Application — ${rider.firstName} ${rider.lastName}`;
  const html = `
    <h2>New Rider KYC Application</h2>
    <p>A new premium rider has submitted a KYC application and is awaiting review.</p>
    <table cellpadding="8" style="border-collapse:collapse;">
      <tr><td><strong>Name</strong></td><td>${rider.firstName} ${rider.lastName}</td></tr>
      <tr><td><strong>Email</strong></td><td>${rider.email}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${rider.phone}</td></tr>
      <tr><td><strong>Vehicle</strong></td><td>${rider.vehicleType}</td></tr>
      <tr><td><strong>Submitted</strong></td><td>${rider.createdAt.toISOString()}</td></tr>
    </table>
    <p>
      Review this application in the
      <a href="${process.env.ADMIN_PANEL_URL || "#"}/riders?status=pending">Admin Panel → Riders → Pending</a>.
    </p>
  `;

  if (!isEmailConfigured()) {
    console.log(
      `[email] SMTP not configured. Rider application notification skipped for rider ${rider.id}.\n` +
        `        Set SMTP_HOST, SMTP_USER, SMTP_PASS, OPS_EMAIL to enable email alerts.`,
    );
    return;
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.OPS_EMAIL,
      subject,
      html,
    });
    console.log(`[email] Admin notification sent for rider application ${rider.id}`);
  } catch (error) {
    // Non-fatal: log and continue. A failed email must never block the API response.
    console.error(`[email] Failed to send admin notification for rider ${rider.id}:`, error);
  }
};
