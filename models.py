from sqlalchemy import Column, Integer, String, Boolean, Enum, ForeignKey, DateTime, Time, Date
from sqlalchemy.orm import relationship
from db import Base
import enum
from datetime import datetime

# 예약 상태 enum 정의
class ReservationStatus(enum.Enum):
    active = "active"
    cancelled = "cancelled"
    expired = "expired"

# 사용자 테이블
class User(Base):
    __tablename__ = "USER_info"

    USER_id = Column(String(20), primary_key=True, index=True)
    USER_password = Column(String(20), index=True, nullable=False)
    USER_email = Column(String(50), index=True, nullable=False)
    USER_studentnumber = Column(Integer, index=True, nullable=True)
    USER_name = Column(String(10), index=True, nullable=False)
    TOTAL_used = Column(Time, index=True, nullable=True)
    SIGNUP_time = Column(DateTime, index=True, nullable=True)

    reservations = relationship("Reservation", back_populates="user")


# 좌석 테이블
class Seat(Base):
    __tablename__ = "SEAT_info"

    SEAT_id = Column(Integer, primary_key=True, index=True)
    SEAT_number = Column(String(10), nullable=False)
    SEAT_status = Column(Boolean, default=True)
    RROOM_id = Column(Integer, ForeignKey("RROOM.RROOM_id"), nullable=False)

    reservations = relationship("Reservation", back_populates="seat")

# 열람실 테이블
class Readingroom(Base):
    __tablename__ = "RROOM"

    RROOM_id = Column(Integer, primary_key=True, index=True)
    RROOM_name = Column(String(10), nullable=False)
    RROOM_totalseats = Column(Integer, nullable=True)
    
    seats = relationship("Seat", backref="room")

# 예약 테이블
class Reservation(Base):
    __tablename__ = "reservation"

    RESERVATION_id = Column(Integer, primary_key=True, index=True)
    RESERVATION_status = Column(Enum(ReservationStatus), default=ReservationStatus.active.value)
    TIME_start = Column(DateTime, nullable=False, default=datetime.utcnow)
    TIME_end = Column(DateTime, nullable=False)
    USER_id = Column(String(20), ForeignKey("USER_info.USER_id"), nullable=False)
    SEAT_id = Column(Integer, ForeignKey("SEAT_info.SEAT_id"), nullable=False)


    user = relationship("User", back_populates="reservations")
    seat = relationship("Seat", back_populates="reservations")

