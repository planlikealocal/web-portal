<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Payment Successful - Appointment Confirmed</title>
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
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
        .success-box {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
            border-bottom: 2px solid #28a745;
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
        .button-secondary {
            background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
        }
        .button-secondary:hover {
            background: linear-gradient(135deg, #495057 0%, #343a40 100%);
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
    </style>
</head>
<body>
    <div class="header">
        <h1>✅ Payment Successful!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">Your appointment has been confirmed</p>
    </div>

    <div class="content">
        <div class="success-box">
            <h2 style="margin: 0; font-size: 24px;">🎉 Thank You for Your Payment!</h2>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your payment has been processed successfully and your appointment is now confirmed.</p>
        </div>

        <h2>Dear {{ $plan->first_name }} {{ $plan->last_name }},</h2>

        <p>We're excited to confirm that your payment has been processed successfully! Your appointment has been confirmed and added to our calendar.</p>

        <div class="appointment-details">
            <h3>📅 Appointment Details</h3>

            <div class="detail-row">
                <span class="detail-label">Date & Time:</span>
                <span class="detail-value">{{ $appointmentDate }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">{{ $appointmentDuration }}</span>
            </div>

            @if($plan->specialist)
            <div class="detail-row">
                <span class="detail-label">Specialist:</span>
                <span class="detail-value">{{ $plan->specialist->full_name }}</span>
            </div>
            @endif

            <div class="detail-row">
                <span class="detail-label">Plan Type:</span>
                <span class="detail-value">{{ ucfirst($plan->selected_plan ?? $plan->plan_type ?? 'Plan') }}</span>
            </div>

            @if($plan->destination)
            <div class="detail-row">
                <span class="detail-label">Destination:</span>
                <span class="detail-value">{{ $plan->destination }}</span>
            </div>
            @endif

            <div class="detail-row">
                <span class="detail-label">Amount Paid:</span>
                <span class="detail-value"><strong>${{ number_format($plan->amount ?? $planPrice, 2) }}</strong></span>
            </div>
        </div>

        <div class="info-box">
            <strong>📧 Important Information:</strong>
            <ul style="margin: 10px 0;">
                <li>A confirmation email has been sent to this address</li>
                <li>Your appointment has been added to our calendar</li>
                <li>You can download your calendar file and invoice using the links below</li>
            </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $calendarDownloadUrl }}" class="button">📅 Download Calendar File</a>
            <a href="{{ $invoiceDownloadUrl }}" class="button button-secondary">🧾 Download Invoice</a>
        </div>

        <p><strong>Your specialist, {{ $plan->specialist->full_name }}, will be in touch with you soon</strong></p>

        <p>If you have any questions or need to make changes to your appointment, please don't hesitate to contact us.</p>

        <p>We look forward to helping you plan an amazing travel experience!</p>

        <p>Best regards,<br>
        <strong>The Travel Planning Team</strong></p>
    </div>

    <div class="footer">
        <p>This is an automated confirmation email. Please do not reply to this email.</p>
        <p>If you have any questions, please contact our support team.</p>
    </div>
</body>
</html>

