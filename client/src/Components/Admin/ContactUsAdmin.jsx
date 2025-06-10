import React, { useState, useEffect } from 'react';
import apiService from '../../Services/apiService';
import AdminSidemenu from './AdminSidemenu';
import '../Style/ContactUsAdmin.css';
import AdminNav from './AdminNav';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import Tooltip from '@mui/material/Tooltip';
function ContactUsAdmin() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await apiService.getAllContactUs();
        setContacts(response.data.contact);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteContactMessage(id);
      setContacts(contacts.filter(contact => contact._id !== id));
      // toast.success("Deleted Successfully")
      alert("Deleted Successfully")
    } catch (err) {
      // toast.error('Failed to delete message')
      alert('Failed to delete message')
      setError('Failed to delete message');
    }
  };

  return (
    <div className="admin-container">
      <ToastContainer />
      <AdminNav />
      <div className="admin-content-wrapper">
        <AdminSidemenu />

        <div className="admin-main-content">
          <div className="admin-contact-container">
            <div className='Contact-heading'>
              <h1 className="admin-page-title">Contact Us Messages</h1>
            </div>

            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading messages...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                Error: {error}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="contacts-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.length > 0 ? (
                      contacts.map((contact) => (
                        <tr key={contact._id}>
                          <td>{contact.name}</td>
                          <td>{contact.email}</td>
                          <td>
                            <Tooltip title={contact.message} placement="top-start">
                              <div className="message-cell">
                                {contact.message.length > 10
                                  ? `${contact.message.substring(0, 10)}...`
                                  : contact.message}
                              </div>
                            </Tooltip>
                          </td>
                          <td>{formatDate(contact.createdAt)}</td>
                          <td>
                            <IconButton
                              className="delete-btn"
                              onClick={() => handleDelete(contact._id)}
                              title="Delete message"
                            >
                              <DeleteIcon className="delete-icon" />
                            </IconButton>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-reviews-message" style={{color:"gray"}}>
                          No contact messages found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUsAdmin;