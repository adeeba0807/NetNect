import React from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router'
import { useSelector } from "react-redux";

function NavBarComponent(){
    const router=useRouter();


    const authState = useSelector((state) => state.auth);
  return (
    <div className={styles.container}>
     <nav className={styles.navBar}>

        <h1 style={{cursor:"pointer"}} onClick={()=>{
            router.push("/")
        }

        }>NetNect</h1>
         
         <div className={styles.navBarOptionContainer}>

             {authState.profileFetched && <div>

              <div style={{display :"flex",gap:"1.2rem"}}>
                  <p>Hey, {authState.user?.name || "User"}</p>
                  <p  style={{fontWeight:"bold"}}>Profile</p>
               </div>
              
              
              </div>}
          
          {!authState.profileFetched && <div onClick={()=>{
                
                    router.push("/login")
                }} className={styles.buttonJoin}>
                    <p>Be a Part</p>
                </div>}

         </div>
     </nav>
    </div>

  )
}

export default NavBarComponent
