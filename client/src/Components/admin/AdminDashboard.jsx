import React from 'react'
import AdminSidemenu from './AdminSidemenu'
import AdminNav from './AdminNav'
import '../Style/AdminDashboard.css'
import SearchBar from './SearchBar'
import { Avatar } from '@mui/material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
const dummyDrivers = [
    {
        id: 1,
        fullName: "John Driver",
        email: "john.driver@email.com",
        phone: "+1 234 567 890",
        profilePhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL7yEGVr0WDqJTtcLbXpUXmUSwwzlHDtF1XA&s"
    },
    {
        id: 2,
        fullName: "Sarah Wheeler",
        email: "sarah.wheeler@email.com",
        phone: "+1 345 678 901",
        profilePhoto: "https://www.paraglidingassociationofindia.org/wp-content/uploads/2022/02/passport-size.png"
    },
    {
        id: 3,
        fullName: "Mike Hauler",
        email: "mike.hauler@email.com",
        phone: "+1 456 789 012",
        profilePhoto: "https://png.pngtree.com/png-clipart/20240314/original/pngtree-red-shirt-with-ash-tie-suit-for-mens-passport-size-photo-png-image_14593360.png"
    },
    {
        id: 4,
        fullName: "Emma Rider",
        email: "emma.rider@email.com",
        phone: "+1 567 890 123",
        profilePhoto: "https://pbs.twimg.com/media/EjY_lxhUcAAqCde.jpg:large"
    },
    {
        id: 5,
        fullName: "Liam Transporter",
        email: "liam.transporter@email.com",
        phone: "+1 678 901 234",
        profilePhoto: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Jai_Passport_Size_Photo.jpg"
    },
    {
        id: 6,
        fullName: "Olivia Courier",
        email: "olivia.courier@email.com",
        phone: "+1 789 012 345",
        profilePhoto: "https://lawschoolpolicyreview.com/wp-content/uploads/2018/06/passport-size-photo-2-e1558013566564.jpg?w=596"
    },
    {
        id: 7,
        fullName: "Noah Racer",
        email: "noah.racer@email.com",
        phone: "+1 890 123 456",
        profilePhoto: "https://www.zica.co.zm/wp-content/uploads/2020/08/Passport-Size-Photo.jpg"
    },
    {
        id: 8,
        fullName: "Ava Mover",
        email: "ava.mover@email.com",
        phone: "+1 901 234 567",
        profilePhoto: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Amit-akme-passport-size-pic-33-scaled-1220x1755.jpg"
    },
    {
        id: 9,
        fullName: "William Hauler",
        email: "william.hauler@email.com",
        phone: "+1 012 345 678",
        profilePhoto: "https://c8.alamy.com/comp/2WRYEE9/passport-photo-portrait-of-young-man-on-white-background-2WRYEE9.jpg"
    },
    {
        id: 10,
        fullName: "Sophia Wheeler",
        email: "sophia.wheeler@email.com",
        phone: "+1 123 456 789",
        profilePhoto: "https://joinindiancoastguard.cdac.in/cgept/assets/img/uploadphoto/a.jpeg"
    }
];

function AdminDashboard() {
    return (
        <div className="admin-dashboard-container">
            <AdminNav />
            <AdminSidemenu />

            <div className="dashboard-main-content">
                <h1 className='drivers-title'>DRIVERS</h1>
                <div className='container-search'>
                    <SearchBar />
                </div>
                <h3>View All Drivers</h3>
                <div className="content-wrapper">
                    {dummyDrivers.map((driver) => (
                        <div key={driver.id} className='doner-card-dashboard'>
                            <div className="avatar-container">
                                <Avatar
                                    alt={driver.fullName}
                                    src={driver.profilePhoto}
                                    sx={{ width: 120, height: 120 }}
                                />
                            </div>

                            <div className="text-container">
                                <h3>{driver.fullName}</h3>
                                <div className="contact-info">
                                    <EmailOutlinedIcon style={{ fontSize: 20, marginRight: 8 }} />
                                    <span>{driver.email}</span>
                                </div>
                                <div className="contact-info">
                                    <LocalPhoneOutlinedIcon style={{ fontSize: 20, marginRight: 8 }} />
                                    <span>{driver.phone}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard