# import uuid
# from fastapi import UploadFile
# from azure.storage.blob import BlobServiceClient
# from src.app.core.config import settings

# # Blob Service Client
# blob_service_client = BlobServiceClient.from_connection_string(
#     settings.azure_storage_connection_string
# )

# # Container Client
# container_client = blob_service_client.get_container_client(
#     settings.azure_storage_container
# )


# async def upload_resume_to_azure_blob(
#     file: UploadFile,
#     candidate_email: str,
# ) -> str:
#     """
#     Upload resume to Azure Blob Storage and return blob path
#     """

#     extension = file.filename.split(".")[-1]
#     safe_email = candidate_email.replace("@", "_").replace(".", "_")

#     blob_name = (
#         f"resumes/{safe_email}/{uuid.uuid4()}.{extension}"
#     )

#     blob_client = container_client.get_blob_client(blob_name)

#     content = await file.read()

#     blob_client.upload_blob(
#         content,
#         overwrite=True,
#         content_type=file.content_type,
#     )

#     return blob_name
