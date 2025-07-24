# Kudos App

A full‑stack application for sending and receiving “kudos” (peer‑to‑peer appreciation) within an organization.  

##  Features:-

- **Secure Authentication**  
  – JWT‑based login & logout  
  – Token refresh endpoint  

- **Organization‑Scoped Users**  
  – Users belong to exactly one Organization  
  – You see only your colleagues in dropdowns and lists  

- **Kudos Management**  
  – Send up to **3 kudos per week**  
  – Cannot send kudos to yourself or to users outside your organization  
  – View **Received** and **Sent** kudos separately  

- **Responsive UI**  
  – Built with React + Material UI  
  – Loading indicators & inline error messages  


##  Tech Stack

| Layer       | Technology                                     |
|-------------|------------------------------------------------|
| **Backend** | Django 5.2, Django REST Framework, SimpleJWT   |
| **Frontend**| React, React Router, Axios, Material UI        |
| **Database**| SQLite                                         |
| **Extras**  | django‑cors‑headers, django‑filters            |


##  Getting Started

### Prerequisites

- Python 3.10+  
- Node.js 16+ & npm  
- Git  


### Clone the Repo and run FE and BE
```bash
git clone https://github.com/Akshita963/kudos.git
cd kudos-app
git checkout kudos
git pull origin kudos

## 1. Backend Setup
```bash
cd backend
python -m venv env // creating virtual environment
# Windows
env\Scripts\activate  // activate the environment
# macOS/Linux
source env/bin/activate  // activate the environment

pip install -r requirements.txt

# 1.1 Create First Organization

# Open a Python shell:
python manage.py shell

from api.models import Organization
Organization.objects.create(name="DemoOrg")
exit()

# 1.2 Run Migrations & Superuser

python manage.py migrate
python manage.py createsuperuser

# 1.3 Start Django Server

python manage.py runserver


## 2. Frontend Setup

```bash

cd frontend
npm install
npm start

#Your React app opens at http://localhost:3000/.


Usage:-

Login

Go to /login

Enter your superuser (or any created user) credentials

Dashboard

Received tab: see kudos sent to you

Sent tab: see kudos you’ve sent

Give Kudos

Navigate to Give Kudos

Select a colleague (dropdown excludes yourself)

Enter a message (max 500 characters)

Click Send (button disabled until fields are valid)

Logout

Click Logout in the top navigation
