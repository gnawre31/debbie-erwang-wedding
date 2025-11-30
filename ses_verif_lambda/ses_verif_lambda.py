import json
import boto3
import os

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.header import Header

# Initialize SES client (V1)
ses = boto3.client("ses", region_name="us-east-1")

SENDER_EMAIL = "rsvp@debbieerwang.xyz" 
# SENDER_EMAIL = "debbie.erwang@gmail.com" 
SUBJECT = "Your Wedding RSVP Confirmation"

def create_raw_email_message(recipient, first_name, rsvp):
    """
    Constructs a complete MIME-compliant email message string with custom headers.
    This is required for using ses.send_raw_email, which is the only way to 
    send custom headers (like List-Unsubscribe) using the V1 API.
    """
    
    # Determine confirmation message and styling based on RSVP status
    if rsvp:
        status_line = "We're absolutely delighted you can make it!"
        status_color = "#4A2A05"  # Dark brown for acceptance
        action_text = "Get ready to celebrate with us on Saturday, March 28, 2026!"
        plain_text_status = "You have accepted the invitation."
    else:
        status_line = "We're sorry you can't join us, but thank you for letting us know."
        status_color = "#707070"  # Soft gray for decline
        action_text = "If you change your mind, please update your RSVP before Februrary 2026."
        plain_text_status = "You have declined the invitation."

    # --- PLAIN TEXT FALLBACK ---
    plain_text_message = f"""
Dear {first_name},

Your RSVP has been confirmed.
Status: {plain_text_status}

{status_line}
{action_text}

Thank you,
Debbie & Erwang
"""

    # Create the HTML message with wedding-like styling (inline CSS is mandatory for emails)
    html_message = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{SUBJECT}</title>
        <style>
            /* Reset styles */
            body, table, td, a {{ -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }}
            table, td {{ mso-table-lspace: 0pt; mso-table-rspace: 0pt; }}
            img {{ -ms-interpolation-mode: bicubic; }}

            /* Global styles */
            body {{
                margin: 0;
                padding: 0;
                background-color: #FDFBF7; 
                font-family: Georgia, 'Times New Roman', Times, serif; 
                color: #4A2A05;
                line-height: 1.6;
            }}
            .container {{
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .card {{
                background-color: #ffffff;
                border: 1px solid #E5D9D1; 
                padding: 40px 30px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                position: relative;
            }}
            .accent {{
                color: #4A2A05; 
                font-size: 30px;
                line-height: 1;
                margin: 10px 0 15px 0;
                display: block;
            }}
            .body-text {{
                color: #333333; 
                font-size: 16px;
                margin-bottom: 20px;
            }}
            /* Hidden preheader text */
            .preheader {{ display: none; max-height: 0; overflow: hidden; font-size: 0; line-height: 0; }}
        </style>
    </head>
    <body>
        <!-- Hidden Preheader Text -->
        <div class="preheader">Your RSVP for Debbie & Erwang's wedding has been successfully confirmed. {plain_text_status}</div>
        <center>
            <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center">
                        <table class="card" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="position: relative;">
                            <tr>
                                <td>
                                    <!-- Decorative Inner Border -->
                                    <div style="border: 1px solid #E5D9D1; position: absolute; top: 10px; right: 10px; bottom: 10px; left: 10px;"></div>

                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="position: relative; z-index: 1;">
                                        <tr>
                                            <td align="center">
                                                <!-- USER CHANGE: Added 5px top margin -->
                                                <p style="font-size: 10px; color: #4A2A05; letter-spacing: 2px; text-transform: uppercase; margin: 5px 0 5px 0;">
                                                    The Wedding of
                                                </p>
                                                <!-- USER CHANGE: Changed H1 content -->
                                                <h1 style="font-size: 32px; color: #4A2A05; margin: 0 0 10px 0; font-family: Georgia, 'Times New Roman', Times, serif;">
                                                    Debbie & Erwang
                                                </h1>
                                                <span class="accent" style="font-family: Arial, sans-serif;">❦</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 0 15px;" align="center">
                                                <p class="body-text" style="font-size: 16px; color: #333333; margin: 0 0 25px 0;">
                                                    Dear {first_name},
                                                </p>
                                                <div style="border: 1px solid {status_color}; padding: 15px; background-color: #FDFBF7; margin-bottom: 25px;">
                                                    <p style="font-size: 18px; color: {status_color}; margin: 0; font-weight: bold;">
                                                        {status_line}
                                                    </p>
                                                </div>
                                                <p class="body-text" style="font-size: 16px; color: #333333; margin: 0 0 30px 0;">
                                                    Thank you for confirming your attendance status.
                                                    {action_text}
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center">
                                                <p style="margin: 0; font-style: italic; color: #4A2A05; font-size: 18px; margin-top: 30px;">
                                                    Debbie & Erwang
                                                </p>
                                                <p style="font-size: 12px; color: #aaaaaa; margin: 5px 0 0 0;">
                                                    We can't wait to share our special day with you.
                                                </p>
                                                <!-- USER CHANGE: Added RSVP site link -->
                                                <a href="https://www.debbieerwang.xyz/" style="font-size: 12px; color: #aaaaaa; text-decoration: none; border-bottom: 1px solid #E5D9D1; display: inline-block;">
                                                    Wedding RSVP Site
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>
    """
    
    # Define a unique "unsubcribe" link
    unsubscribe_link = "https://www.debbieerwang.xyz/rsvp" # Placeholder URL

    # Create the root container for the email (multipart/mixed)
    msg = MIMEMultipart('mixed')
    msg['Subject'] = Header(SUBJECT, 'utf-8')
    msg['From'] = SENDER_EMAIL
    msg['To'] = recipient
    
    # --- Custom Headers for Deliverability ---
    msg['List-Unsubscribe'] = f'<mailto:{SENDER_EMAIL}>, <{unsubscribe_link}>'
    msg['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click'


    # Create the container for the HTML and plain text (multipart/alternative)
    msg_body = MIMEMultipart('alternative')

    # Attach the plain text version first
    msg_body.attach(MIMEText(plain_text_message, 'plain', 'utf-8'))
    
    # Attach the HTML version second (email clients prefer the last alternative)
    msg_body.attach(MIMEText(html_message, 'html', 'utf-8'))

    # Attach the alternative content to the root message
    msg.attach(msg_body)

    # Return the raw message as bytes
    return msg.as_string()


def lambda_handler(event, context):
    # --- USER CHANGE: Hardcoded test data and commented out event parsing ---
    body = event.get("body")
    data = json.loads(body) # This line would cause an error since body is None
    
    # Hardcoded values for testing:
    # recipient_email = "erwangli2@gmail.com"
    # first_name = "Erwang"
    # rsvp = False
    
    # If you want to use the event data, uncomment these lines and remove the hardcoded ones:
    body = event.get("body")
    if body:
        data = json.loads(body)
        recipient_email = data["email"]
        first_name = data["first_name"]
        rsvp = data["rsvp"]  
    else:
        print("Warning: Event body is empty. Using hardcoded test data.")


    # 1. Create the raw email string
    raw_message = create_raw_email_message(recipient_email, first_name, rsvp)

    # 2. Send the email using send_raw_email (Necessary to use custom headers)
    try:
        response = ses.send_raw_email(
            Source=SENDER_EMAIL,
            Destinations=[recipient_email],
            RawMessage={
                'Data': raw_message
            }
        )
        print(f"SES response: {response}")
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"message": "Email sent successfully"}),
        }
    except Exception as e:
        print(f"Error sending email: {e}")
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"message": f"Error sending email: {str(e)}"}),
        }