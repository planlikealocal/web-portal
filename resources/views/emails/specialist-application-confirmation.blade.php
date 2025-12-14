<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Application Received - Plan Like A Local</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
            margin-bottom: 0;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            background-color: #ffffff;
            padding: 30px;
            border: 1px solid #e9ecef;
            border-radius: 0 0 10px 10px;
        }
        .greeting {
            font-size: 18px;
            color: #495057;
            margin-bottom: 20px;
        }
        .message-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .message-box p {
            margin: 0;
            color: #495057;
            font-size: 16px;
        }
        .info-box {
            background-color: #fff;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .info-box h3 {
            margin-top: 0;
            color: #495057;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 12px;
        }
        .highlight {
            color: #667eea;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Thank You for Your Application!</h1>
    </div>
    <div class="content">
        <div class="greeting">
            <p>Dear {{ $first_name }} {{ $last_name }},</p>
        </div>

        <div class="message-box">
            <p>
                Thank you for your interest in becoming a specialist with <span class="highlight">Plan Like A Local</span>! 
                We have successfully received your application.
            </p>
        </div>

        <div class="info-box">
            <h3>What Happens Next?</h3>
            <p>
                Our <span class="highlight">Plan Like A Local</span> team will review your application and get back to you as soon as possible. 
                We appreciate your patience during this process.
            </p>
            <p style="margin-top: 15px;">
                If we need any additional information, we will contact you using the email address or phone number you provided.
            </p>
        </div>

        <div class="info-box">
            <h3>Application Details</h3>
            <p><strong>Name:</strong> {{ $first_name }} {{ $last_name }}</p>
            <p><strong>Email:</strong> {{ $email }}</p>
            <p><strong>Location:</strong> {{ $city_state }}</p>
            <p><strong>Submitted:</strong> {{ $submitted_at }}</p>
        </div>

        <div class="footer">
            <p>This is an automated confirmation email from Plan Like A Local.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p style="margin-top: 15px;">
                <strong>Plan Like A Local Team</strong>
            </p>
        </div>
    </div>
</body>
</html>

