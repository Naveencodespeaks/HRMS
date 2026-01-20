# from pydantic_settings import BaseSettings, SettingsConfigDict


# class Settings(BaseSettings):
#     # ======================
#     # App
#     # ======================
#     environment: str = "local"
#     debug: bool = True

#     # ======================
#     # Database
#     # ======================
#     db_host: str
#     db_port: int = 5432
#     db_name: str
#     db_user: str
#     db_password: str

#     # ======================
#     # Azure / Microsoft Graph
#     # ======================
#     azure_tenant_id: str
#     azure_client_id: str
#     azure_client_secret: str

#     # ==========================
#     # Azure Storage
#     # Azure Blob Storage
#     # azure_storage_connection_string: str
#     # azure_storage_container: str
#     # ==========================
    



#     mail_from: str

#     model_config = SettingsConfigDict(
#         env_file=".env",
#         env_prefix="",
#         case_sensitive=False,
#         extra="forbid",  # keep strict (GOOD PRACTICE)
#     )

#     # ======================
#     # Database URLs
#     # ======================
#     @property
#     def database_url_async(self) -> str:
#         return (
#             f"postgresql+asyncpg://{self.db_user}:{self.db_password}"
#             f"@{self.db_host}:{self.db_port}/{self.db_name}"
#         )

#     @property
#     def database_url_sync(self) -> str:
#         return (
#             f"postgresql://{self.db_user}:{self.db_password}"
#             f"@{self.db_host}:{self.db_port}/{self.db_name}"
#         )


# settings = Settings()






from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ======================
    # App
    # ======================
    environment: str = "local"
    debug: bool = True

    # ======================
    # Database
    # ======================
    db_host: str
    db_port: int = 5432
    db_name: str
    db_user: str
    db_password: str

    # ======================
    # Azure / Microsoft Graph
    # ======================
    azure_tenant_id: str
    azure_client_id: str
    azure_client_secret: str

    # ======================
    # SharePoint (✅ REQUIRED)
    # ======================
    sharepoint_site_id: str
    sharepoint_resume_folder: str

    # ======================
    # Email
    # ======================
    mail_from: str

    # ======================
    # Pydantic Settings
    # ======================
    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="",
        case_sensitive=False,  # allows AZURE_TENANT_ID -> azure_tenant_id
        extra="forbid",        # 🚨 keep strict (BEST PRACTICE)
    )

    # ======================
    # Database URLs
    # ======================
    @property
    def database_url_async(self) -> str:
        return (
            f"postgresql+asyncpg://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    @property
    def database_url_sync(self) -> str:
        return (
            f"postgresql://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )


settings = Settings()
