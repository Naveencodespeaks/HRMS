# from src.app.core.db import Base
# from src.app.models.candidate import Candidate
# from src.app.models.hr_access_link import HRAccessLink

# __all__ = ["Candidate", "HRAccessLink"]



# src/app/models/__init__.py

from src.app.core.db import Base  # SAME Base used everywhere

from .candidate import Candidate
# from .job import Job
# from .interview import Interview
# from .offer import Offer
from .notification import Notification
# from .user import User

# ✅ HR access link MUST be imported here
from .hr_access_link import HRAccessLink



from src.app.models.candidate import Candidate
from src.app.models.user import User
from src.app.models.hr_access_link import HRAccessLink
from src.app.models.interview import Interview
from src.app.models.offer import Offer
from src.app.models.job import Job
