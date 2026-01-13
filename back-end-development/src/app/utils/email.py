import requests
from src.app.core.config import settings


GRAPH_TOKEN_URL = (
    f"https://login.microsoftonline.com/{settings.azure_tenant_id}/oauth2/v2.0/token"
)

GRAPH_SEND_MAIL_URL = "https://graph.microsoft.com/v1.0/users/{sender}/sendMail"


def _get_graph_access_token() -> str:
    """
    Get Microsoft Graph access token using client credentials flow
    """
    data = {
        "client_id": settings.azure_client_id,
        "client_secret": settings.azure_client_secret,
        "scope": "https://graph.microsoft.com/.default",
        "grant_type": "client_credentials",
    }

    response = requests.post(GRAPH_TOKEN_URL, data=data)
    response.raise_for_status()
    return response.json()["access_token"]


def send_candidate_confirmation_email(
    to_email: str,
    first_name: str,
) -> None:
    """
    Send confirmation email to candidate using Microsoft Graph
    """
    access_token = _get_graph_access_token()

    url = GRAPH_SEND_MAIL_URL.format(sender=settings.mail_from)

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    payload = {
        "message": {
            "subject": "Application Submitted Successfully – Mahavir Group",
            "body": {
                "contentType": "HTML",
                "content": f"""
                <p>Dear <strong>{first_name}</strong>,</p>

                <p>
                  Thank you for submitting your details to
                  <strong>Mahavir Group</strong>.
                </p>

                <p>
                  We have successfully received your application.
                  Our recruitment team will review your profile and
                  contact you if it matches our requirements.
                </p>

                <br/>

                <p>
                  Best Regards,<br/>
                  <strong>Mahavir Group HR Team</strong>
                </p>
                """,
            },
            "toRecipients": [
                {
                    "emailAddress": {
                        "address": to_email
                    }
                }
            ],
        },
        "saveToSentItems": "false",
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
