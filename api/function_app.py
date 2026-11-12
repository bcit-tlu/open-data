# Azure Function — authenticated dataset download via SAS redirect.
#
# Sits behind Entra ID Easy Auth.  Unauthenticated requests are
# redirected to Microsoft SSO automatically by the platform.
# Authenticated requests receive a short-lived SAS URL (302 redirect)
# that grants read-only access to the requested blob.

import datetime
import logging
import os

import azure.functions as func
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobSasPermissions, BlobServiceClient, generate_blob_sas

app = func.FunctionApp()

STORAGE_ACCOUNT = os.environ["STORAGE_ACCOUNT_NAME"]
CONTAINER = os.environ.get("CONTAINER_NAME", "datasets-latest")
SAS_TTL_MINUTES = int(os.environ.get("SAS_TTL_MINUTES", "5"))

ALLOWED_FILES: set[str] = {
    "audiovideoprocessed.zip",
    "contentobjects.zip",
    "discussionsforum.zip",
    "gradeobjects.zip",
    "organizationalunits.zip",
    "quizobjects.zip",
    "releaseconditionsobjects.zip",
    "roledetails.zip",
    "all-datasets.zip",
}


@app.function_name("download")
@app.route(route="download", methods=["GET"])
def download(req: func.HttpRequest) -> func.HttpResponse:
    file_name = req.params.get("file")
    if not file_name or file_name not in ALLOWED_FILES:
        return func.HttpResponse(
            "Invalid or missing 'file' parameter. "
            f"Allowed values: {', '.join(sorted(ALLOWED_FILES))}",
            status_code=400,
        )

    try:
        credential = DefaultAzureCredential()
        blob_service = BlobServiceClient(
            f"https://{STORAGE_ACCOUNT}.blob.core.windows.net",
            credential=credential,
        )

        now = datetime.datetime.now(datetime.timezone.utc)
        delegation_key = blob_service.get_user_delegation_key(
            key_start_time=now,
            key_expiry_time=now + datetime.timedelta(hours=1),
        )

        sas_token = generate_blob_sas(
            account_name=STORAGE_ACCOUNT,
            container_name=CONTAINER,
            blob_name=file_name,
            user_delegation_key=delegation_key,
            permission=BlobSasPermissions(read=True),
            expiry=now + datetime.timedelta(minutes=SAS_TTL_MINUTES),
            content_disposition=f"attachment; filename={file_name}",
        )

        sas_url = (
            f"https://{STORAGE_ACCOUNT}.blob.core.windows.net"
            f"/{CONTAINER}/{file_name}?{sas_token}"
        )
        return func.HttpResponse(status_code=302, headers={"Location": sas_url})

    except Exception:
        logging.exception("SAS URL generation failed")
        return func.HttpResponse(
            "Failed to generate download link. Please try again later.",
            status_code=500,
        )
