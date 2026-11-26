import React, { useEffect, useState } from 'react';
import Message from './Message';

interface MessageProps {
  id: number;
  name: string;
  subject: string;
  read: boolean;
}

const MessageList: React.FC = () => {
  const [messageId, setMessageId] = useState<number>(0);
  const [messages, setMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    refreshMessageList();
  }, []);

  const deleteMessage = async (id: number) => {
    try {
      const response = await fetch(`/ui-api/message/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        refreshMessageList();
        if (typeof window !== 'undefined' && (window as any).updateMessageCount) {
          (window as any).updateMessageCount();
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const refreshMessageList = async () => {
    try {
      const response = await fetch('/ui-api/message');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const openMessage = (id: number) => {
    setMessageId(id);
  };

  const closeMessage = () => {
    refreshMessageList();
    setMessageId(0);
    if (typeof window !== 'undefined' && (window as any).updateMessageCount) {
      (window as any).updateMessageCount();
    }
  };

  return (
    <div>
        {messageId > 0 && 
            <Message messageId={messageId} closeMessage={closeMessage} refreshMessageList={refreshMessageList} />
        }
        <div className="messages">
            <div className="row">
                <div className="col-sm-2 rowHeader"><p>Name</p></div>
                <div className="col-sm-9 rowHeader"><p>Subject</p></div>
                <div className="col-sm-1"></div>
            </div>
            {messages.map((value, index) => {
                return  <div className={"row detail read-" + value.read} id={"message" + index} key={index}>
                            <div className="col-sm-2" data-testid={"message" + index} onClick={() => openMessage(value.id)}><p>{value.name}</p></div>
                            <div className="col-sm-9" data-testid={"messageDescription" + index} onClick={() => openMessage(value.id)}><p>{value.subject}</p></div>
                            <div className="col-sm-1">
                            <span data-testid={"DeleteMessage" + index} className="fa fa-remove roomDelete" onClick={() => deleteMessage(value.id)}></span>
                            </div>
                        </div>
            })}
        </div>
    </div>
  );
};

export default MessageList; 