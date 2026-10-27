export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Email Verify</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; background: #F6FAFB; }
    table, td { border-collapse: collapse; }
    .container { width: 100%; max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
    .main-content { padding: 40px 36px; color: #333333; }
    .otp-box {
      display: block;
      width: 100%;
      background: linear-gradient(135deg, #22D172 0%, #1aab5e 100%);
      color: #ffffff;
      font-size: 32px;
      font-weight: 800;
      text-align: center;
      padding: 18px 0;
      border-radius: 10px;
      letter-spacing: 8px;
      margin: 24px 0;
      box-shadow: 0 4px 15px rgba(34, 209, 114, 0.35);
    }
    .footer { background: #f9f9f9; padding: 20px 30px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
    @media only screen and (max-width: 480px) {
      .main-content { padding: 24px 20px; }
    }
  </style>
</head>
<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#F6FAFB">
    <tr><td align="center" style="padding: 20px 10px;">
      <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td class="header">
            <h1>✉️ Verify Your Email</h1>
          </td>
        </tr>
        <tr>
          <td class="main-content">
            <table width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="font-size: 15px; line-height: 1.6; padding-bottom: 12px;">
                  You are just one step away to verify your account for this email:<br>
                  <strong style="color: #667eea;">{{email}}</strong>
                </td>
              </tr>
              <tr>
                <td style="font-size: 15px; font-weight: 600; padding-bottom: 6px;">
                  Use the OTP below to verify your account:
                </td>
              </tr>
              <tr>
                <td>
                  <p class="otp-box">{{otp}}</p>
                </td>
              </tr>
              <tr>
                <td style="font-size: 13px; color: #888; padding-top: 8px;">
                  ⏰ This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="footer">
            If you didn't request this, you can safely ignore this email.<br>
            &copy; auth System
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Password Reset</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; background: #F6FAFB; }
    table, td { border-collapse: collapse; }
    .container { width: 100%; max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 32px 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
    .main-content { padding: 40px 36px; color: #333333; }
    .otp-box {
      display: block;
      width: 100%;
      background: linear-gradient(135deg, #22D172 0%, #1aab5e 100%);
      color: #ffffff;
      font-size: 32px;
      font-weight: 800;
      text-align: center;
      padding: 18px 0;
      border-radius: 10px;
      letter-spacing: 8px;
      margin: 24px 0;
      box-shadow: 0 4px 15px rgba(34, 209, 114, 0.35);
    }
    .footer { background: #f9f9f9; padding: 20px 30px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
    @media only screen and (max-width: 480px) {
      .main-content { padding: 24px 20px; }
    }
  </style>
</head>
<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#F6FAFB">
    <tr><td align="center" style="padding: 20px 10px;">
      <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td class="header">
            <h1>🔐 Password Reset Request</h1>
          </td>
        </tr>
        <tr>
          <td class="main-content">
            <table width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="font-size: 15px; line-height: 1.6; padding-bottom: 12px;">
                  We received a password reset request for your account:<br>
                  <strong style="color: #f5576c;">{{email}}</strong>
                </td>
              </tr>
              <tr>
                <td style="font-size: 15px; font-weight: 600; padding-bottom: 6px;">
                  Use the OTP below to reset your password:
                </td>
              </tr>
              <tr>
                <td>
                  <p class="otp-box">{{otp}}</p>
                </td>
              </tr>
              <tr>
                <td style="font-size: 13px; color: #888; padding-top: 8px;">
                  ⏰ This OTP is valid for <strong>15 minutes</strong> only. Do not share it with anyone.
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="footer">
            If you didn't request a password reset, please ignore this email — your password won't change.<br>
            &copy; auth System
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;
