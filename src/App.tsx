import { useState } from "react"
import axios from "axios"
import { BaseService } from "./service"

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

const error = (err:any) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

const Service = new BaseService("http://localhost:8888")


function getLatLong () {
  let lat:any
  let long:any
  navigator.geolocation.getCurrentPosition((position:any) => {
      const Coords = position.coords;
      lat = Coords.latitude
      long = Coords.longitude
      console.log(lat, long)
  }, error, options);
  // return ({ lat, long })
}

export default function App () {

  const [username, $username] = useState<string>("")
  const [password, $password] = useState<string>("")

  const doSomething = () =>  {
    return Service.instance.get("/test")
  }

  const handleSignup = async (e:any) => {
    e.preventDefault()
    try {
      let { data } = await axios.post ("http://localhost:8888/user/signup", { username, password })
      alert(`Success`)
    } catch (err) {
      alert(`Fail`)
      console.log(err)
    }
  }


  const handleSignIn = async (e:any) => {
    e.preventDefault()
    try {

      navigator.geolocation.getCurrentPosition(async (position:any) => {
        const Coords = position.coords;
        let lat = Coords.latitude
        let long = Coords.longitude
        let res = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=03c48dae07364cabb7f121d8c1519492&no_annotations=1&language=en`)
        let { data } = await axios.post ("http://localhost:8888/user/signin", { username, password, lat, long })
        localStorage.setItem(`auth`, data.auth)
        alert(`Success`)
      }, error, options);
    } catch (error) {
      alert(`Fail`)
      console.log(error)
    }
  }

  return <div>

    <button onClick={doSomething}>TEST</button>
    <form onSubmit={handleSignup}>
      <input type="text" onChange={(e:any) => $username(e.target.value)} />
      <input type="password" onChange={(e:any) => $password(e.target.value)} />
      <button type="submit">Sign up</button>
    </form>

    <form onSubmit={handleSignIn}>
      <input type="text" onChange={(e:any) => $username(e.target.value)} />
      <input type="password" onChange={(e:any) => $password(e.target.value)} />
      <button type="submit">Sign in</button>
    </form>
  </div>
}
