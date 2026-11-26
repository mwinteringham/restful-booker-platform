import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';

interface MessageProps {
  messageId: number;
  closeMessage: () => void;
  refreshMessageList: () => void;
}

interface MessageDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
  read: boolean;
}

const Message: React.FC<MessageProps> = ({ messageId, closeMessage, refreshMessageList }) => {
  const [message, setMessage] = useState<MessageDetails | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`/ui-api/message/${messageId}`);
        if (response.ok) {
          const data = await response.json();
          setMessage(data);
          
          // Mark as read if not already
          if (data && !data.read) {
            markAsRead();
          }
        }
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };

    fetchMessage();
  }, [messageId]);

  const markAsRead = async () => {
    try {
      const response = await fetch(`/ui-api/message/${messageId}/read`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        // Update the message list and count
        refreshMessageList();
        if (typeof window !== 'undefined' && (window as any).updateMessageCount) {
          (window as any).updateMessageCount();
        }
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  if (!message) {
    return <div></div>;
  }

  return (
    <ReactModal 
        isOpen={true}
        ariaHideApp={false}
        contentLabel="onRequestClose Example"
        className="message-modal" >
        
        <div data-testid="message">
            <div className="form-row">
                <div className="col-10">
                    <p><span>From: </span>{message.name}</p>
                </div>
                <div className="col-2">
                    <p><span>Phone: </span>{message.phone}</p>
                </div>
            </div>
            <div className="form-row">
                <div className="col-12">
                    <p><span>Email: </span>{message.email}</p>
                </div>
            </div>
            <div className="form-row">
                <div className="col-12">
                    <p><span>{message.subject}</span></p>
                </div>
            </div>
            <div className="form-row">
                <div className="col-12">
                    <p>{message.description}</p>
                </div>
            </div>
            <div className="form-row">
                <div className="col-12">
                    <button className="btn btn-outline-primary" onClick={() => closeMessage()}>Close</button>
                </div>
            </div>
        </div>
    </ReactModal>
  );
};

export default Message; 