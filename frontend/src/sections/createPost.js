import React, {useState} from 'react'
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap-v5';
import Swal from 'sweetalert2';

function CreatePost({ onClose, fetchData }) {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    function handleSubmit(event){
        event.preventDefault();
        axios.post('http://localhost:8099/create', {name, email})
        .then(res => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'User added!',
              }).then(() => {
                onClose();
                fetchData();
              });
        }).catch(err => console.log(err))
    }

  return (
    <Modal show={true} onHide={onClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Add User</Modal.Title>
        <button
          type='button'
          className='btn-close'
          aria-label='Close'
          onClick={onClose}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-2'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Button variant='success' type='submit'>
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default CreatePost