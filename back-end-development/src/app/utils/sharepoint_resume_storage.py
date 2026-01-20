import requests
import base64
from src.app.core.config import settings



GRAPH_SCOPE = "https://graph.microsoft.com/.default"


def get_graph_access_token() -> str:
    """
    Get Microsoft Graph access token using client credentials
    """
    token_url = (
        f"https://login.microsoftonline.com/"
        f"{settings.AZURE_TENANT_ID}/oauth2/v2.0/token"
    )

    data = {
        "grant_type": "client_credentials",
        "client_id": settings.AZURE_CLIENT_ID,
        "client_secret": settings.AZURE_CLIENT_SECRET,
        "scope": GRAPH_SCOPE,
    }

    response = requests.post(token_url, data=data)
    response.raise_for_status()

    return response.json()["access_token"]


def upload_resume_to_sharepoint(
    *,
    candidate_id: str,
    filename: str,
    file_bytes: bytes,
    content_type: str,
) -> str:
    """
    Upload resume to SharePoint Candidate_Resumes folder
    and return the download (webUrl)
    """

    access_token = get_graph_access_token()

    safe_filename = f"{candidate_id}_{filename}"

    upload_url = (
        f"https://graph.microsoft.com/v1.0/sites/"
        f"{settings.SHAREPOINT_SITE_ID}"
        f"/drive/root:/{settings.SHAREPOINT_RESUME_FOLDER}/{safe_filename}:/content"
    )

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": content_type,
    }

    response = requests.put(upload_url, headers=headers, data=file_bytes)
    response.raise_for_status()

    # SharePoint response contains a permanent download URL
    return response.json()["webUrl"]


def delete_resume_from_sharepoint(
    *,
    candidate_id: str,
    filename: str,
) -> None:
    """
    Delete resume from SharePoint Candidate_Resumes folder
    """

    access_token = get_graph_access_token()

    safe_filename = f"{candidate_id}_{filename}"

    delete_url = (
        f"https://graph.microsoft.com/v1.0/sites/"
        f"{settings.SHAREPOINT_SITE_ID}"
        f"/drive/root:/{settings.SHAREPOINT_RESUME_FOLDER}/{safe_filename}"
    )

    headers = {
        "Authorization": f"Bearer {access_token}",
    }

    response = requests.delete(delete_url, headers=headers)
    response.raise_for_status()




def get_secure_resume_download_url(resume_web_url: str) -> str:
    """
    Convert SharePoint webUrl to a secure temporary download URL
    using Microsoft Graph
    """

    access_token = get_graph_access_token()

    # Encode webUrl → Graph shareId
    encoded_url = base64.urlsafe_b64encode(
        resume_web_url.encode("utf-8")
    ).decode("utf-8").rstrip("=")

    share_id = f"u!{encoded_url}"

    graph_url = f"https://graph.microsoft.com/v1.0/shares/{share_id}/driveItem"

    headers = {
        "Authorization": f"Bearer {access_token}",
    }

    response = requests.get(graph_url, headers=headers)
    response.raise_for_status()

    data = response.json()

    # This URL is temporary + secure
    return data["@microsoft.graph.downloadUrl"]
