from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router
from database import Base, engine
from models import Users

# FastAPI 앱 인스턴스 생성
app = FastAPI()

# CORS 허용 도메인 목록
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",  
]

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 이 리스트에 명확히 추가해야 함
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(auth_router.router, prefix="/v1/auth")

# 테이블 생성
#Base.metadata.create_all(bind=engine)

# 기본 루트 테스트용 엔드포인트
@app.get("/")
def root():
    return {"message": "졸프 뿌시기(전에 내가 먼저 사라질 듯)"} # 서버 정상 동작 확인용 응답
