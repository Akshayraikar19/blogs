import {useAuth}from "../context/AuthContext"
export default function Account(){
    const {user}=useAuth()
    //console.log(user.account)
   return( 
    <div>
        {user &&
        <>
            <h1> My Account </h1>
            <p>Username-{user?.account?.username}</p>
            <p>Email-{user?.account?.email}</p>
            <p>Bio-{user?.account?.bio}</p>
        </>
       }
     </div>
 )
}