import React, { useEffect } from 'react';

interface SimilarRoomsProps {
    id : number;
    queryString: string;
}

const SimilarRooms: React.FC<SimilarRoomsProps> = ({ id, queryString }) => {

    const [rooms, setRooms] = React.useState([]);

    // Fetch all rooms
    useEffect(() => {
        const fetchRooms = async () => {
            const response = await fetch('/ui-api/room');
            const data = await response.json();
            
            const filteredRooms = data.rooms.filter((room: { roomid: number }) => room.roomid !== id);
            const limitedRooms = filteredRooms.slice(0, 3);
            
            setRooms(limitedRooms);
        };
        fetchRooms();
    }, []);

    return (
        <section className="bg-light py-5">
            <div className="container">
                <h2 className="fs-4 fw-bold mb-4">Similar Rooms You Might Like</h2>
                <div className="row g-4">
                    {rooms.map((room: { roomid: number; image: string; type: string; description: string; roomPrice: number }) => (
                        <div className="col-md-6 col-lg-4" key={room.roomid}>
                            <div className="card border-0 shadow-sm h-100">
                                <img src={room.image} className="card-img-top add-room" alt={room.type} />
                                <div className="card-body">
                                    <h3 className="card-title fs-5">{room.type}</h3>
                                    <div className="d-flex align-items-center mb-3">
                                        <i className="bi bi-person me-1"></i>
                                        <small className="text-muted">2 Guests</small>
                                        <div className="ms-auto">
                                            <span className="fw-bold text-primary">£{room.roomPrice}</span>
                                            <small className="text-muted">/night</small>
                                        </div>
                                    </div>
                                    <p className="card-text small">{room.description}</p>
                                    <a href={"/reservation/" + room.roomid + queryString} className="btn btn-outline-primary">View Details</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default SimilarRooms;
