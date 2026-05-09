import pandas as pd
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import time

cred = credentials.Certificate('serviceAccount.json')
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://hackiware-12fe3-default-rtdb.firebaseio.com/'
    })

df = pd.read_excel('data.xlsx')
ref = db.reference('leaderboard')

for index, row in df.iterrows():
    name = str(row.get('NAME', row.get('Name', ''))).strip()
    
    if name and name.lower() != 'nan':
        rank_val = row.get('RANK (1-10)', row.get('Rank'))
        rank = int(rank_val) if pd.notna(rank_val) else index + 1
        
        img_val = row.get('IMAGE UPLOAD', row.get('Image', ''))
        img_url = str(img_val).strip() if pd.notna(img_val) and str(img_val).lower() != 'nan' else ""
        
        data = {
            'imageUrl': img_url,
            'name': name,
            'rank': rank,
            'schoolsEducated': str(int(row.get('NO. OF SCHOOLS', row.get('No of Schools', 0))) if pd.notna(row.get('NO. OF SCHOOLS', row.get('No of Schools', 0))) else 0),
            'score': str(int(row.get('SCORE', row.get('Score', 0))) if pd.notna(row.get('SCORE', row.get('Score', 0))) else 0),
            'sessionsConducted': str(int(row.get('NO. OF SESSION CONDUCTED', row.get('No of Session Conducted', 0))) if pd.notna(row.get('NO. OF SESSION CONDUCTED', row.get('No of Session Conducted', 0))) else 0),
            'studentsEducated': str(int(row.get('NO. OF STUDENTS EDUCATED', row.get('No of Students Educated', 0))) if pd.notna(row.get('NO. OF STUDENTS EDUCATED', row.get('No of Students Educated', 0))) else 0),
            'updatedAt': int(time.time() * 1000)
        }
        
        ref.child(str(rank)).set(data)