import { createContext,useContext,useReducer } from "react";

export const AuthContext=createContext()

export const  useAuth=()=>{
    return useContext(AuthContext)

}

const reducer=(state,action)=>{
    switch(action.type){
        case "LOGIN":{
            return {...state ,account:action.payload.account,isLoggedIn: true}
        }
        case "LOGOUT":{
               return {...state, account:null,isLoggedIn: false,}
        }
        default:{
            return {...state}
        }
    }

}
export const AuthProvider=({children})=>{
    const [user,dispatch]=useReducer(reducer,{
        isLoggedIn:false,
        account:null,
        //profile:null
    })
    console.log(user.account)
    return (
        <div>
            <AuthContext.Provider value={{user,dispatch}}>
                {children}
            </AuthContext.Provider>
        </div>
    )
}