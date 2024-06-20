import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";
import { toast } from 'react-toastify';
import axios from "axios";
import Moment from "moment";
//import _ from "lodash";

//let pageSize = 1;

let Home = () => {

  let [data,setData]= useState([]);
  let [imageSrc, setImageSrc] = useState(null);

  //let [paginatedPosts, setpaginatedPosts]=useState([]);
  //let [currentPage, setcurrentPage]=useState(1);

    let loadData = async() =>{
        
        // setData(response.data);
    };

    useEffect(()=>{
      axios.get("http://localhost:5000/api/get")
      .then((response) => {
        console.log("console--->",response.data)
        setData(response?.data)
        //debugger
        const myFile = new File([response.data[0].pan.data], 'image.png', {
          type: response.data[0].pan.type,
      });
      console.log(myFile)
        /* const blob = new Blob([new Uint8Array(response.data[0].pan.data)], {
          type: 'application/jpeg',
        });
        console.log(blob); */
        setImageSrc(myFile);
        //setpaginatedPosts(_(response.data).slice(0).take(pageSize).value());
      }).catch((err)=>console.log("err===>",err))

    },[]);
    console.log("hit check")
    let deleteData=(id)=>{
            if(window.confirm("Are you sure?")){
                axios.delete(`http://localhost:5000/api/remove/${id}`);
                toast.success("Deleted Sucessfully");
                setTimeout(loadData(),500);
            }
    }

    /* let pageCount = data? Math.ceil(data.length/pageSize):0;
    if (pageCount === 1) return null;
    let pages= _.range (1, pageCount+1);

    let pagination = (pageNo) =>{
    setcurrentPage (pageNo);
    let startIndex= (pageNo-1)* pageSize;
    let paginatedPost=_(data).slice(startIndex).take(pageSize).value();
    setpaginatedPosts(paginatedPost)
    }; */
  

  return (
    <div style={{marginTop: "150px"}}>

        <Link to={"/addCustomer"}>
        <button className='btn btn-customer'>Add Customer</button>
        </Link>
    
        <table className='styled-table'> 
            <thead>
                <tr>
                    <th style={{textAlign: "center"}}>ID</th>
                    <th style={{textAlign: "center"}}>Name</th>
                    <th style={{textAlign: "center"}}>Date of Birth</th>
                    <th style={{textAlign: "center"}}>Adhaar Number</th>
                    <th style={{textAlign: "center"}}>Pan</th>
                    <th style={{textAlign: "center"}}>Action</th>
                </tr>
            </thead>
            <tbody> 
                {data.map((item,index)=>{
                  return(
                    <tr key={item.id}>
                         <th scope='row'>{index+1}</th>
                         <td>{item.name}</td>
                         <td>{Moment(item.dob).format('DD-MM-YYYY')} </td>
                         <td>{item.adhaar}</td>
                         <td><img src={`${imageSrc.name}`} alt="PAN" width="50" height="50"/></td>
                         <td>
                             <Link to={`/update/${item.id}`}>
                                 <button className='btn btn-edit'>Edit</button>
                             </Link> 
                                <button className='btn btn-delete' onClick={()=>deleteData(item.id)}>Delete</button>
                             <Link to={`/view/${item.id}`}>
                                 <button className='btn btn-view'>View</button>
                             </Link>
                         </td>
                    </tr>
                  )
                })}
            </tbody>
        </table>
    </div>
  )
}

export default Home;


