import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdatePost() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8099/getUser/${id}`)
        .then(res => {
            const userData = res.data;
            setName(userData.name);
            setEmail(userData.email);
        })
        .catch(err => console.log(err));
    }, [id]);

    function handleSubmit(event){
        event.preventDefault();
        axios.put('http://localhost:8099/update/'+id, {name, email})
        .then(res => {
            console.log(res);
            navigate('/');
        }).catch(err => console.log(err))
    }

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center bg-primary'>
        <div className='w-50 bg-white rounded p-3'>
            <form onSubmit={handleSubmit}>
                <h2>Update user</h2>
                <div className='mb-2'>
                    <label htmlFor=''>Name</label>
                    <input type='text' value={name} placeholder='Enter name' className='form-control' onChange={e => setName(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor=''>Email</label>
                    <input type='text'value={email} placeholder='Enter email' className='form-control' onChange={e => setEmail(e.target.value)} />
                </div>
                <button className='btn btn-success'>Update</button>
            </form>
        </div>
    </div>
  )
}

export default UpdatePost;