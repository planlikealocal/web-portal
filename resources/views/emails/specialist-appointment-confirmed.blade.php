<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Appointment Confirmed</title>
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
        .appointment-details {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .appointment-details h3 {
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
        .button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin: 15px 5px;
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
        .button-meet {
            background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
        }
        .button-meet:hover {
            background: linear-gradient(135deg, #ff4757 0%, #ee5a6f 100%);
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            font-size: 14px;
            color: #6c757d;
            text-align: center;
        }
        .info-box {
            background-color: #e7f3ff;
            border-left: 4px solid #007bff;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .client-info {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📅 New Appointment Confirmed</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">You have a new appointment scheduled</p>
    </div>

    <div class="content">
        <div class="notification-box">
            <h2 style="margin: 0; font-size: 24px;">🎉 Appointment Booked!</h2>
            <p style="margin: 10px 0 0 0; font-size: 16px;">A new client has booked an appointment with you.</p>
        </div>

        <h2>Dear {{ $specialist->first_name }} {{ $specialist->last_name }},</h2>

        <p>You have a new appointment confirmed! The appointment has been automatically added to your Google Calendar.</p>

        <div class="appointment-details">
            <h3>📅 Appointment Details</h3>

            <div class="detail-row">
                <span class="detail-label">Date & Time:</span>
                <span class="detail-value"><strong>{{ $appointmentDate }}</strong></span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">{{ $appointmentDuration }}</span>
            </div>

            @if(!empty($meetingLink))
            <div class="detail-row">
                <span class="detail-label">Meeting Link:</span>
                <span class="detail-value">
                    <a href="{{ $meetingLink }}" style="color: #007bff; text-decoration: none;" target="_blank" rel="noopener">
                        Join via Google Meet
                    </a>
                </span>
            </div>
            @endif

            @if($plan->selected_plan || $plan->plan_type)
            <div class="detail-row">
                <span class="detail-label">Plan Type:</span>
                <span class="detail-value">{{ ucfirst($plan->selected_plan ?? $plan->plan_type) }}</span>
            </div>
            @endif

            @if($plan->destination)
            <div class="detail-row">
                <span class="detail-label">Destination:</span>
                <span class="detail-value">{{ $plan->destination->name }}</span>
            </div>
            @endif

            @if($plan->travel_dates)
            <div class="detail-row">
                <span class="detail-label">Travel Dates:</span>
                <span class="detail-value">{{ $plan->travel_dates }}</span>
            </div>
            @endif

            @if($plan->travelers)
            <div class="detail-row">
                <span class="detail-label">Number of Travelers:</span>
                <span class="detail-value">{{ $plan->travelers }}</span>
            </div>
            @endif
        </div>

        <div class="client-info">
            <h3 style="margin-top: 0; color: #856404;">👤 Client Information</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> {{ $plan->first_name }} {{ $plan->last_name }}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:{{ $plan->email }}" style="color: #007bff; text-decoration: none;">{{ $plan->email }}</a></p>
            @if($plan->phone)
            <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:{{ $plan->phone }}" style="color: #007bff; text-decoration: none;">{{ $plan->phone }}</a></p>
            @endif
        </div>

        @if($plan->interests || $plan->other_interests)
        <div class="info-box">
            <strong>🎯 Client Interests:</strong>
            <ul style="margin: 10px 0;">
                @if($plan->interests && is_array($plan->interests) && count($plan->interests) > 0)
                    @foreach($plan->interests as $interest)
                        <li>{{ ucfirst($interest) }}</li>
                    @endforeach
                @endif
                @if($plan->other_interests)
                    <li>{{ $plan->other_interests }}</li>
                @endif
            </ul>
        </div>
        @endif

        <div class="info-box">
            <strong>📧 Important Information:</strong>
            <ul style="margin: 10px 0;">
                <li>This appointment has been automatically added to your Google Calendar</li>
                @if(!empty($meetingLink))
                <li>The Google Meet link is available in your calendar event and below</li>
                @endif
                <li>You can view and manage this appointment from your specialist dashboard</li>
                <li>Please prepare for the appointment based on the client's interests and travel plans</li>
            </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            @if(!empty($meetingLink))
            <a href="{{ $meetingLink }}" class="button button-meet">
                🎥 Join Google Meet
            </a>
            @endif
            <a href="{{ $appointmentsUrl }}" class="button">
                📋 View Appointments
            </a>
        </div>

        <p><strong>Please make sure you're prepared for this appointment and have all necessary information ready.</strong></p>

        <p>If you have any questions or need to make changes to the appointment, you can manage it from your specialist dashboard.</p>

        <p>Best regards,<br>
        <strong>The Travel Planning Team</strong></p>
    </div>

    <div class="footer">
        <p>This is an automated notification email. Please do not reply to this email.</p>
        <p>If you have any questions, please contact our support team.</p>
    </div>
</body>
</html>

