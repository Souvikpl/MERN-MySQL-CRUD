import React, {useState, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Moment from 'moment';
import './View.css';
import jsPDF from "jspdf";
import "jspdf-autotable";

const View = () => {

    const [user, setUser]=useState({});
    const {id}=useParams();
    
    useEffect(()=>{

        axios.get(`http://localhost:5000/api/get/${id}`)
        .then((res)=> setUser({...res.data[0]}));
        
    },[id]);

    const exportPDF=()=>{
        
            const unit = "pt";
            const size = "A4";
            const orientation = "portrait"; 
            
            
            const marginLeft = 40;
            const doc = new jsPDF({orientation, unit, size,
              encryption: {
                userPassword: `${user.name}`,
                userPermissions: ["print", "modify", "copy", "annot-forms"]
              }
            });
            
            doc.setFontSize(15);
        
            const title = "Customer Details";
            const headers = [["ID", "Name", "Date of birth", "Adhaar Number", "Pan", "Latitude", "Longitude"]];
            
            const data = [[user.id, user.name, Moment(user.dob).format('DD-MM-YYYY'), user.adhaar, user.pan, user.latitude, user.longitude]];
            
            let content = {
              startY: 50,
              head: headers,
              body: data
            };
        
            doc.text(title, marginLeft, 40);
            doc.autoTable(content);
            doc.save(`${user.name}.pdf`)
     }
    

  return (
    <div style={{marginTop: "150px"}}>
        <div className='card'>
            <div className='card-header'><p>Customer Details</p></div>
            <div className='container'>
                <strong>ID: </strong>
                <span>{id}</span>
                <br/>
                <br/>
                <strong>Name: </strong>
                <span>{user.name}</span>
                <br/>
                <br/>
                <strong>Date of Birth: </strong>
                <span>{Moment(user.dob).format('DD-MM-YYYY')}</span>
                <br/>
                <br/>
                <strong>Adhaar Nuumber: </strong>
                <span>{user.adhaar}</span>
                <br/>
                <br/>
                <strong>Pan: </strong>
                <span><img src={`http://127.0.0.1:8887/${user.pan}`} alt="pan" width="50" height="50"/></span>
                <br/>
                <br/>
                <strong> Latitude: </strong>
                <span>{user.latitude}</span>
                <br/>
                <br/>
                <strong> Longitude: </strong>
                <span>{user.longitude}</span>
                <br/>
                <br/>
                <button className='btn btn-danger' onClick={() => exportPDF()}>Download</button>
                <Link to="/">
                    <div className='btn btn-edit'>Go Back</div>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default View