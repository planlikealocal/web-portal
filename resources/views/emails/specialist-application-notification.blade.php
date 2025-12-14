<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Specialist Application</title>
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
        .notification-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .contact-details {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .contact-details h3 {
            margin-top: 0;
            color: #495057;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: bold;
            color: #6c757d;
        }
        .detail-value {
            color: #212529;
        }
        .message-box {
            background-color: #fff;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .message-box p {
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin: 15px 5px;
            font-weight: bold;
            text-align: center;
        }
        .button:hover {
            opacity: 0.9;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>💼 New Specialist Application</h1>
    </div>
    <div class="content">
        <div class="notification-box">
            <p style="margin: 0; font-size: 18px;">You have received a new specialist application</p>
        </div>

        <div class="contact-details">
            <h3>Index Information</h3>
            <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">{{ $first_name }} {{ $last_name }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">
                    <a href="mailto:{{ $email }}" style="color: #667eea; text-decoration: none;">{{ $email }}</a>
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">City & State:</span>
                <span class="detail-value">{{ $city_state }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">{{ $phone }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Submitted:</span>
                <span class="detail-value">{{ $submitted_at }}</span>
            </div>
        </div>

        <div class="message-box">
            <h3 style="margin-top: 0; color: #495057;">What is this destination known for?</h3>
            <p>{{ $destination_known_for }}</p>
        </div>

        <div class="message-box">
            <h3 style="margin-top: 0; color: #495057;">What make you a qualified expert?</h3>
            <p>{{ $qualified_expert }}</p>
        </div>

        <div class="message-box">
            <h3 style="margin-top: 0; color: #495057;">Best way to contact</h3>
            <p>{{ $best_way_to_contact }}</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <a href="{{ $admin_url }}" class="button">View in Admin Panel</a>
        </div>

        <div class="footer">
            <p>This is an automated notification from the specialist application system.</p>
            <p>Please reply directly to the applicant's email address: <a href="mailto:{{ $email }}" style="color: #667eea;">{{ $email }}</a></p>
        </div>
    </div>
</body>
</html>

