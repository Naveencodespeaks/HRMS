# import requests
# from src.app.core.config import settings


# GRAPH_BASE = "https://graph.microsoft.com/v1.0"


# def create_teams_meeting(
#     *,
#     access_token: str,
#     subject: str,
#     start_time: str,
#     end_time: str,
# ) -> str:
#     """
#     Creates a Teams online meeting and returns join URL
#     """
#     url = f"{GRAPH_BASE}/users/{settings.mail_from}/onlineMeetings"

#     headers = {
#         "Authorization": f"Bearer {access_token}",
#         "Content-Type": "application/json",
#     }

#     payload = {
#         "subject": subject,
#         "startDateTime": start_time,
#         "endDateTime": end_time,
#     }

#     response = requests.post(url, headers=headers, json=payload)
#     response.raise_for_status()

#     return response.json()["joinWebUrl"]






import requests
from src.app.core.config import settings

GRAPH_BASE = "https://graph.microsoft.com/v1.0"


def create_teams_meeting(
    *,
    access_token: str,
    subject: str,
    start_time: str,
    end_time: str,
) -> str:
    """
    Creates a Microsoft Teams online meeting
    ✔ Auto-record enabled
    ✔ Returns join URL (works for Outlook + non-Outlook users)
    """

    url = f"{GRAPH_BASE}/users/{settings.mail_from}/onlineMeetings"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    payload = {
        "subject": subject,
        "startDateTime": start_time,
        "endDateTime": end_time,

        # 🎥 AUTO RECORD INTERVIEW
        "recordAutomatically": True,
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()

    return response.json()["joinWebUrl"]
