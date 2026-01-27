import requests
from src.app.core.config import settings

# ======================================================
# Microsoft Graph URLs
# ======================================================
GRAPH_TOKEN_URL = (
    f"https://login.microsoftonline.com/"
    f"{settings.azure_tenant_id}/oauth2/v2.0/token"
)

GRAPH_SEND_MAIL_URL = (
    "https://graph.microsoft.com/v1.0/users/{sender}/sendMail"
)


# ======================================================
# 🔐 Get Microsoft Graph Access Token
# ======================================================
def _get_graph_access_token() -> str:
    data = {
        "client_id": settings.azure_client_id,
        "client_secret": settings.azure_client_secret,
        "scope": "https://graph.microsoft.com/.default",
        "grant_type": "client_credentials",
    }

    response = requests.post(GRAPH_TOKEN_URL, data=data)
    response.raise_for_status()
    return response.json()["access_token"]


# ======================================================
# 📧 GENERIC EMAIL SENDER (THIS IS THE CORE)
# ======================================================
def send_email(
    *,
    to: str,
    subject: str,
    html_content: str,
) -> None:
    """
    Generic Outlook / Microsoft Graph email sender.
    Used by HR, Reports, Interviews, Notifications.
    """

    access_token = _get_graph_access_token()

    url = GRAPH_SEND_MAIL_URL.format(sender=settings.mail_from)

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    payload = {
        "message": {
            "subject": subject,
            "body": {
                "contentType": "HTML",
                "content": html_content,
            },
            "toRecipients": [
                {
                    "emailAddress": {
                        "address": to
                    }
                }
            ],
        },
        "saveToSentItems": True,
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()


# ======================================================
# 📩 CANDIDATE CONFIRMATION EMAIL (WRAPPER)
# ======================================================
def send_candidate_confirmation_email(
to: str,
first_name: str,
) -> None:
    """
    Sends confirmation email to candidate after application submission.
    """


    html = f"""
    <p>Dear <strong>{first_name}</strong>,</p>


    <p>
    Thank you for submitting your application to
    <strong>Mahavir Group</strong>.
    </p>


    <p>
    Our recruitment team has received your profile.
    We will contact you if your profile matches our requirements.
    </p>


    <br/>


    <p>
    Best Regards,<br/>
    <strong>Mahavir Group HR Team</strong>
    </p>
    """


    send_email(
    to=to,
    subject="Application Submitted Successfully – Mahavir Group",
    html_content=html,
    )



def send_teams_interview_email(
    *,
    to_email: str,
    candidate_name: str,
    interview_datetime: str,
    meeting_link: str,
) -> None:
    """
    Sends Microsoft Teams interview invite email to candidate.
    """

    html = f"""
    <p>Dear <strong>{candidate_name}</strong>,</p>

    <p>
        Your interview with <strong>Mahavir Group</strong> has been scheduled.
    </p>

    <p>
        <strong>Date & Time:</strong> {interview_datetime}
    </p>

    <p>
        <strong>Microsoft Teams Meeting Link:</strong><br/>
        <a href="{meeting_link}">{meeting_link}</a>
    </p>

    <br/>

    <p>
        Please ensure you join the meeting on time.
    </p>

    <br/>

    <p>
        Best Regards,<br/>
        <strong>Mahavir Group HR Team</strong>
    </p>
    """

    send_email(
        to=to_email,
        subject="Interview Scheduled – Mahavir Group",
        html_content=html,
    )
