<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Password Reset - Your New Login Credentials</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e9ecef;
            border-radius: 5px;
        }
        .password-box {
            background-color: #f8f9fa;
            border: 2px solid #007bff;
            border-radius: 5px;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
            font-size: 18px;
            font-weight: bold;
            color: #007bff;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            font-size: 14px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Password Reset Notification</h1>
    </div>
    
    <div class="content">
        <h2>Hello {{ $specialist->first_name }} {{ $specialist->last_name }},</h2>
        
        <p>Your password has been reset by an administrator. Below are your new login credentials:</p>
        
        <div class="password-box">
            <strong>New Password: {{ $newPassword }}</strong>
        </div>
        
        <p>Please use these credentials to log in to your specialist account:</p>
        <ul>
            <li><strong>Email:</strong> {{ $specialist->email }}</li>
            <li><strong>Password:</strong> {{ $newPassword }}</li>
        </ul>
        
        <div class="warning">
            <strong>Important:</strong> For security reasons, please change your password after logging in for the first time.
        </div>
        
        <p>If you have any questions or concerns, please contact our support team.</p>
        
        <p>Best regards,<br>
        The Admin Team</p>
    </div>
    
    <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
    </div>
</body>
</html>
