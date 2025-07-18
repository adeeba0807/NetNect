import React from 'react'
import styles from "./index.module.css"
export default function DashboardLayout
({children}) {
  return (
    <div>  
  <div className='container'>
    <div className={styles.homeContainer}>

      <div className="homeContainer__leftBar">



        
      </div>
       

      <div className="homeContainer__feedContainer">
      
           {children}
         </div>

       <div className="homeContainer__extraContainer">


       </div>

 </div>

  
    

      </div>

    </div>
  )
}
