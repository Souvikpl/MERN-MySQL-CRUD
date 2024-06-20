import React, {useState, useEffect} from 'react';
import {useNavigate, useParams, Link} from "react-router-dom";
import "./AddEdit.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WebcamCapture } from './Webcam';

const initialState ={
    name: "",
    dob: "",
    adhaar: "",
    pan: "",
};

const AddEdit = () => {

    const[state,setState] = useState(initialState); 
    const {name, dob, adhaar, pan}= state;
    const[capImg, setCapImg] = useState(null)
    var lat,long;
    const history =useNavigate();

    const {id} =useParams();

    useEffect(()=>{

        axios.get(`http://localhost:5000/api/get/${id}`)
        .then((res)=> setState({...res.data[0]}));

    },[id]);

    const getData=(data)=>{
        
        setCapImg(data) 
    }

    if ('geolocation' in navigator){
        // console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(position =>
        {
        lat= position.coords.latitude;
        document.getElementById('latitude').textContent= lat;
        long= position.coords.longitude;
        document.getElementById('longitude').textContent= long;
        });

    }
    else{
        console.log('geolocation not available');
    }

    const handleSubmit=(e)=>{
         
        e.preventDefault();

        let formdata= new FormData()
        formdata.append('pan',state.pan)
        formdata.append('name',state.name)
        formdata.append('dob',state.dob)
        formdata.append('adhaar',state.adhaar)
        formdata.append('cam',capImg)
        formdata.append('lat',lat)
        formdata.append('long',long)

        var adhaarnumber= /^\d{12}$/;

        if(!name || !dob || !adhaar || !pan ){

            toast.error("All Field Required");

        }

        else if (adhaar.match(adhaarnumber)) {
            
            if(!id){
                axios.post("http://localhost:5000/api/post",formdata)
                .then((res)=>{
                    console.log(res);
                    setState({name: "", dob: "",adhaar: "", pan: ""})
                }).catch((err)=>
                    toast.error(err.response.data));
                    toast.success('Customer Added');
            }else{
                axios.put(`http://localhost:5000/api/update/${id}`,formdata)
            .then((res)=>{
                console.log(res);
                setState({ name: "", dob: "", adhaar: "", pan: ""});
            })
            .catch((e)=> toast.error(e.response.data));
            toast.success("Customer Updated");
            
            }
            
            setTimeout(()=> history("/"),500);
        }

        else if (adhaar.match!==adhaarnumber){
            toast.error("Enter Valid Adhaar number");
        }
    };

    const handleInputChange=(e)=>{

            const {name,value}= e.target;
            setState({...state,[name]: value})
            
    };

    const ImageUpload=(e)=>{
        setState({...state,pan: e.target.files[0] })
    }


  return (
    <div style={{marginTop: "100px"}}>
        <form style={{
            margin: "auto",
            padding: "15px",
            maxWidth: "400px",
            alignContent: "center"
        }}
        onSubmit={handleSubmit}
        >
        <WebcamCapture getData={getData}/>
        <p>
        Latitude: <span id='latitude'></span><br/>
        Longitude: <span id='longitude'></span>
        </p>
        <label htmlFor='name'>Name</label>
        <input type="text" id="name" name="name" value={name || ''} onChange={handleInputChange}/>
        <label htmlFor='dob'>Date of Birth</label>
        <input type="date" id="dob" name="dob" value={dob || ''} max='2022-05-27' onChange={handleInputChange}/>
        <label htmlFor='adhaar'>Adhaar Number</label>
        <input type="number" id="adhaar" name="adhaar" value={adhaar || ''}  onChange={handleInputChange}/>
        <label htmlFor='pan'>Pan</label><br/>
        <input type="file" id="pan" name="pan" accept="image/*" onChange={ImageUpload}/>
        <input type="submit" value={id ? "Update" : "Save"}/>
        <Link to={"/"}>
            <input type="button" value="Go back"/>
        </Link>
        </form>
    </div>
  )
}

export default AddEdit;