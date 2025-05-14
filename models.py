from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Users(Base):
    __tablename__ = "users"

    User_id = Column(Integer, primary_key=True, autoincrement=True)
    User_name = Column(String(45))
    User_number = Column(String(45))
    User_password = Column(String(45))
    User_email = Column(String(255))
    Total_used = Column(String(45))
    Created_at = Column(String(45))
    
    #reservations = relationship("Reservations", back_populates="user")
'''
class Available(Base):
    __tablename__ = "available"
    
    Available_id = Column(Integer, primary_key=True)
    Available_Status = Column(String(45))
    
    seats = relationship("Seats", back_populates="available")

class Seats(Base):
    __tablename__ = "seats"
    
    Seat_id = Column(Integer, primary_key=True, index=True)
    Seat_number = Column(String(16))
    Seat_location = Column(String(45))
    Available_Status = Column(Integer, ForeignKey("Available.Available_id"))
    
    available = relationship("Available", back_populates="seats")
    reservations = relationship("Reservations", back_populates="seat")

class Reservations(Base):
    __tablename__ = "reservations"
    
    Users_User_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    Seats_Seat_id = Column(Integer, ForeignKey("seats.Seat_id"), primary_key=True)
    
    Reserve = Column(String(45))
    Expire = Column(String(45))
    
    user = relationship("User", back_populates="reservations")
    seat = relationship("Seat", back_populates="reservations")
'''