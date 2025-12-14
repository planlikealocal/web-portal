<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome! Your Specialist Account Has Been Created</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e9ecef;
            border-radius: 5px;
        }
        .credentials-box {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .credentials-box h3 {
            margin-top: 0;
            color: white;
        }
        .password-box {
            background-color: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 5px;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
            font-size: 18px;
            font-weight: bold;
            color: #856404;
        }
        .warning {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #721c24;
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            font-size: 14px;
            color: #6c757d;
        }
        .button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin: 15px 0;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
        }
        .button:hover {
            background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 123, 255, 0.4);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Congratulations on Your New Role!</h1>
    </div>
    
    <div class="content">
        <h2>Dear {{ $specialist->first_name }} {{ $specialist->last_name }},</h2>
        
        <p><strong>Congratulations!</strong> We are thrilled to welcome you as a new Travel Specialist on our platform. Your expertise and passion for travel will be invaluable to our community of travelers seeking authentic and memorable experiences.</p>
        
        <p>As a Travel Specialist, you will have the opportunity to:</p>
        <ul>
            <li>Share your local knowledge and expertise with travelers worldwide</li>
            <li>Create personalized travel experiences and itineraries</li>
            <li>Connect with clients who value authentic, local insights</li>
            <li>Build your reputation as a trusted travel expert</li>
            <li>Earn income by sharing your passion for travel</li>
        </ul>
        
        <div class="credentials-box">
            <h3>🔑 Your Specialist Account Access:</h3>
            <p><strong>Email:</strong> {{ $specialist->email }}</p>
            <div class="password-box">
                <strong>Your Password: {{ $password }}</strong>
            </div>
        </div>
        
        <p><strong>Ready to get started?</strong> Use these credentials to access your specialist dashboard and begin creating amazing travel experiences:</p>
        <a href="{{ url('/specialist/login') }}" class="button">🚀 Access Your Specialist Dashboard</a>
        
        <div class="warning">
            <strong>🔒 Important Security Notice:</strong> 
            <ul>
                <li>Please change your password after your first login for security</li>
                <li>Keep your login credentials secure and confidential</li>
                <li>Do not share your password with anyone</li>
            </ul>
        </div>
        
        <p><strong>Next Steps:</strong></p>
        <ol>
            <li>Log in to your specialist dashboard using the credentials above</li>
            <li>Complete your profile with additional details and photos</li>
            <li>Start creating your first travel experiences</li>
            <li>Connect with travelers looking for your expertise</li>
        </ol>
        
        <p>If you have any questions or need assistance getting started, our support team is here to help you succeed in your new role.</p>
        
        <p><strong>Welcome to the team, {{ $specialist->first_name }}! We're excited to see the amazing experiences you'll create.</strong></p>
        
        <p>Best regards,<br>
        <strong>The Travel Platform Team</strong></p>
    </div>
    
    <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
    </div>
</body>
</html>
