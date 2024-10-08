import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { Nav } from "react-bootstrap";
import "./Login.css";
import { useNavigate } from "react-router";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);

    axios.post("http://cfood.obereg.net:5000/auth/login", {login:data.email,password:data.password})
      .then(res=>{ 
        console.log (res)
        if (res.data.id){
          localStorage.setItem('user',JSON.stringify(res.data))
        }
        if (res.data.role === "provider") {
          console.log("Provider ID: ", res.data.provider_id); 
           localStorage.setItem("provider_id", res.data.id);
          navigate('/offers')
        }
        if (res.data.role==="user"){
          navigate('/homePageLover')// i have to change to food lover reservation
        }
        
      })
      .catch(err=>console.log(err))
  }
    


  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          {...register("email",{ required: true })}
          type="email"
          placeholder="Enter email"
        />
        {errors.email && errors.email.type === "required" && (
          <span className="text-danger"> Email is required</span>
        )}
      </Form.Group>
      <Form.Group>
        {errors.email && errors.email.type === "required" && (
          <span className="text-danger"> Email is required</span>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
        />
        {errors.password && errors.password.type === "required" && (
          <span className="text-danger"> Password is required</span>
        )}
      </Form.Group>
     

      <Button variant="primary" type="submit">
        Login
      </Button>
      <p>
        <br></br>
        if you do not have an account{" "}
        <Nav.Link href="/register" className="text-center">
          Register
        </Nav.Link>
      </p>
    </Form>
  );
};

export default Login;
