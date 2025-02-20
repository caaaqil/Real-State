import { ObjectId } from 'mongodb';  // Or from mongoose if you are using Mongoose

const date = {
    user: [
        {
           
            "name": "Farah",
            "email": "farah@example.com",
            "password": "hashed_password",
            "role":['user', 'admin']
        }
    ],
    properties: [
        {
            "_id": new ObjectId("5f5b8e5c5c3f3f3f3f3f3f4d"),
            "title": "3 Bedroom Apartment",
            "description": "Spacious apartment with modern amenities.",
            "location": "Mogadishu, Somalia",
            "price": 120000,
            "image": "apartment1.jpg",
            "owner_id": new ObjectId("5f5b8e5c5c3f3f3f3f3f3f3f")  // Reference to Users collection
        }
    ],
    Bookings: [
        {
            "_id": new ObjectId("5f5b8e5c5c3f3f3f3f3f3f5f"),
            "user_id": new ObjectId("5f5b8e5c5c3f3f3f3f3f3f3f"),  
            "property_id": new ObjectId("5f5b8e5c5c3f3f3f3f3f3f4d"),  
            "status": "confirmed", 
            "date": new Date("2024-12-25T00:00:00Z")
        }
    ],
    Reviews: [
        {
            "_id": new ObjectId("5f5b8e5c5c3f3f3f3f3f3f6f"),
            "user_id": new ObjectId("5f5b8e5c5c3f3f3f3f3f3f3f"),  // Reference to Users collection
            "property_id": new ObjectId("5f5b8e5c5c3f3f3f3f3f3f4d"),  // Reference to Properties collection
            "rating": 4,  // Rating out of 5
            "comment": "Great apartment, but the location was a bit noisy."
        }
    ],
    Payments: [
        {
            "_id": new ObjectId("5f5b8e5c5c3f3f3f3f3f3f7f"),
            "user_id": new ObjectId("5f5b8e5c5c3f3f3f3f3f3f3f"),  // Reference to Users collection
            "property_id": new ObjectId("5f5b8e5c5c3f3f3f3f3f3f4d"),  // Reference to Properties collection
            "amount": 120000,
            "payment_status": "completed",  // or "pending", "failed"
            "payment_date": new Date("2024-12-25T00:00:00Z")
        }
    ]
};

export default date;
