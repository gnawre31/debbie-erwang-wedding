import json
import os
import requests
from datetime import datetime

def generate_submission_id(first_name, last_name):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    first_initial = first_name[0].lower() if first_name else ''
    last_initial = last_name[0].lower() if last_name else ''
    return f"{first_initial}{last_initial}{timestamp}"

def lambda_handler(event, context):
    NOTION_API_URL = "https://api.notion.com/v1/pages"
    NOTION_TOKEN = os.environ['NOTION_TOKEN']
    DATABASE_ID = os.environ['DATABASE_ID']
    NOTION_VERSION = "2022-06-28"
    try:
        body = json.loads(event.get('body', '{}'))

        first_name = body.get('first_name', '')
        last_name = body.get('last_name', '')
        email = body.get('email', '')
        rsvp = body.get('rsvp', False)
        additional_notes = body.get('additional_notes', '')

        submission_id = generate_submission_id(first_name, last_name)

        headers = {
            "Authorization": f"Bearer {NOTION_TOKEN}",
            "Content-Type": "application/json",
            "Notion-Version": NOTION_VERSION
        }

        data = {
            "parent": { "database_id": DATABASE_ID },
            "properties": {
                "first_name": {
                    "rich_text": [
                        { "text": { "content": first_name } }
                    ]
                },
                "last_name": {
                    "rich_text": [
                        { "text": { "content": last_name } }
                    ]
                },
                "email": {
                    "email": email
                },
                "rsvp": {
                    "checkbox": rsvp
                },
                "additional_notes": {
                    "rich_text": [
                        { "text": { "content": additional_notes } }
                    ]
                },
                "submission_id": {
                    "title": [
                        { "text": { "content": submission_id } }
                    ]
                }
            }
        }

        response = requests.post(NOTION_API_URL, headers=headers, json=data)

        return {
            'statusCode': response.status_code,
            'body': response.text
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({ 'error': str(e) })
        }