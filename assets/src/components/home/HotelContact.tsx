import React, { useState } from 'react';
import { JSX } from 'react';

interface ContactDetails {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface HotelContactProps {
  contactDetails?: ContactDetails;
}

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
}

const HotelContact: React.FC<HotelContactProps> = ({ contactDetails }) => {
  const [contact, setContactDetails] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "", 
    description: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMessages, setErrors] = useState<string[]>([]);

  const updateContact = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setContactDetails(prevContact => ({
      ...prevContact,
      [id]: value
    }));
  };

  const submitForm = async () => {
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData || ['An error occurred while submitting your message']);
        return;
      }
      
      setSubmitted(true);
      setErrors([]);
    } catch (error) {
      console.error('Error submitting message:', error);
      setErrors(['An unexpected error occurred. Please try again later.']);
    }
  };

  let form: JSX.Element;
  let errors: JSX.Element = <></>;

  if (errorMessages.length > 0) {
    errors = (
      <div className="alert alert-danger" style={{ marginBottom: "5rem" }}>
        {errorMessages.map((value, id) => (
          <p key={id}>{value}</p>
        ))}
      </div>
    );
  }

  if(submitted) {
    return (
      <section id="contact" className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow">
                <div className="card-body p-4">
                    <h3 className="h4 mb-4">Thanks for getting in touch {contact.name}!</h3>
                    <p>We'll get back to you about</p>
                    <p style={{ fontWeight: "bold" }}>{contact.subject}</p>
                    <p>as soon as possible.</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
      </section>
    );
  }

  return (
      <section id="contact" className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow">
                <div className="card-body p-4">
                  <h3 className="h4 mb-4 text-center">Send Us a Message</h3>
                  
                  <form action="">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input type="text" data-testid="ContactName" className="form-control" id="name" onChange={updateContact} />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input type="email" data-testid="ContactEmail" className="form-control" id="email" onChange={updateContact} />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Phone</label>
                      <input type="tel" data-testid="ContactPhone" className="form-control" id="phone" onChange={updateContact} />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="subject" className="form-label">Subject</label>
                      <input type="text" data-testid="ContactSubject" className="form-control" id="subject" onChange={updateContact} />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="message" className="form-label">Message</label>
                      <textarea data-testid="ContactDescription" className="form-control" id="description" rows={5} onChange={updateContact}></textarea>
                    </div>
                    
                    <div className="d-grid">
                      <button type="button" className="btn btn-primary" onClick={submitForm}>Submit</button>
                    </div>
                  </form>
                  <br />
                  {errors}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );

  // if (submitted) {
  //   form = (
  //     <div style={{ height: "412px" }}>
  //       <h2>Thanks for getting in touch {contact.name}!</h2>
  //       <p>We'll get back to you about</p>
  //       <p style={{ fontWeight: "bold" }}>{contact.subject}</p>
  //       <p>as soon as possible.</p>
  //     </div>
  //   );
  // } else {
  //   form = (
  //     <form>
  //       <div className="input-group mb-3">
  //         <div className="input-group-prepend">
  //           <span className="input-group-text" id="basic-addon1"><span className="fa fa-id-card"></span></span>
  //         </div>
  //         <input 
  //           type="text" 
  //           data-testid="ContactName" 
  //           className="form-control" 
  //           placeholder="Name" 
  //           aria-label="Name" 
  //           id="name" 
  //           aria-describedby="basic-addon1" 
  //           onChange={updateContact} 
  //         />
  //       </div>
  //       <div className="input-group mb-3">
  //         <div className="input-group-prepend">
  //           <span className="input-group-text" id="basic-addon1"><span className="fa fa-envelope"></span></span>
  //         </div>
  //         <input 
  //           type="text" 
  //           data-testid="ContactEmail" 
  //           className="form-control" 
  //           placeholder="Email" 
  //           aria-label="Email" 
  //           id="email" 
  //           aria-describedby="basic-addon1" 
  //           onChange={updateContact} 
  //         />
  //       </div>
  //       <div className="input-group mb-3">
  //         <div className="input-group-prepend">
  //           <span className="input-group-text" id="basic-addon1"><span className="fa fa-phone"></span></span>
  //         </div>
  //         <input 
  //           type="text" 
  //           data-testid="ContactPhone" 
  //           className="form-control" 
  //           placeholder="Phone" 
  //           aria-label="Phone" 
  //           id="phone" 
  //           aria-describedby="basic-addon1" 
  //           onChange={updateContact} 
  //         />
  //       </div>
  //       <div className="input-group mb-3">
  //         <div className="input-group-prepend">
  //           <span className="input-group-text" id="basic-addon1"><span className="fa fa-envelope"></span></span>
  //         </div>
  //         <input 
  //           type="text" 
  //           data-testid="ContactSubject" 
  //           className="form-control" 
  //           placeholder="Subject" 
  //           aria-label="Subject" 
  //           id="subject" 
  //           aria-describedby="basic-addon1" 
  //           onChange={updateContact} 
  //         />
  //       </div>
  //       <div className="input-group">
  //         <div className="input-group-prepend">
  //           <span className="input-group-text">Message</span>
  //         </div>
  //         <textarea 
  //           data-testid="ContactDescription" 
  //           className="form-control" 
  //           aria-label="Description" 
  //           id="description" 
  //           rows={5} 
  //           onChange={updateContact}
  //         ></textarea>
  //       </div>
  //       <br />
  //       {errors}
  //       <button 
  //         type='button' 
  //         className='btn btn-outline-primary float-right' 
  //         id="submitContact" 
  //         onClick={submitForm}
  //       >
  //         Submit
  //       </button>
  //     </form>
  //   );
  // }

  
};

export default HotelContact; 