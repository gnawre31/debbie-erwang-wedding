# lambda_function.py
import boto3
import os

ses = boto3.client("ses", region_name="us-east-1")

SENDER_EMAIL = "debbie.erwang@gmail.com" 

def lambda_handler(event, context):
    body = event.get("body")
    import json
    data = json.loads(body)

    # recipient_email = data["email"]
    recipient_email = "erwangli2@gmail.com"
    first_name = data["first_name"]
    rsvp = data["rsvp"]  

    message = f"""
    Hi {first_name},

    Thanks for your RSVP. We're excited to see you!

    ❤️ Debbie & Erwang
    """

    response = ses.send_email(
        Source=SENDER_EMAIL,
        Destination={"ToAddresses": [recipient_email]},
        Message={
            "Subject": {"Data": "Your RSVP Confirmation"},
            "Body": {"Text": {"Data": message}},
        },
    )

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"message": "Email sent successfully"}),
    }
